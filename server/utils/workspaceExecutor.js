import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'crypto';
import { ensureWorkspace } from './workspaceManager.js';

const DEFAULT_TIMEOUT_MS = Number(process.env.WORKSPACE_EXEC_TIMEOUT_MS || 120000);

const collect = (stream, chunks) => {
  stream.on('data', (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  });
};

export const runBashInWorkspace = async ({
  workspace = 'default',
  script,
  cwd = 'work',
  timeoutMs = DEFAULT_TIMEOUT_MS,
  env = {},
}) => {
  if (!script || !String(script).trim()) {
    throw new Error('Missing shell script');
  }

  const paths = await ensureWorkspace(workspace);
  const cwdMap = {
    work: paths.workDir,
    repos: paths.reposDir,
    downloads: paths.downloadsDir,
    logs: paths.logsDir,
    root: paths.root,
  };

  const actualCwd = cwdMap[cwd] || path.resolve(paths.root, cwd);
  await fs.mkdir(actualCwd, { recursive: true });

  const runId = crypto.randomUUID();
  const stdoutChunks = [];
  const stderrChunks = [];
  const startedAt = new Date().toISOString();

  return await new Promise((resolve, reject) => {
    const child = spawn('/bin/bash', ['-lc', script], {
      cwd: actualCwd,
      env: {
        ...process.env,
        ...env,
        VIKTRON_WORKSPACE: workspace,
        VIKTRON_WORKSPACE_ROOT: paths.root,
        VIKTRON_WORK_DIR: paths.workDir,
        VIKTRON_REPOS_DIR: paths.reposDir,
        VIKTRON_DOWNLOADS_DIR: paths.downloadsDir,
        VIKTRON_LOGS_DIR: paths.logsDir,
      },
    });

    collect(child.stdout, stdoutChunks);
    collect(child.stderr, stderrChunks);

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
    }, timeoutMs);

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', async (code, signal) => {
      clearTimeout(timeout);
      const stdout = Buffer.concat(stdoutChunks).toString('utf8');
      const stderr = Buffer.concat(stderrChunks).toString('utf8');
      const completedAt = new Date().toISOString();

      const logFile = path.join(paths.logsDir, `${runId}.json`);
      const record = {
        run_id: runId,
        workspace,
        cwd: actualCwd,
        started_at: startedAt,
        completed_at: completedAt,
        exit_code: code,
        signal,
        script,
        stdout,
        stderr,
      };
      await fs.writeFile(logFile, JSON.stringify(record, null, 2), 'utf8');

      resolve({
        ...record,
        log_file: logFile,
      });
    });
  });
};
