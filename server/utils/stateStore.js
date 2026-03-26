import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '..', 'data', 'agent-state.json');

const DEFAULT_STATE = {
  memories: [],
  tools: [],
  skills: [],
  schedules: [],
  taskRuns: [],
};

let writeQueue = Promise.resolve();

const ensureStoreFile = async () => {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STATE, null, 2), 'utf8');
  }
};

const readState = async () => {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  try {
    return { ...DEFAULT_STATE, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { ...DEFAULT_STATE };
  }
};

const writeState = async (nextState) => {
  await ensureStoreFile();
  writeQueue = writeQueue.then(() =>
    fs.writeFile(STORE_PATH, JSON.stringify(nextState, null, 2), 'utf8')
  );
  await writeQueue;
  return nextState;
};

const sortByNewest = (items) => [...items].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));

export const listMemories = async (workspace = 'default') => {
  const state = await readState();
  return sortByNewest(state.memories.filter((item) => item.workspace === workspace));
};

export const addMemory = async ({ workspace = 'default', source = 'api', content, tags = [], metadata = {} }) => {
  const state = await readState();
  const now = new Date().toISOString();
  const memory = {
    id: crypto.randomUUID(),
    workspace,
    source,
    content,
    tags,
    metadata,
    created_at: now,
    updated_at: now,
  };
  state.memories.push(memory);
  await writeState(state);
  return memory;
};

export const searchMemories = async ({ workspace = 'default', query = '', limit = 10 }) => {
  const memories = await listMemories(workspace);
  const lower = query.toLowerCase();
  return memories
    .filter((item) => !lower || item.content.toLowerCase().includes(lower) || item.tags.some((tag) => tag.toLowerCase().includes(lower)))
    .slice(0, limit);
};

export const listTools = async (workspace = 'default') => {
  const state = await readState();
  return sortByNewest(state.tools.filter((item) => item.workspace === workspace));
};

export const listSkills = async (workspace = 'default') => {
  const state = await readState();
  return sortByNewest(state.skills.filter((item) => item.workspace === workspace));
};

export const upsertSkill = async ({
  workspace = 'default',
  key,
  name,
  description = '',
  content,
  enabled = true,
  source = 'api',
}) => {
  const state = await readState();
  const now = new Date().toISOString();
  const existingIndex = state.skills.findIndex((item) => item.workspace === workspace && item.key === key);
  const record = {
    id: existingIndex >= 0 ? state.skills[existingIndex].id : crypto.randomUUID(),
    workspace,
    key,
    name,
    description,
    content,
    enabled,
    source,
    created_at: existingIndex >= 0 ? state.skills[existingIndex].created_at : now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    state.skills[existingIndex] = record;
  } else {
    state.skills.push(record);
  }

  await writeState(state);
  return record;
};

export const upsertTool = async ({ workspace = 'default', key, name, category = 'general', status = 'connected', description = '', config = {} }) => {
  const state = await readState();
  const now = new Date().toISOString();
  const existingIndex = state.tools.findIndex((item) => item.workspace === workspace && item.key === key);
  const record = {
    id: existingIndex >= 0 ? state.tools[existingIndex].id : crypto.randomUUID(),
    workspace,
    key,
    name,
    category,
    status,
    description,
    config,
    created_at: existingIndex >= 0 ? state.tools[existingIndex].created_at : now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    state.tools[existingIndex] = record;
  } else {
    state.tools.push(record);
  }

  await writeState(state);
  return record;
};

export const listSchedules = async (workspace = 'default') => {
  const state = await readState();
  return sortByNewest(state.schedules.filter((item) => item.workspace === workspace));
};

export const createSchedule = async ({
  workspace = 'default',
  title,
  cadence = 'daily',
  prompt,
  capability = 'research_intelligence',
  payload = {},
  next_run_at,
  delivery = { channel: 'api' },
  active = true,
}) => {
  const state = await readState();
  const now = new Date().toISOString();
  const schedule = {
    id: crypto.randomUUID(),
    workspace,
    title,
    cadence,
    prompt,
    capability,
    payload,
    next_run_at,
    last_run_at: null,
    last_result: null,
    delivery,
    active,
    created_at: now,
    updated_at: now,
  };
  state.schedules.push(schedule);
  await writeState(state);
  return schedule;
};

export const updateSchedule = async (id, updater) => {
  const state = await readState();
  const index = state.schedules.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const current = state.schedules[index];
  const next = {
    ...current,
    ...updater,
    updated_at: new Date().toISOString(),
  };
  state.schedules[index] = next;
  await writeState(state);
  return next;
};

export const listDueSchedules = async (nowIso = new Date().toISOString()) => {
  const state = await readState();
  return state.schedules.filter((item) => item.active && item.next_run_at && item.next_run_at <= nowIso);
};

export const addTaskRun = async ({ workspace = 'default', schedule_id = null, request, capability, status, result }) => {
  const state = await readState();
  const run = {
    id: crypto.randomUUID(),
    workspace,
    schedule_id,
    request,
    capability,
    status,
    result,
    created_at: new Date().toISOString(),
  };
  state.taskRuns.push(run);
  state.taskRuns = state.taskRuns.slice(-200);
  await writeState(state);
  return run;
};

export const listTaskRuns = async (workspace = 'default') => {
  const state = await readState();
  return sortByNewest(state.taskRuns.filter((item) => item.workspace === workspace));
};
