import { executeBrowserUseTask, isBrowserUseConfigured } from './browserUseClient.js';

export const BROWSER_RUNTIME_ARCHITECTURE = {
  ownership: 'Viktron-owned browser runtime facade',
  execution: 'pluggable browser worker or Browser Use adapter',
  observability: 'session logs, task runs, and workspace memories',
  scaling: 'queue-backed worker execution owned by Viktron',
};

export const isBrowserRuntimeConfigured = () => isBrowserUseConfigured();

export const executeBrowserRuntimeTask = async (args) => executeBrowserUseTask(args);
