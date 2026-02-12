import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const getRepoRoot = () => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  return path.resolve(dirname, '..', '..');
};

const asString = (value) => (typeof value === 'string' ? value : '');

const normalizeDescriptionLine = (text) => {
  const line = asString(text).replace(/\r/g, '').split('\n')[0] || '';
  const cleaned = line
    .replace(/^#+\s*/g, '')
    .replace(/^\*\*\s*/g, '')
    .replace(/\s*\*\*$/g, '')
    .trim();
  return cleaned;
};

const toTitle = (text) => {
  const cleaned = asString(text).trim();
  if (!cleaned) return '';
  return cleaned;
};

const camelToWords = (text) =>
  asString(text)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim();

const extractIntegrationsFromNodes = (nodes) => {
  const ignored = new Set([
    'set',
    'start',
    'splitInBatches',
    'merge',
    'if',
    'switch',
    'function',
    'functionItem',
    'executeWorkflow',
    'wait',
    'noOp',
    'stickyNote',
    'webhook',
    'scheduleTrigger',
    'cron',
    'httpRequest',
    'executeWorkflowTrigger',
    'manualTrigger',
    'chatTrigger',
    'toolThink',
    'toolWorkflow',
  ]);

  const integrations = new Set();

  for (const node of Array.isArray(nodes) ? nodes : []) {
    const type = asString(node?.type);
    if (!type) continue;

    const simple = type.split('.').pop() || type;

    if (
      type.includes('n8n-nodes-base') ||
      type.includes('@n8n/n8n-nodes-langchain') ||
      type.includes('n8n-nodes-langchain')
    ) {
      if (!ignored.has(simple) && !/Trigger$/i.test(simple)) {
        const readable = camelToWords(simple);
        if (readable) integrations.add(readable[0].toUpperCase() + readable.slice(1));
      }

      if (/langchain/i.test(type)) {
        if (/openAi/i.test(simple)) integrations.add('OpenAI');
        if (/anthropic/i.test(simple)) integrations.add('Anthropic');
        if (/huggingFace/i.test(simple)) integrations.add('HuggingFace');
        if (/gemini/i.test(simple)) integrations.add('Gemini');
        if (/ollama/i.test(simple)) integrations.add('Ollama');
        if (/memory/i.test(simple)) integrations.add('AI Memory');
        if (/agent/i.test(simple)) integrations.add('AI Agent');
      }
    }
  }

  return Array.from(integrations).slice(0, 25);
};

const extractStickyNotes = (nodes) => {
  const notes = [];
  for (const node of Array.isArray(nodes) ? nodes : []) {
    if (asString(node?.type) !== 'n8n-nodes-base.stickyNote') continue;
    const content = asString(node?.parameters?.content).trim();
    if (!content) continue;
    notes.push(content);
  }
  return notes;
};

const buildInstructionsMarkdown = ({ name, fileName, integrations, stickyNotes }) => {
  const title = toTitle(name) || fileName;
  const lines = [];
  lines.push(`# ${title}`);
  lines.push('');
  lines.push('## Import');
  lines.push('1. In n8n, go to **Workflows** → **Import from File**.');
  lines.push(`2. Import the workflow JSON file: **${fileName}**.`);
  lines.push('');

  if (integrations?.length) {
    lines.push('## Key Integrations');
    for (const item of integrations) lines.push(`- ${item}`);
    lines.push('');
  }

  if (stickyNotes?.length) {
    lines.push('## Setup Notes');
    lines.push('');
    stickyNotes.forEach((note, idx) => {
      const cleaned = asString(note).trim();
      if (!cleaned) return;
      lines.push(`### Note ${idx + 1}`);
      lines.push(cleaned);
      lines.push('');
    });
  } else {
    lines.push('## Setup Notes');
    lines.push('No setup notes were found in this workflow.');
    lines.push('');
  }

  return lines.join('\n');
};

const main = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const args = new Set(process.argv.slice(2));
  const fromDb = args.has('--from-db');
  const overwriteDescription = args.has('--overwrite-description');
  const overwriteInstructions = args.has('--overwrite-instructions');
  const overwriteIntegrations = args.has('--overwrite-integrations');

  const jsonDirArg = process.argv.find((a) => a.startsWith('--json-dir='));
  const jsonDir = jsonDirArg
    ? jsonDirArg.replace('--json-dir=', '')
    : path.join(getRepoRoot(), 'n8n');

  if (fromDb) {
    console.log('Generating workflow docs from DB workflow_json...');
  } else {
    console.log(`Reading n8n JSON files from: ${jsonDir}`);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  });

  let updated = 0;
  let skipped = 0;
  let notFound = 0;
  let errors = 0;

  const client = await pool.connect();

  try {
    if (fromDb) {
      const dbRows = await client.query(
        `SELECT id, file_name, name, description, instructions_md, integrations, workflow_json
         FROM store_workflows
         WHERE is_active = TRUE AND workflow_json IS NOT NULL`
      );

      console.log(`Found ${dbRows.rows.length} workflows with workflow_json in DB`);

      for (const row of dbRows.rows) {
        try {
          const fileName = asString(row.file_name) || 'workflow.json';
          const workflowName = toTitle(row?.name) || fileName.replace(/\.json$/i, '');
          const json = row.workflow_json;
          const nodes = Array.isArray(json?.nodes) ? json.nodes : [];

          const stickyNotes = extractStickyNotes(nodes);
          const descriptionFromSticky = stickyNotes.length ? normalizeDescriptionLine(stickyNotes[0]) : '';
          const computedDescription = descriptionFromSticky || '';

          const computedIntegrations = extractIntegrationsFromNodes(nodes);
          const computedInstructionsMd = buildInstructionsMarkdown({
            name: workflowName,
            fileName,
            integrations: computedIntegrations,
            stickyNotes,
          });

          const nextDescription =
            overwriteDescription || !asString(row.description).trim()
              ? (computedDescription || null)
              : row.description;

          const nextInstructions =
            overwriteInstructions || !asString(row.instructions_md).trim()
              ? (computedInstructionsMd || null)
              : row.instructions_md;

          const nextIntegrations =
            overwriteIntegrations || !Array.isArray(row.integrations) || row.integrations.length === 0
              ? computedIntegrations
              : row.integrations;

          const noChange =
            (asString(row.description) || '') === (asString(nextDescription) || '') &&
            (asString(row.instructions_md) || '') === (asString(nextInstructions) || '') &&
            JSON.stringify(row.integrations || []) === JSON.stringify(nextIntegrations || []);

          if (noChange) {
            skipped += 1;
            continue;
          }

          await client.query(
            `UPDATE store_workflows
             SET description = $1,
                 instructions_md = $2,
                 integrations = $3
             WHERE id = $4`,
            [nextDescription, nextInstructions, nextIntegrations, row.id]
          );

          updated += 1;
        } catch (err) {
          errors += 1;
          if (errors <= 20) console.error(`  Error processing DB row ${row?.file_name}:`, err?.message || err);
        }
      }
    } else {
      const files = await fs.readdir(jsonDir);
      const jsonFiles = files.filter((f) => f.toLowerCase().endsWith('.json'));
      console.log(`Found ${jsonFiles.length} JSON files`);

      for (const fileName of jsonFiles) {
        const filePath = path.join(jsonDir, fileName);

        try {
          const content = await fs.readFile(filePath, 'utf8');
          const json = JSON.parse(content);

          const workflowName = toTitle(json?.name) || fileName.replace(/\.json$/i, '');
          const nodes = Array.isArray(json?.nodes) ? json.nodes : [];

          const stickyNotes = extractStickyNotes(nodes);
          const descriptionFromSticky = stickyNotes.length ? normalizeDescriptionLine(stickyNotes[0]) : '';
          const description = descriptionFromSticky || '';

          const integrations = extractIntegrationsFromNodes(nodes);
          const instructionsMd = buildInstructionsMarkdown({
            name: workflowName,
            fileName,
            integrations,
            stickyNotes,
          });

          const existing = await client.query(
            `SELECT description, instructions_md, integrations FROM store_workflows WHERE file_name = $1 LIMIT 1`,
            [fileName]
          );

          if (!existing.rows.length) {
            notFound += 1;
            if (notFound <= 15) console.log(`  Not found in DB: ${fileName}`);
            continue;
          }

          const current = existing.rows[0];
          const nextDescription =
            overwriteDescription || !asString(current.description).trim() ? (description || null) : current.description;

          const nextInstructions =
            overwriteInstructions || !asString(current.instructions_md).trim()
              ? (instructionsMd || null)
              : current.instructions_md;

          const nextIntegrations =
            overwriteIntegrations || !Array.isArray(current.integrations) || current.integrations.length === 0
              ? integrations
              : current.integrations;

          // If nothing would change, skip.
          const noChange =
            (asString(current.description) || '') === (asString(nextDescription) || '') &&
            (asString(current.instructions_md) || '') === (asString(nextInstructions) || '') &&
            JSON.stringify(current.integrations || []) === JSON.stringify(nextIntegrations || []);

          if (noChange) {
            skipped += 1;
            continue;
          }

          await client.query(
            `UPDATE store_workflows
             SET description = $1,
                 instructions_md = $2,
                 integrations = $3
             WHERE file_name = $4`,
            [nextDescription, nextInstructions, nextIntegrations, fileName]
          );

          updated += 1;
        } catch (err) {
          errors += 1;
          if (errors <= 20) console.error(`  Error processing ${fileName}:`, err?.message || err);
        }
      }
    }
  } finally {
    client.release();
    await pool.end();
  }

  console.log(`\nDocs import complete:`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (no change): ${skipped}`);
  console.log(`  Not found in DB: ${notFound}`);
  console.log(`  Errors: ${errors}`);

  if (notFound > 15) console.log('  (only first 15 "not found" shown)');
  if (errors > 20) console.log('  (only first 20 errors shown)');
};

main().catch((err) => {
  console.error('Import failed:', err?.message || err);
  process.exit(1);
});
