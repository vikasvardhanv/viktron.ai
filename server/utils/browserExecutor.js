import { runBashInWorkspace } from './workspaceExecutor.js';

const needsConfig = (message) => ({
  status: 'needs_configuration',
  result: message,
});

export const executeBrowserTask = async ({ workspace = 'default', payload = {} }) => {
  const mode = process.env.BROWSER_EXECUTOR_MODE || 'shell';

  if (mode === 'shell') {
    const script = String(payload.script || '').trim();
    if (!script) {
      return needsConfig('Browser executor requires payload.script when BROWSER_EXECUTOR_MODE=shell.');
    }

    const result = await runBashInWorkspace({
      workspace,
      script,
      cwd: payload.cwd || 'work',
      timeoutMs: Number(payload.timeout_ms || 180000),
      env: {
        ...(payload.env || {}),
        BROWSER_TARGET_URL: payload.url || '',
      },
    });

    return {
      status: result.exit_code === 0 ? 'completed' : 'failed',
      result: {
        mode,
        url: payload.url || null,
        exit_code: result.exit_code,
        stdout: result.stdout,
        stderr: result.stderr,
        log_file: result.log_file,
      },
    };
  }

  if (mode === 'remote' && process.env.BROWSER_EXECUTOR_URL) {
    const response = await fetch(process.env.BROWSER_EXECUTOR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace, ...payload }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || `Browser executor failed (${response.status})`);
    }
    return {
      status: 'completed',
      result: {
        mode,
        ...data,
      },
    };
  }

  return needsConfig('Browser executor is not configured. Set BROWSER_EXECUTOR_MODE=shell with payload.script, or configure BROWSER_EXECUTOR_URL.');
};
