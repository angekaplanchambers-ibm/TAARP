import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const storybookDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(storybookDir, '..');
const outputPath = path.join(scriptDir, 'Versions.generated.stories.tsx');
const maxEntries = Number.parseInt(process.env.VERSION_HISTORY_LIMIT || '12', 10);
const previewStoryId = process.env.VERSION_PREVIEW_STORY_ID || 'wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form';

function runGit(args) {
  try {
    return execFileSync('git', ['-C', repoRoot, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function parseCommitLine(line) {
  const [sha, shortSha, committedAt, author, subject] = line.split('\x1f');

  if (!sha || !committedAt) {
    return null;
  }

  return {
    sha,
    shortSha,
    committedAt,
    author: author || 'Unknown author',
    subject: subject || 'Untitled change',
  };
}

function getCommits() {
  const log = runGit([
    'log',
    `--max-count=${Number.isFinite(maxEntries) ? maxEntries : 30}`,
    '--date=iso-strict',
    '--pretty=format:%H%x1f%h%x1f%cI%x1f%an%x1f%s',
  ]);

  return log
    .split('\n')
    .map(parseCommitLine)
    .filter(Boolean);
}

function formatStoryName(isoTimestamp) {
  const date = new Date(isoTimestamp);

  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).formatToParts(date);

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.month} ${value.day}, ${value.year} ${value.hour}:${value.minute}:${value.second} ${value.timeZoneName}`;
}

function getProductionTimestamp(commit, index) {
  const currentSha = process.env.VERSION_PRODUCTION_SHA || process.env.GITHUB_SHA;

  if (index === 0 && currentSha && commit.sha.startsWith(currentSha)) {
    return process.env.VERSION_PRODUCTION_AT || process.env.GITHUB_EVENT_HEAD_COMMIT_TIMESTAMP || commit.committedAt;
  }

  if (index === 0 && process.env.VERSION_PRODUCTION_AT) {
    return process.env.VERSION_PRODUCTION_AT;
  }

  return commit.committedAt;
}

function getCommitUrl(sha) {
  const repository = process.env.GITHUB_REPOSITORY;
  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';

  if (!repository) {
    return '';
  }

  return `${serverUrl}/${repository}/commit/${sha}`;
}

function buildEntries() {
  return getCommits().map((commit, index) => {
    const productionAt = getProductionTimestamp(commit, index);
    const storyName = formatStoryName(productionAt);
    const runUrl = process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : '';

    return {
      id: `version-${String(index + 1).padStart(3, '0')}`,
      storyExport: `Version${String(index + 1).padStart(3, '0')}`,
      storyName,
      previewUrl: `./version-previews/${commit.shortSha}/iframe.html?id=${previewStoryId}&viewMode=story`,
      storybookUrl: `./version-previews/${commit.shortSha}/?path=/story/${previewStoryId}`,
      productionAt,
      committedAt: commit.committedAt,
      shortSha: commit.shortSha,
      sha: commit.sha,
      subject: commit.subject,
      author: commit.author,
      branch: process.env.VERSION_PRODUCTION_REF || process.env.GITHUB_REF_NAME || 'main',
      source: index === 0 && process.env.GITHUB_ACTIONS === 'true' ? 'GitHub Pages production deployment' : 'Git commit history',
      commitUrl: getCommitUrl(commit.sha),
      runUrl: index === 0 ? runUrl : '',
    };
  });
}

function indentJson(value) {
  return JSON.stringify(value, null, 2).replace(/^/gm, '  ').trimStart();
}

function renderStoryFile(entries) {
  const stories = entries.length > 0
    ? entries.map((entry, index) => `export const ${entry.storyExport}: Story = {\n  name: ${JSON.stringify(entry.storyName)},\n  render: () => <VersionRecord entry={versionEntries[${index}]} />,\n};`).join('\n\n')
    : `export const NoVersionsRecorded: Story = {\n  name: 'No versions recorded',\n  render: () => <EmptyVersionRecord />,\n};`;

  return `import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

type VersionEntry = {
  id: string;
  storyExport: string;
  storyName: string;
  previewUrl: string;
  storybookUrl: string;
  productionAt: string;
  committedAt: string;
  shortSha: string;
  sha: string;
  subject: string;
  author: string;
  branch: string;
  source: string;
  commitUrl: string;
  runUrl: string;
};

const versionEntries: VersionEntry[] = ${indentJson(entries)};

const hds = {
  surfacePrimary: 'var(--token-color-surface-primary, #ffffff)',
  surfaceFaint: 'var(--token-color-surface-faint, #fafafa)',
  surfaceStrong: 'var(--token-color-surface-strong, #f1f2f3)',
  textPrimary: 'var(--token-color-foreground-strong, #0c0c0e)',
  textSecondary: 'var(--token-color-foreground-primary, #3b3d45)',
  textFaint: 'var(--token-color-foreground-faint, #656a76)',
  borderPrimary: 'var(--token-color-border-primary, #d5d7de)',
  brand: 'var(--token-color-terraform-brand, #7b42bc)',
  brandFaint: 'var(--token-color-terraform-surface, #f4ecff)',
  radiusSmall: 'var(--token-border-radius-x-small, 3px)',
  radiusMedium: 'var(--token-border-radius-medium, 6px)',
  space8: 'var(--hds-space-8, 8px)',
  space12: 'var(--hds-space-12, 12px)',
  space16: 'var(--hds-space-16, 16px)',
  space24: 'var(--hds-space-24, 24px)',
  space32: 'var(--hds-space-32, 32px)',
  fontFamily: 'var(--token-typography-font-stack-text, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif)',
  monoFamily: 'var(--token-typography-font-stack-code, ui-monospace, Menlo, Consolas, monospace)',
};

const page: CSSProperties = {
  minHeight: '100%',
  background: hds.surfaceFaint,
  color: hds.textPrimary,
  fontFamily: hds.fontFamily,
  padding: hds.space32,
  boxSizing: 'border-box',
  overflow: 'auto',
};

const panel: CSSProperties = {
  maxWidth: 1440,
  margin: '0 auto',
  background: hds.surfacePrimary,
  border: \`1px solid \${hds.borderPrimary}\`,
  borderRadius: hds.radiusMedium,
  overflow: 'hidden',
};

const previewShell: CSSProperties = {
  display: 'grid',
  gap: hds.space16,
  padding: hds.space16,
};

const previewFrameWrap: CSSProperties = {
  minHeight: 620,
  border: \`1px solid \${hds.borderPrimary}\`,
  borderRadius: hds.radiusMedium,
  background: hds.surfaceStrong,
  overflow: 'hidden',
};

const previewFrame: CSSProperties = {
  display: 'block',
  width: '100%',
  height: 620,
  border: 0,
  background: hds.surfacePrimary,
};

const header: CSSProperties = {
  display: 'grid',
  gap: hds.space8,
  padding: hds.space24,
  borderBottom: \`1px solid \${hds.borderPrimary}\`,
};

const eyebrow: CSSProperties = {
  color: hds.textFaint,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: 'uppercase',
};

const title: CSSProperties = {
  margin: 0,
  color: hds.textPrimary,
  fontSize: 24,
  lineHeight: 1.25,
  letterSpacing: 0,
};

const summary: CSSProperties = {
  margin: 0,
  color: hds.textSecondary,
  fontSize: 14,
  lineHeight: 1.5,
};

const detailsGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 0,
};

const detailCell: CSSProperties = {
  display: 'grid',
  gap: 6,
  padding: hds.space16,
  borderRight: \`1px solid \${hds.borderPrimary}\`,
  borderBottom: \`1px solid \${hds.borderPrimary}\`,
  minWidth: 0,
};

const detailLabel: CSSProperties = {
  color: hds.textFaint,
  fontSize: 12,
  fontWeight: 600,
};

const detailValue: CSSProperties = {
  color: hds.textPrimary,
  fontSize: 14,
  lineHeight: 1.45,
  wordBreak: 'break-word',
};

const codeValue: CSSProperties = {
  ...detailValue,
  fontFamily: hds.monoFamily,
};

const linkRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: hds.space12,
  padding: hds.space16,
};

const linkButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 32,
  padding: \`0 \${hds.space12}\`,
  color: hds.brand,
  background: hds.brandFaint,
  border: \`1px solid \${hds.borderPrimary}\`,
  borderRadius: hds.radiusSmall,
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
};

function formatFullDate(isoTimestamp: string) {
  const date = new Date(isoTimestamp);

  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'long',
    timeZone: 'UTC',
  }).format(date);
}

function Detail({ label, value, code = false }: { label: string; value: string; code?: boolean }) {
  return (
    <div style={detailCell}>
      <span style={detailLabel}>{label}</span>
      <span style={code ? codeValue : detailValue}>{value}</span>
    </div>
  );
}

function VersionRecord({ entry }: { entry: VersionEntry }) {
  return (
    <main style={page}>
      <section style={panel} aria-labelledby={\`version-title-\${entry.id}\`}>
        <header style={header}>
          <span style={eyebrow}>Production version</span>
          <h1 id={\`version-title-\${entry.id}\`} style={title}>{entry.storyName}</h1>
          <p style={summary}>{entry.subject}</p>
        </header>
        <section style={detailsGrid} aria-label="Version details">
          <Detail label="Production timestamp" value={formatFullDate(entry.productionAt)} />
          <Detail label="Commit timestamp" value={formatFullDate(entry.committedAt)} />
          <Detail label="Commit" value={entry.shortSha} code />
          <Detail label="Branch" value={entry.branch} code />
          <Detail label="Author" value={entry.author} />
          <Detail label="Source" value={entry.source} />
        </section>
        {(entry.commitUrl || entry.runUrl) ? (
          <nav style={linkRow} aria-label="Version links">
            {entry.commitUrl ? <a style={linkButton} href={entry.commitUrl}>Open commit</a> : null}
            {entry.runUrl ? <a style={linkButton} href={entry.runUrl}>Open deployment run</a> : null}
            <a style={linkButton} href={entry.storybookUrl}>Open archived Storybook</a>
          </nav>
        ) : null}
        <section style={previewShell} aria-label="Archived Storybook preview">
          <div style={previewFrameWrap}>
            <iframe
              src={entry.previewUrl}
              style={previewFrame}
              title={\`Archived Storybook preview for \${entry.storyName}\`}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function EmptyVersionRecord() {
  return (
    <main style={page}>
      <section style={panel}>
        <header style={header}>
          <span style={eyebrow}>Production version</span>
          <h1 style={title}>No versions recorded</h1>
          <p style={summary}>Version entries will appear after commits are available to the Storybook build.</p>
        </header>
      </section>
    </main>
  );
}

const meta = {
  title: 'Versions',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { hide: true, title: 'Versions', height: '100vh' },
  },
} satisfies Meta<typeof VersionRecord>;

export default meta;

type Story = StoryObj<typeof VersionRecord>;

${stories}
`;
}

const entries = buildEntries();
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, renderStoryFile(entries));
console.log(`Generated ${path.relative(repoRoot, outputPath)} with ${entries.length} version entr${entries.length === 1 ? 'y' : 'ies'}.`);