import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const storybookDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(storybookDir, '..');
const archiveRoot = path.resolve(storybookDir, 'public/version-previews');
const maxEntries = Number.parseInt(process.env.VERSION_PREVIEW_LIMIT || process.env.VERSION_HISTORY_LIMIT || '12', 10);
const nodeModulesPath = path.join(storybookDir, 'node_modules');

function runGit(args) {
  return execFileSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function getCommits() {
  const log = runGit([
    'log',
    `--max-count=${Number.isFinite(maxEntries) ? maxEntries : 12}`,
    '--date=iso-strict',
    '--pretty=format:%H%x1f%h%x1f%cI%x1f%s',
  ]);

  return log
    .split('\n')
    .map((line) => {
      const [sha, shortSha, committedAt, subject] = line.split('\x1f');
      return sha && shortSha ? { sha, shortSha, committedAt, subject: subject || 'Untitled change' } : null;
    })
    .filter(Boolean);
}

function run(command, args, options) {
  const result = spawnSync(command, args, {
    ...options,
    stdio: 'inherit',
    env: {
      ...process.env,
      CI: '1',
      STORYBOOK_DISABLE_TELEMETRY: '1',
      VERSION_HISTORY_LIMIT: String(maxEntries),
    },
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }
}

function archiveCommit(commit) {
  const archiveDir = path.join(archiveRoot, commit.shortSha);
  const archiveIframePath = path.join(archiveDir, 'iframe.html');

  if (existsSync(archiveIframePath)) {
    console.log(`Keeping existing preview archive for ${commit.shortSha}.`);
    return;
  }

  if (!existsSync(nodeModulesPath)) {
    throw new Error('storybook/node_modules is missing. Run npm ci in storybook before archiving version previews.');
  }

  const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'taarp-storybook-version-'));
  const worktreePath = path.join(tempRoot, commit.shortSha);

  try {
    console.log(`Archiving Storybook preview for ${commit.shortSha}: ${commit.subject}`);
    runGit(['worktree', 'add', '--detach', worktreePath, commit.sha]);

    const worktreeStorybookDir = path.join(worktreePath, 'storybook');
    const worktreeNodeModules = path.join(worktreeStorybookDir, 'node_modules');

    if (!existsSync(path.join(worktreeStorybookDir, 'package.json'))) {
      console.log(`Skipping ${commit.shortSha}; no Storybook package exists at this commit.`);
      return;
    }

    if (!existsSync(worktreeNodeModules)) {
      symlinkSync(nodeModulesPath, worktreeNodeModules, 'dir');
    }

    mkdirSync(path.join(worktreeStorybookDir, 'public'), { recursive: true });

    rmSync(archiveDir, { recursive: true, force: true });
    mkdirSync(archiveDir, { recursive: true });
    run('npm', ['--prefix', worktreeStorybookDir, 'run', 'build-storybook', '--', '--output-dir', archiveDir], { cwd: repoRoot });
    writeFileSync(path.join(archiveDir, 'version.json'), `${JSON.stringify(commit, null, 2)}\n`);
  } finally {
    try {
      runGit(['worktree', 'remove', '--force', worktreePath]);
    } catch {
      rmSync(worktreePath, { recursive: true, force: true });
    }

    rmSync(tempRoot, { recursive: true, force: true });
  }
}

mkdirSync(archiveRoot, { recursive: true });

for (const commit of getCommits()) {
  archiveCommit(commit);
}

console.log(`Version preview archives are available in ${path.relative(repoRoot, archiveRoot)}.`);