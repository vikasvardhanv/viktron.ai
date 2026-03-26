import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const WORKSPACES_ROOT = process.env.VIKTRON_WORKSPACES_ROOT || path.join(ROOT, 'data', 'workspaces');

const slugify = (value = 'default') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'default';

export const getWorkspacePaths = (workspace = 'default') => {
  const slug = slugify(workspace);
  const root = path.join(WORKSPACES_ROOT, slug);
  return {
    workspace: slug,
    root,
    workDir: path.join(root, 'work'),
    reposDir: path.join(root, 'repos'),
    downloadsDir: path.join(root, 'downloads'),
    logsDir: path.join(root, 'logs'),
    skillsDir: path.join(root, 'skills'),
  };
};

export const ensureWorkspace = async (workspace = 'default') => {
  const paths = getWorkspacePaths(workspace);
  await fs.mkdir(paths.workDir, { recursive: true });
  await fs.mkdir(paths.reposDir, { recursive: true });
  await fs.mkdir(paths.downloadsDir, { recursive: true });
  await fs.mkdir(paths.logsDir, { recursive: true });
  await fs.mkdir(paths.skillsDir, { recursive: true });
  return paths;
};
