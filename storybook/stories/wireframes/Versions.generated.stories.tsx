import type { CSSProperties } from 'react';
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

const versionEntries: VersionEntry[] = [
    {
      "id": "version-001",
      "storyExport": "Version001",
      "storyName": "Jun 01, 2026 20:38:00 UTC",
      "previewUrl": "./version-previews/07ea6be/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/07ea6be/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-06-01T15:38:00-05:00",
      "committedAt": "2026-06-01T15:38:00-05:00",
      "shortSha": "07ea6be",
      "sha": "07ea6be8691c1aea40a258ae7292e89bd711e4e4",
      "subject": "feat(showcase): publish Azure Terraform draft two",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-002",
      "storyExport": "Version002",
      "storyName": "Jun 01, 2026 15:25:25 UTC",
      "previewUrl": "./version-previews/e640314/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/e640314/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-06-01T10:25:25-05:00",
      "committedAt": "2026-06-01T10:25:25-05:00",
      "shortSha": "e640314",
      "sha": "e6403146b0c283e29ff107b80ae98b6dd92b25f0",
      "subject": "feat(storybook): remove governance step from Azure flows",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-003",
      "storyExport": "Version003",
      "storyName": "May 28, 2026 20:20:20 UTC",
      "previewUrl": "./version-previews/6bf8dbb/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/6bf8dbb/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-28T15:20:20-05:00",
      "committedAt": "2026-05-28T15:20:20-05:00",
      "shortSha": "6bf8dbb",
      "sha": "6bf8dbb5844fc79e39af58e9a86bd555af5cde5f",
      "subject": "feat(storybook): align Azure flow with portal UI",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-004",
      "storyExport": "Version004",
      "storyName": "May 27, 2026 16:51:44 UTC",
      "previewUrl": "./version-previews/88f9ea9/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/88f9ea9/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-27T11:51:44-05:00",
      "committedAt": "2026-05-27T11:51:44-05:00",
      "shortSha": "88f9ea9",
      "sha": "88f9ea9e9624f158aa7a9923ebc0082ee080d844",
      "subject": "docs(output): update scenario stepper notes",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-005",
      "storyExport": "Version005",
      "storyName": "May 27, 2026 16:05:12 UTC",
      "previewUrl": "./version-previews/a73c9cb/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/a73c9cb/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-27T11:05:12-05:00",
      "committedAt": "2026-05-27T11:05:12-05:00",
      "shortSha": "a73c9cb",
      "sha": "a73c9cb67e5c0d491845832a2c8ae6b96943c093",
      "subject": "feat(storybook): refine scenario onboarding flows",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-006",
      "storyExport": "Version006",
      "storyName": "May 27, 2026 15:07:50 UTC",
      "previewUrl": "./version-previews/5a6b466/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/5a6b466/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-27T10:07:50-05:00",
      "committedAt": "2026-05-27T10:07:50-05:00",
      "shortSha": "5a6b466",
      "sha": "5a6b466c850221e62fe3aff6a02527cddee86566",
      "subject": "feat(storybook): add scenario-based onboarding flows",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-007",
      "storyExport": "Version007",
      "storyName": "May 20, 2026 14:43:56 UTC",
      "previewUrl": "./version-previews/ae115ad/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/ae115ad/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-20T09:43:56-05:00",
      "committedAt": "2026-05-20T09:43:56-05:00",
      "shortSha": "ae115ad",
      "sha": "ae115ad822293c6ea079f35de29b4ceed5b23b7e",
      "subject": "feat(storybook): add Azure create resource entry",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-008",
      "storyExport": "Version008",
      "storyName": "May 19, 2026 18:55:22 UTC",
      "previewUrl": "./version-previews/0e1afa0/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/0e1afa0/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-19T13:55:22-05:00",
      "committedAt": "2026-05-19T13:55:22-05:00",
      "shortSha": "0e1afa0",
      "sha": "0e1afa0c231c0465448442211eaebaf9725873f7",
      "subject": "fix(storybook): refresh production version archive",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-009",
      "storyExport": "Version009",
      "storyName": "May 19, 2026 18:46:36 UTC",
      "previewUrl": "./version-previews/fe738e9/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/fe738e9/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-19T13:46:36-05:00",
      "committedAt": "2026-05-19T13:46:36-05:00",
      "shortSha": "fe738e9",
      "sha": "fe738e9c86fdfc012d4eb51a427081e30b93d473",
      "subject": "chore(output): add Azure portal splash reference",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-010",
      "storyExport": "Version010",
      "storyName": "May 19, 2026 18:46:31 UTC",
      "previewUrl": "./version-previews/f263304/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/f263304/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-19T13:46:31-05:00",
      "committedAt": "2026-05-19T13:46:31-05:00",
      "shortSha": "f263304",
      "sha": "f2633043ff391c5b3f2e8a645ffe2ce5e9632823",
      "subject": "feat(storybook): add production version history",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-011",
      "storyExport": "Version011",
      "storyName": "May 15, 2026 16:03:18 UTC",
      "previewUrl": "./version-previews/82ff744/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/82ff744/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-15T11:03:18-05:00",
      "committedAt": "2026-05-15T11:03:18-05:00",
      "shortSha": "82ff744",
      "sha": "82ff744d5b54f1c724ea451b250359ffdcaa281d",
      "subject": "chore(output): add Azure Storybook tab captures",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    },
    {
      "id": "version-012",
      "storyExport": "Version012",
      "storyName": "May 15, 2026 16:03:07 UTC",
      "previewUrl": "./version-previews/5537c0f/iframe.html?id=wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form&viewMode=story",
      "storybookUrl": "./version-previews/5537c0f/?path=/story/wireframes-azure-terraform-rp-stepper-nav-form--onboarding-form",
      "productionAt": "2026-05-15T11:03:07-05:00",
      "committedAt": "2026-05-15T11:03:07-05:00",
      "shortSha": "5537c0f",
      "sha": "5537c0f1ca52ab2cde5efad68b47725007c7d296",
      "subject": "feat(storybook): refine Azure Terraform tabbed flow",
      "author": "ange",
      "branch": "main",
      "source": "Git commit history",
      "commitUrl": "",
      "runUrl": ""
    }
  ];

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
  border: `1px solid ${hds.borderPrimary}`,
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
  border: `1px solid ${hds.borderPrimary}`,
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
  borderBottom: `1px solid ${hds.borderPrimary}`,
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
  borderRight: `1px solid ${hds.borderPrimary}`,
  borderBottom: `1px solid ${hds.borderPrimary}`,
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
  padding: `0 ${hds.space12}`,
  color: hds.brand,
  background: hds.brandFaint,
  border: `1px solid ${hds.borderPrimary}`,
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
      <section style={panel} aria-labelledby={`version-title-${entry.id}`}>
        <header style={header}>
          <span style={eyebrow}>Production version</span>
          <h1 id={`version-title-${entry.id}`} style={title}>{entry.storyName}</h1>
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
              title={`Archived Storybook preview for ${entry.storyName}`}
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

export const Version001: Story = {
  name: "Jun 01, 2026 20:38:00 UTC",
  render: () => <VersionRecord entry={versionEntries[0]} />,
};

export const Version002: Story = {
  name: "Jun 01, 2026 15:25:25 UTC",
  render: () => <VersionRecord entry={versionEntries[1]} />,
};

export const Version003: Story = {
  name: "May 28, 2026 20:20:20 UTC",
  render: () => <VersionRecord entry={versionEntries[2]} />,
};

export const Version004: Story = {
  name: "May 27, 2026 16:51:44 UTC",
  render: () => <VersionRecord entry={versionEntries[3]} />,
};

export const Version005: Story = {
  name: "May 27, 2026 16:05:12 UTC",
  render: () => <VersionRecord entry={versionEntries[4]} />,
};

export const Version006: Story = {
  name: "May 27, 2026 15:07:50 UTC",
  render: () => <VersionRecord entry={versionEntries[5]} />,
};

export const Version007: Story = {
  name: "May 20, 2026 14:43:56 UTC",
  render: () => <VersionRecord entry={versionEntries[6]} />,
};

export const Version008: Story = {
  name: "May 19, 2026 18:55:22 UTC",
  render: () => <VersionRecord entry={versionEntries[7]} />,
};

export const Version009: Story = {
  name: "May 19, 2026 18:46:36 UTC",
  render: () => <VersionRecord entry={versionEntries[8]} />,
};

export const Version010: Story = {
  name: "May 19, 2026 18:46:31 UTC",
  render: () => <VersionRecord entry={versionEntries[9]} />,
};

export const Version011: Story = {
  name: "May 15, 2026 16:03:18 UTC",
  render: () => <VersionRecord entry={versionEntries[10]} />,
};

export const Version012: Story = {
  name: "May 15, 2026 16:03:07 UTC",
  render: () => <VersionRecord entry={versionEntries[11]} />,
};
