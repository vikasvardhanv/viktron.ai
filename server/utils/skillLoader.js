import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { upsertSkill } from './stateStore.js';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_ROOT = process.env.VIKTRON_SKILLS_ROOT || path.join(__dirname, '..', 'skills');

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name === 'SKILL.md') {
      results.push(fullPath);
    }
  }

  return results;
};

const parseSkillFile = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf8');
  const relative = path.relative(SKILLS_ROOT, path.dirname(filePath));
  const defaultKey = relative.replace(/[\\/]+/g, '_').toLowerCase();
  const nameMatch = raw.match(/^name:\s*(.+)$/m);
  const descriptionMatch = raw.match(/^description:\s*(.+)$/m);

  return {
    key: (nameMatch?.[1] || defaultKey).trim().toLowerCase().replace(/\s+/g, '_'),
    name: (nameMatch?.[1] || defaultKey).trim(),
    description: (descriptionMatch?.[1] || '').trim(),
    content: raw.trim(),
    source: `file:${filePath}`,
  };
};

export const syncLocalSkillsToStore = async (workspace = 'default') => {
  try {
    const files = await walk(SKILLS_ROOT);
    const imported = [];

    for (const file of files) {
      const parsed = await parseSkillFile(file);
      const skill = await upsertSkill({
        workspace,
        ...parsed,
        enabled: true,
      });
      imported.push(skill.key);
    }

    logger.info('[Skills] synced local skills', {
      workspace,
      count: imported.length,
    });
    return imported;
  } catch (error) {
    logger.warn('[Skills] local skill sync failed', {
      workspace,
      message: error.message,
    });
    return [];
  }
};
