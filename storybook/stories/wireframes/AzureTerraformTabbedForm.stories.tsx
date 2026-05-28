import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FluentProvider, webLightTheme, Button as FluentButton, Input, Field, Select, Textarea, TabList, Tab, Checkbox, Radio, RadioGroup, SearchBox } from '@fluentui/react-components';
import { azureTerraformSteps, azureTerraformStepsB, azureTerraformStepsC } from './_azure-terraform-fixtures';
import type { AzureFormControl, AzureFormSection, AzureFormStep } from './_azure-terraform-fixtures';

type Scenario = 'A' | 'B' | 'C';
type FormValue = string | boolean;
type FormSelections = Record<string, FormValue>;
type SsoStatus = 'idle' | 'connecting' | 'connected';
type MapVerificationStatus = 'idle' | 'verifying' | 'verified';
type WorkspaceRow = {
  id: string;
  name: string;
  repoNumber: string;
  subscription: string;
  latestApplyStatus: string;
  resourceCount: number;
};

function getInitialFormSelections() {
  const selections: FormSelections = {};
  const allSteps = [...azureTerraformSteps, ...azureTerraformStepsB, ...azureTerraformStepsC];

  allSteps.forEach((step) => {
    step.sections.forEach((section) => {
      section.controls.forEach((control) => {
        if (control.kind === 'text' || control.kind === 'textarea') {
          selections[control.id] = control.value;
        }

        if (control.kind === 'select') {
          selections[control.id] = control.options[0] || '';
        }

        if (control.kind === 'checkbox') {
          selections[control.id] = Boolean(control.checked);
        }

        if (control.kind === 'radio' && control.checked) {
          selections[control.name] = control.id;
        }
      });
    });
  });

  return selections;
}

const hds = {
  surfacePrimary: 'var(--token-color-surface-primary, #ffffff)',
  surfaceFaint: 'var(--token-color-surface-faint, #fafafa)',
  surfaceStrong: 'var(--token-color-surface-strong, #f1f2f3)',
  textPrimary: 'var(--token-color-foreground-strong, #0c0c0e)',
  textSecondary: 'var(--token-color-foreground-primary, #3b3d45)',
  textFaint: 'var(--token-color-foreground-faint, #656a76)',
  borderPrimary: 'var(--token-color-border-primary, #d5d7de)',
  borderStrong: 'var(--token-color-border-strong, #b8bbc6)',
  brand: 'var(--token-color-terraform-brand, #7b42bc)',
  brandFaint: 'var(--token-color-terraform-surface, #f4ecff)',
  success: 'var(--token-color-foreground-success-on-surface, #00781e)',
  successFaint: 'var(--token-color-surface-success, #f2fbf6)',
  warning: 'var(--token-color-foreground-warning-on-surface, #9e4b00)',
  warningFaint: 'var(--token-color-surface-warning, #fff9e8)',
  shadowHigh: 'var(--token-elevation-high-box-shadow, 0 10px 30px rgba(31, 36, 48, 0.12))',
  radiusSmall: 'var(--token-border-radius-x-small, 3px)',
  radiusMedium: 'var(--token-border-radius-medium, 6px)',
  radiusLarge: 'var(--token-border-radius-large, 8px)',
  space8: 'var(--hds-space-8, 8px)',
  space12: 'var(--hds-space-12, 12px)',
  space14: '14px',
  space16: 'var(--hds-space-16, 16px)',
  space18: '18px',
  space20: 'var(--hds-space-20, 20px)',
  space22: '22px',
  space24: 'var(--hds-space-24, 24px)',
  space32: 'var(--hds-space-32, 32px)',
  fontFamily: 'var(--token-typography-font-stack-text, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif)',
  monoFamily: 'var(--token-typography-font-stack-code, ui-monospace, Menlo, Consolas, monospace)',
};

const RESPONSIVE_STYLES = `
  .azure-terraform-skip-link {
    position: absolute;
    left: var(--hds-space-16, 16px);
    top: var(--hds-space-16, 16px);
    z-index: 10;
    transform: translateY(-160%);
    transition: transform 0.15s ease;
  }

  .azure-terraform-skip-link:focus {
    transform: translateY(0);
  }

  .azure-terraform-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .azure-terraform-stepper-nav {
    flex-wrap: wrap;
  }

.azure-terraform-shell,
  .azure-terraform-header,
  .azure-terraform-overview,
  .azure-terraform-body-grid,
  .azure-terraform-field-grid {
    min-width: 0;
  }

  @media (max-width: 1024px) {
    .azure-terraform-body-grid {
      grid-template-columns: 1fr !important;
    }

    .azure-terraform-review-panel {
      position: static !important;
    }
  }

  @media (max-width: 768px) {
    .azure-splash-main {
      padding: var(--hds-space-32, 32px) var(--hds-space-16, 16px) !important;
    }

    .azure-splash-grid {
      grid-template-columns: 1fr !important;
    }

    .azure-terraform-header,
    .azure-terraform-overview {
      grid-template-columns: 1fr !important;
    }

    .azure-terraform-header {
      height: auto !important;
      align-items: flex-start !important;
      padding-block: var(--hds-space-16, 16px) !important;
    }

    .azure-terraform-main,
    .azure-terraform-panel {
      padding: var(--hds-space-16, 16px) !important;
    }

    .azure-terraform-field-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 550px) {
    .azure-terraform-stepper-nav {
      gap: 0;
    }
  }
`;

const APP_FRAME: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  gridTemplateRows: '40px minmax(0, 1fr)',
  background: hds.surfaceFaint,
  color: hds.textPrimary,
  fontFamily: hds.fontFamily,
  fontSize: 14,
  letterSpacing: 0,
  overflow: 'hidden',
};

const MAIN: CSSProperties = {
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: '#ffffff',
};

const AZ_PAGE_CHROME: CSSProperties = {
  flexShrink: 0,
  background: '#ffffff',
};

const AZ_BREADCRUMB: CSSProperties = {
  padding: '8px 32px',
  fontSize: 12,
  color: '#605e5c',
  lineHeight: 1.4,
};

const PAGE_CARD: CSSProperties = {
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'auto auto minmax(0, 1fr)',
  background: hds.surfacePrimary,
  border: `1px solid ${hds.borderPrimary}`,
  borderRadius: hds.radiusLarge,
  boxShadow: hds.shadowHigh,
  overflow: 'hidden',
};

const STEPPER_NAV: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0,
  padding: '0 24px',
  borderBottom: '1px solid #d1d1d1',
  background: '#ffffff',
};

const STEPPER_STEP_WRAPPER: CSSProperties = {
  position: 'relative',
  minWidth: 0,
};

const STEPPER_STEP: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  justifyItems: 'center',
  gap: hds.space8,
  width: '100%',
  minHeight: 88,
  border: 'none',
  background: 'transparent',
  color: hds.textSecondary,
  padding: 0,
  fontFamily: hds.fontFamily,
  textAlign: 'center',
};

const STEPPER_INDICATOR: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: 38,
  height: 38,
  borderRadius: 999,
  border: `2px solid ${hds.borderPrimary}`,
  background: hds.surfacePrimary,
  color: hds.textSecondary,
  fontFamily: hds.monoFamily,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1,
};

const PANEL: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: '24px 32px 32px',
};

const OVERVIEW: CSSProperties = {
  marginBottom: 24,
};

const BODY_GRID: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 336px',
  gap: hds.space24,
  alignItems: 'start',
};

const FORM_STACK: CSSProperties = {
  display: 'grid',
  gap: 28,
  maxWidth: 680,
};

const SECTION_CARD: CSSProperties = {
  display: 'grid',
  gap: hds.space14,
  paddingBottom: 24,
  borderBottom: '1px solid #edebe9',
};

const SECTION_HEADER: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: hds.space12,
};

const LABEL: CSSProperties = {
  display: 'block',
  marginBottom: 4,
  color: '#323130',
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.4,
  fontFamily: 'Segoe UI, system-ui, sans-serif',
};

const INPUT: CSSProperties = {
  width: '100%',
  minHeight: 24,
  boxSizing: 'border-box',
  border: '1px solid #d1d1d1',
  borderRadius: 2,
  background: '#ffffff',
  color: '#323130',
  padding: '2px 8px',
  fontSize: 14,
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  lineHeight: 1.45,
  outlineColor: 'rgb(41, 40, 39)',
};

const CHOICE_CARD: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'start',
  gap: 10,
  minHeight: 74,
  padding: 14,
  border: `1px solid ${hds.borderPrimary}`,
  borderRadius: hds.radiusLarge,
  background: hds.surfacePrimary,
};

const ACTIONS: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 8,
  paddingTop: 24,
  paddingBottom: 4,
};

const BUTTON_SET: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: 10,
  flexWrap: 'wrap',
};

const BUTTON_PRIMARY: CSSProperties = {
  minHeight: 24,
  border: '1px solid #0078d4',
  borderRadius: 2,
  background: '#0078d4',
  color: '#ffffff',
  padding: '2px 16px',
  fontSize: 14,
  fontWeight: 600,
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  cursor: 'pointer',
  lineHeight: 1.4,
  outlineColor: 'rgb(41, 40, 39)',
};

const BUTTON_SECONDARY: CSSProperties = {
  minHeight: 24,
  border: '1px solid #d1d1d1',
  borderRadius: 2,
  background: '#ffffff',
  color: '#323130',
  padding: '2px 16px',
  fontSize: 14,
  fontWeight: 400,
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  cursor: 'pointer',
  lineHeight: 1.4,
  outlineColor: 'rgb(41, 40, 39)',
};

const SKIP_LINK: CSSProperties = {
  ...BUTTON_SECONDARY,
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
};

const SPLASH_FRAME: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  gridTemplateRows: '40px minmax(0, 1fr)',
  background: '#f7f7f7',
  color: '#242424',
  fontFamily: 'Segoe UI, var(--token-typography-font-stack-text, system-ui, sans-serif)',
  overflow: 'hidden',
};

const PRODUCT_FRAME: CSSProperties = {
  ...SPLASH_FRAME,
  gridTemplateRows: '40px auto minmax(0, 1fr)',
};

const AZURE_BAR: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 40,
  padding: '0 8px',
  background: '#0078d4',
};

const AZURE_MENU_BUTTON: CSSProperties = {
  position: 'absolute',
  left: 8,
  width: 32,
  height: 28,
  border: '1px solid rgba(255, 255, 255, 0.65)',
  borderRadius: 2,
  background: 'transparent',
  color: '#ffffff',
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1,
  cursor: 'pointer',
};

const AZURE_MENU_DROPDOWN: CSSProperties = {
  position: 'absolute',
  top: 36,
  left: 8,
  width: 220,
  border: '1px solid #d2d0ce',
  borderRadius: 2,
  background: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.22)',
  zIndex: 4,
  overflow: 'hidden',
};

const AZURE_MENU_ITEM: CSSProperties = {
  width: '100%',
  minHeight: 38,
  border: 'none',
  background: '#ffffff',
  color: '#242424',
  padding: '0 14px',
  fontSize: 13,
  textAlign: 'left',
  cursor: 'pointer',
};

const AZURE_SEARCH: CSSProperties = {
  width: 300,
  height: 26,
  boxSizing: 'border-box',
  border: '1px solid #8ac7f9',
  borderRadius: '2px 0 0 2px',
  background: '#ffffff',
  color: '#242424',
  padding: '0 10px',
  fontSize: 13,
  outline: 'none',
};

const AZURE_SEARCH_BUTTON: CSSProperties = {
  height: 26,
  border: '1px solid #8ac7f9',
  borderLeft: 'none',
  borderRadius: '0 2px 2px 0',
  background: '#f3f9ff',
  color: '#005a9e',
  padding: '0 12px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const AZURE_SEARCH_DROPDOWN: CSSProperties = {
  position: 'absolute',
  top: 30,
  left: 0,
  width: 300,
  border: '1px solid #8ac7f9',
  borderRadius: 2,
  background: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
  zIndex: 2,
  overflow: 'hidden',
};

const AZURE_SEARCH_RESULT: CSSProperties = {
  width: '100%',
  minHeight: 36,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  border: 'none',
  background: '#ffffff',
  color: '#242424',
  padding: '0 12px',
  fontSize: 13,
  textAlign: 'left',
  cursor: 'pointer',
};

const SPLASH_MAIN: CSSProperties = {
  minHeight: 0,
  display: 'grid',
  alignContent: 'center',
  justifyItems: 'center',
  padding: '56px 64px 96px',
  overflow: 'auto',
};

const SPLASH_CONTENT: CSSProperties = {
  width: 'min(1068px, 100%)',
  display: 'grid',
  justifyItems: 'center',
  gap: 32,
};

const SPLASH_GRID: CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
  gap: 14,
};

const SPLASH_CARD: CSSProperties = {
  minHeight: 136,
  display: 'grid',
  justifyItems: 'start',
  alignContent: 'start',
  gap: 14,
  padding: 16,
  border: '1px solid #e1e1e1',
  borderRadius: 8,
  background: '#ffffff',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.16)',
  color: '#242424',
  textAlign: 'left',
};

const SPLASH_CARD_ICON: CSSProperties = {
  width: 35,
  height: 35,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 6,
  background: '#e8f3ff',
  color: '#106ebe',
  fontWeight: 700,
  fontSize: 12,
};

const PRODUCT_MAIN: CSSProperties = {
  minHeight: 0,
  display: 'grid',
  alignContent: 'start',
  justifyItems: 'center',
  padding: '40px 64px 96px',
  overflow: 'auto',
};

const PRODUCT_HEADER: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minHeight: 56,
  padding: '12px 64px 12px 8px',
  borderBottom: '1px solid #e1e1e1',
  background: '#ffffff',
};

const PRODUCT_CONTENT: CSSProperties = {
  width: 'min(920px, 100%)',
  display: 'grid',
  gap: 28,
};

const PRODUCT_PANEL: CSSProperties = {
  display: 'grid',
  gap: 28,
  padding: 32,
  border: '1px solid #e1e1e1',
  borderRadius: 8,
  background: '#ffffff',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.16)',
};

const HOME_BUTTON: CSSProperties = {
  position: 'absolute',
  left: 48,
  height: 26,
  border: '1px solid rgba(255, 255, 255, 0.65)',
  borderRadius: 2,
  background: 'transparent',
  color: '#ffffff',
  padding: '0 12px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const TERRAFORM_PAGE_HEADER: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: `${hds.space20} ${hds.space24}`,
  borderBottom: `1px solid ${hds.borderPrimary}`,
  background: hds.surfacePrimary,
};

function Badge({ children, tone = 'neutral' }: { children: string; tone?: 'neutral' | 'success' | 'brand' | 'warning' }) {
  const toneStyle = {
    neutral: { background: hds.surfaceStrong, color: hds.textSecondary, borderColor: hds.borderPrimary },
    success: { background: hds.successFaint, color: hds.success, borderColor: 'var(--token-color-border-success, #cceeda)' },
    brand: { background: hds.brandFaint, color: hds.brand, borderColor: 'var(--token-color-terraform-border, #ebdbfc)' },
    warning: { background: hds.warningFaint, color: hds.warning, borderColor: 'var(--token-color-border-warning, #fbeabf)' },
  }[tone];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${toneStyle.borderColor}`, borderRadius: 999, padding: '4px 9px', fontSize: 12, fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap', background: toneStyle.background, color: toneStyle.color }}>
      {children}
    </span>
  );
}

function Button({ children, variant = 'secondary', disabledReason, onClick, style, type }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: 'primary' | 'secondary'; disabledReason?: string }) {
  const isDisabled = Boolean(disabledReason);

  return (
    <FluentButton
      appearance={variant === 'primary' ? 'primary' : 'secondary'}
      disabled={isDisabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      title={disabledReason}
      type={(type as 'button' | 'submit' | 'reset') ?? 'button'}
      style={style}
    >
      {children}
    </FluentButton>
  );
}

function ButtonSet({ children }: { children: ReactNode }) {
  return <div style={BUTTON_SET}>{children}</div>;
}

function TerraformIcon() {
  return <span style={{ width: 28, height: 28, borderRadius: 4, display: 'grid', placeItems: 'center', background: '#f4ecff', color: '#7b42bc', fontSize: 13, fontWeight: 700 }} aria-hidden="true">T</span>;
}

function SplashCard({ icon, title, description, onClick }: { icon: string; title: string; description: string; onClick?: () => void }) {
  const CardElement = onClick ? 'button' : 'div';

  return (
    <CardElement type={onClick ? 'button' : undefined} onClick={onClick} style={{ ...SPLASH_CARD, border: `1px solid ${onClick ? '#106ebe' : '#e1e1e1'}`, cursor: onClick ? 'pointer' : 'default' }}>
      <span style={SPLASH_CARD_ICON} aria-hidden="true">{icon}</span>
      <span style={{ display: 'grid', gap: 12 }}>
        <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25 }}>{title}</span>
        <span style={{ fontSize: 15, lineHeight: 1.45 }}>{description}</span>
      </span>
    </CardElement>
  );
}

function AzureSearchForm({ onTerraformSelect, resultsId = 'azure-search-results' }: { onTerraformSelect: () => void; resultsId?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const shouldShowTerraformResult = searchQuery.trim().toLowerCase().startsWith('t');

  return (
    <form
      aria-label="Search resources, services and docs"
      onSubmit={(event) => {
        event.preventDefault();
        onTerraformSelect();
      }}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <SearchBox
        aria-autocomplete="list"
        aria-controls={resultsId}
        aria-expanded={shouldShowTerraformResult}
        aria-label="Search resources, services and docs"
        autoComplete="off"
        onChange={(_, data) => setSearchQuery(data.value)}
        onSearch={() => onTerraformSelect()}
        placeholder="Search resources, services and docs"
        role="combobox"
        style={AZURE_SEARCH}
        value={searchQuery}
      />
      {shouldShowTerraformResult ? (
        <div id={resultsId} role="listbox" style={AZURE_SEARCH_DROPDOWN}>
          <button type="button" role="option" aria-selected="false" style={AZURE_SEARCH_RESULT} onClick={onTerraformSelect}>
            <TerraformIcon />
            <span>Terraform</span>
          </button>
        </div>
      ) : null}
    </form>
  );
}

function AzureTopBar({ onHome, onTerraformSelect, onCreateResource }: { onHome?: () => void; onTerraformSelect: () => void; onCreateResource: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="azure-splash-bar" style={AZURE_BAR} aria-label="Search resources">
      <button type="button" aria-expanded={isMenuOpen} aria-haspopup="menu" aria-label="Open navigation menu" style={AZURE_MENU_BUTTON} onClick={() => setIsMenuOpen((currentValue) => !currentValue)}>☰</button>
      {isMenuOpen ? (
        <div role="menu" style={AZURE_MENU_DROPDOWN}>
          <button type="button" role="menuitem" style={AZURE_MENU_ITEM} onClick={() => { setIsMenuOpen(false); onCreateResource(); }}>Create a resource</button>
        </div>
      ) : null}
      {onHome ? <button type="button" style={HOME_BUTTON} onClick={onHome}>Home</button> : null}
      <AzureSearchForm onTerraformSelect={onTerraformSelect} resultsId="azure-topbar-search-results" />
    </header>
  );
}

function AzurePortalSplash({ onSearchResult, onCreateResource }: { onSearchResult: () => void; onCreateResource: () => void }) {
  const cards = [
    { icon: 'TPL', title: 'Start with a template', description: 'Deploy in minutes using pre-made templates.' },
    { icon: '+', title: 'Create a resource', description: 'Choose a service to create a resource in your subscription.' },
    { icon: 'AI', title: 'Build an AI agent', description: 'Create and manage AI apps and agents using the latest models.' },
    { icon: 'GH', title: 'Import code from GitHub', description: 'Connect your GitHub account and deploy existing repositories.' },
  ];

  return (
    <div style={SPLASH_FRAME}>
      <AzureTopBar onTerraformSelect={onSearchResult} onCreateResource={onCreateResource} />

      <main className="azure-splash-main" style={SPLASH_MAIN}>
        <section style={SPLASH_CONTENT} aria-label="Azure portal start screen">
          <div style={{ display: 'grid', justifyItems: 'center', gap: 20 }}>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.15, fontWeight: 700, letterSpacing: 0 }}>Let's start building!</h1>
          </div>

          <div className="azure-splash-grid" style={SPLASH_GRID}>
            {cards.map((card) => (
              <SplashCard key={card.title} icon={card.icon} title={card.title} description={card.description} onClick={card.title === 'Create a resource' ? onCreateResource : undefined} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const AZ_CREATE_RESOURCE_SERVICES: { icon: string; title: string; description: string; highlight?: boolean }[] = [
  { icon: '🖥', title: 'Virtual machines', description: 'Build, deploy, and run your applications on resilient and scalable infrastructure.' },
  { icon: '💾', title: 'Storage accounts', description: 'Store and access files, backups, and unstructured data reliably and securely.' },
  { icon: '🗄', title: 'SQL databases', description: 'Set up a scalable, secure relational database in minutes with built-in intelligence.' },
  { icon: '🌐', title: 'Web App', description: 'Easily host and manage websites and web applications without managing infrastructure.' },
  { icon: '📦', title: 'Container Apps', description: 'Run your app in containers with automatic scaling and built-in microservices support.' },
  { icon: 'T', title: 'Terraform', description: 'Connect existing Terraform-managed infrastructure to Azure without changing your current workflows.', highlight: true },
];

function ServiceCard({ icon, title, description, highlight, onClick }: { icon: string; title: string; description: string; highlight?: boolean; onClick?: () => void }) {
  const CardEl = onClick ? 'button' : 'div';
  return (
    <CardEl
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        display: 'grid',
        gap: 0,
        padding: 20,
        border: `1px solid ${highlight ? '#0078d4' : '#e1dfdd'}`,
        borderRadius: 8,
        background: highlight ? '#f0f6ff' : '#ffffff',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 32, height: 32, borderRadius: 4, display: 'grid', placeItems: 'center', background: highlight ? '#ebdbfc' : '#f3f2f1', color: highlight ? '#7b42bc' : '#323130', fontSize: 16, fontWeight: 700, flexShrink: 0 }} aria-hidden="true">{icon}</span>
        <strong style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: '#201f1e' }}>{title}</strong>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: '#605e5c', lineHeight: 1.5 }}>{description}</p>
    </CardEl>
  );
}

function CreateResourcePage({ onHome, onTerraformSearch, onCreateResource, onGetStarted }: { onHome: () => void; onTerraformSearch: () => void; onCreateResource: () => void; onGetStarted: () => void }) {
  return (
    <div style={PRODUCT_FRAME}>
      <AzureTopBar onHome={onHome} onTerraformSelect={onTerraformSearch} onCreateResource={onCreateResource} />
      <main style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#ffffff' }}>
        <div style={{ padding: '12px 32px 0', fontSize: 12, color: '#605e5c' }}>Home &rsaquo; Create a resource</div>
        <div style={{ padding: '12px 32px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, lineHeight: 1.25, color: '#201f1e' }}>Explore services</h1>
          <span style={{ fontSize: 13, color: '#605e5c', lineHeight: 1 }}>···</span>
        </div>

        <div style={{ padding: '28px 32px 48px', display: 'grid', gap: 40 }}>
          <section aria-labelledby="popular-services-heading">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 id="popular-services-heading" style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#201f1e' }}>Popular services</h2>
              <span style={{ border: '1px solid #107c10', borderRadius: 4, padding: '2px 8px', fontSize: 12, color: '#107c10', lineHeight: 1.4, whiteSpace: 'nowrap' }}>Free options available</span>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#605e5c', lineHeight: 1.5, maxWidth: 720 }}>
              From hosting and storage to functions and containers, choose the service that matches your workload and deployment needs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
              {AZ_CREATE_RESOURCE_SERVICES.map((service) => (
                <ServiceCard
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  highlight={service.highlight}
                  onClick={service.highlight ? onGetStarted : undefined}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="explore-more-heading">
            <h2 id="explore-more-heading" style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 600, color: '#201f1e' }}>Explore more</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
              <ServiceCard
                icon="≡"
                title="All services"
                description="Choose from over 200 services across various categories like compute, databases, analytics, and storage."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const PRODUCT_SCENARIOS: { id: Scenario; label: string; helper: string }[] = [
  { id: 'A', label: 'I already use Terraform and want to see my infrastructure in Azure', helper: 'Connect existing Terraform workspaces to Azure without changing your current workflows.' },
  { id: 'B', label: 'I manage Azure resources and want to start using Terraform for governance', helper: 'Bring existing Azure resources under Terraform management and improve governance across your team.' },
  { id: 'C', label: "I'm new to both and want to connect Azure and Terraform for the first time", helper: 'Set up from scratch with step-by-step guidance.' },
];

function TerraformProductScreen({ stackWorkspaces, onGetStarted, onHome, onTerraformSearch, onCreateResource }: { stackWorkspaces: WorkspaceRow[]; onGetStarted: (scenario: Scenario) => void; onHome: () => void; onTerraformSearch: () => void; onCreateResource: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'support' | 'reviews'>('overview');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  return (
    <div style={PRODUCT_FRAME}>
      <AzureTopBar onHome={onHome} onTerraformSelect={onTerraformSearch} onCreateResource={onCreateResource} />
      <main style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#ffffff' }}>

        {/* Breadcrumb + page title zone */}
        <div style={{ padding: '8px 32px 0', fontSize: 12, color: '#605e5c' }}>
          Home &rsaquo; Create a resource &rsaquo; Marketplace
        </div>
        <div style={{ padding: '8px 32px 4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, lineHeight: 1.25, color: '#201f1e' }}>Terraform</h1>
              <span style={{ fontSize: 13, color: '#605e5c' }}>📌</span>
              <span style={{ fontSize: 13, color: '#605e5c' }}>···</span>
            </div>
            <div style={{ marginTop: 2, fontSize: 13, color: '#605e5c' }}>HashiCorp, Inc.</div>
          </div>
          <button type="button" aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 20, color: '#605e5c', cursor: 'pointer', lineHeight: 1, padding: '4px 0 0' }}>✕</button>
        </div>

        {/* Product hero */}
        <div style={{ padding: '24px 32px 0', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: 8, background: '#f4ecff', display: 'grid', placeItems: 'center', flexShrink: 0, border: '1px solid #e1dfdd' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#7b42bc' }}>T</span>
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#201f1e', lineHeight: 1.2 }}>Terraform</span>
              <span style={{ fontSize: 13, color: '#0078d4', cursor: 'pointer' }}>♡ Add to Favorites</span>
            </div>
            <div style={{ fontSize: 14, color: '#605e5c' }}>HashiCorp, Inc. | Infrastructure as Code</div>
            <div style={{ fontSize: 14, color: '#605e5c' }}>★ <strong style={{ color: '#201f1e' }}>4.8</strong> (1,240 ratings)</div>
          </div>
        </div>

        {/* Scenario selection cards */}
        <div style={{ padding: '20px 32px 0', display: 'grid', gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#201f1e' }}>How would you like to get started?</div>
          <div role="radiogroup" aria-label="Setup scenario" style={{ display: 'grid', gridTemplateColumns: `repeat(${stackWorkspaces.length > 0 ? 2 : 3}, 1fr)`, gap: 12 }}>
            {PRODUCT_SCENARIOS.filter((s) => !(stackWorkspaces.length > 0 && s.id === 'C')).map((scenario) => {
              const isSel = selectedScenario === scenario.id;
              return (
                <label
                  key={scenario.id}
                  style={{ display: 'flex', flexDirection: 'column', padding: '16px', border: `1.5px solid ${isSel ? '#0078d4' : '#e1dfdd'}`, borderRadius: 8, background: isSel ? '#f0f6ff' : '#ffffff', cursor: 'pointer', userSelect: 'none', boxShadow: isSel ? '0 0 0 1px #0078d4' : '0 2px 6px rgba(0,0,0,0.07)' }}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  {/* Radio + header on same row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSel ? '#0078d4' : '#8a8886'}`, background: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
                      {isSel && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#0078d4' }} />}
                    </div>
                    <div style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: 14, fontWeight: 600, color: '#201f1e', lineHeight: 1.35 }}>{scenario.label}</div>
                  </div>
                  {/* Body text below */}
                  <div style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: 14, fontWeight: 400, color: '#605e5c', lineHeight: 1.5, paddingLeft: 28 }}>{scenario.helper}</div>
                  <input type="radio" name="product-scenario" value={scenario.id} checked={isSel} onChange={() => setSelectedScenario(scenario.id)} style={{ display: 'none' }} />
                </label>
              );
            })}
          </div>
          <div>
            <FluentButton appearance="primary" disabled={selectedScenario === null} onClick={() => onGetStarted(selectedScenario!)}>Get Started</FluentButton>
          </div>
        </div>

        {stackWorkspaces.length > 0 ? (
          <div style={{ padding: '24px 32px 48px' }}>
            <section aria-labelledby="existing-terraform-stacks-heading">
              <TerraformStacksTable selectedWorkspaces={stackWorkspaces} headingId="existing-terraform-stacks-heading" headingLevel="h2" description="Existing stacks already connected to Azure." />
            </section>
          </div>
        ) : (
          <>
            {/* Tab nav */}
            <div style={{ margin: '20px 32px 0', borderBottom: '1px solid #e1dfdd', display: 'flex', gap: 0 }}>
              {(['overview', 'plans', 'support', 'reviews'] as const).map((tab) => {
                const label = { overview: 'Overview', plans: 'Plans', support: 'Usage Information + Support', reviews: 'Ratings + Reviews' }[tab];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{ padding: '10px 16px', border: 'none', borderBottom: isActive ? '2px solid #0078d4' : '2px solid transparent', background: 'none', fontSize: 14, color: isActive ? '#0078d4' : '#323130', fontWeight: isActive ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div style={{ padding: '24px 32px 48px', maxWidth: 800 }}>
              {activeTab === 'overview' ? (
                <div style={{ display: 'grid', gap: 16, fontSize: 14, color: '#323130', lineHeight: 1.6 }}>
                  <p style={{ margin: 0 }}>
                    Terraform by HashiCorp is an infrastructure as code tool that lets you define both cloud and on-premises resources in human-readable configuration files that you can version, reuse, and share. It works with Azure and hundreds of other providers to provision and manage any infrastructure across cloud platforms.
                  </p>
                  <p style={{ margin: 0 }}>
                    The Azure Terraform resource provider enables teams to connect existing Terraform-managed infrastructure to Azure Resource Manager, enabling unified governance, policy enforcement, and cost management across all resources - regardless of how they were provisioned.
                  </p>
                  <div>
                    <strong style={{ display: 'block', marginBottom: 6 }}>Key capabilities:</strong>
                    <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>
                      <li>Connect existing Terraform workspaces to Azure without migration</li>
                      <li>Apply Azure Policy and RBAC to Terraform-managed resources</li>
                      <li>Unified cost visibility across native and Terraform resources</li>
                      <li>Drift detection and remediation from the Azure portal</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ display: 'block', marginBottom: 6 }}>Pricing:</strong>
                    <p style={{ margin: 0 }}>The Azure Terraform resource provider is available at no additional cost. HCP Terraform plans are billed separately through HashiCorp.</p>
                  </div>
                  <div>
                    <strong style={{ display: 'block', marginBottom: 6 }}>Learn More</strong>
                    <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>
                      {['About Terraform on Azure', 'Documentation', 'HCP Terraform pricing', 'Support'].map((link) => (
                        <li key={link}><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#0078d4', textDecoration: 'none' }}>{link}</a></li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid #edebe9', fontSize: 14, color: '#323130' }}>
                    More products from HashiCorp, Inc. <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#0078d4', textDecoration: 'none' }}>See All</a>
                  </div>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 14, color: '#605e5c' }}>Content for this tab is not yet available in this wireframe.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function TerraformCSuccessScreen({ onHome, onTerraformSearch, onCreateResource }: { onHome: () => void; onTerraformSearch: () => void; onCreateResource: () => void }) {
  return (
    <div style={PRODUCT_FRAME}>
      <AzureTopBar onHome={onHome} onTerraformSelect={onTerraformSearch} onCreateResource={onCreateResource} />
      <header style={PRODUCT_HEADER} aria-label="Terraform product header">
        <TerraformIcon />
        <h1 style={{ margin: 0, fontSize: 20, lineHeight: 1.25, fontWeight: 600, letterSpacing: 0 }}>Terraform</h1>
      </header>
      <main style={PRODUCT_MAIN}>
        <section style={PRODUCT_CONTENT} aria-label="Setup complete">
          <div style={PRODUCT_PANEL}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: hds.success, fontWeight: 700, fontSize: 20 }} aria-hidden="true">✓</span>
                <span style={{ color: hds.success, fontWeight: 700, fontSize: 15 }}>Connected</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.15, fontWeight: 700 }}>You're set up.</h2>
              <p style={{ margin: 0, maxWidth: 600, color: '#3b3d45', fontSize: 17, lineHeight: 1.55 }}>
                Your first Terraform workspace is connected to Azure. Here's where to go next.
              </p>
            </div>
          </div>
          <div style={PRODUCT_PANEL}>
            <div style={{ display: 'grid', gap: hds.space12 }}>
              {[
                { label: 'Open your workspace in HCP Terraform', detail: 'View your workspace, write your first configuration, and run a plan.' },
                { label: 'Run your first plan', detail: 'A plan shows what Terraform would create or change without applying anything.' },
                { label: 'Explore the Azure Terraform resource view', detail: 'See your connected workspace in the Azure portal.' },
                { label: 'Read the getting started guide', detail: 'Step-by-step docs for managing Azure infrastructure with Terraform.' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 14, border: `1px solid ${hds.borderPrimary}`, borderRadius: hds.radiusLarge, background: hds.surfacePrimary }}>
                  <span style={{ color: hds.brand, fontSize: 18, lineHeight: 1, minWidth: 20 }} aria-hidden="true">→</span>
                  <span>
                    <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3, color: hds.brand }}>{item.label}</strong>
                    <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{item.detail}</span>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FluentButton appearance="secondary" onClick={onTerraformSearch}>View Terraform stacks</FluentButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function TerraformHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 32px', background: '#ffffff' }} aria-label="Page title">
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, lineHeight: 1.25, color: '#201f1e' }}>
        Connect Terraform to Azure
      </h1>
    </div>
  );
}

function SectionHeading({ children, count }: { children: string; count: number }) {
  return (
    <div style={SECTION_HEADER}>
      <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>{children}</h3>
      <Badge>{count} fields</Badge>
    </div>
  );
}

function FieldGrid({ section, selections, onSelectionChange }: { section: AzureFormSection; selections: FormSelections; onSelectionChange: (id: string, value: FormValue) => void }) {
  const columns = section.layout === 'one' ? '1fr' : section.layout === 'three' ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))';

  return (
    <div className="azure-terraform-field-grid" style={{ display: 'grid', gridTemplateColumns: columns, gap: hds.space14 }}>
      {section.controls.map((control) => (
        <Control key={control.id} control={control} selections={selections} onSelectionChange={onSelectionChange} />
      ))}
    </div>
  );
}

function Control({ control, selections, onSelectionChange }: { control: AzureFormControl; selections: FormSelections; onSelectionChange: (id: string, value: FormValue) => void }) {
  if (control.kind === 'text') {
    return (
      <Field label={control.label}>
        <Input id={control.id} value={String(selections[control.id] ?? '')} onChange={(_, data) => onSelectionChange(control.id, data.value)} />
      </Field>
    );
  }

  if (control.kind === 'select') {
    return (
      <Field label={control.label}>
        <Select id={control.id} value={String(selections[control.id] ?? control.options[0] ?? '')} onChange={(event) => onSelectionChange(control.id, event.target.value)}>
          {control.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
      </Field>
    );
  }

  if (control.kind === 'textarea') {
    return (
      <Field label={control.label}>
        <Textarea id={control.id} value={String(selections[control.id] ?? '')} onChange={(_, data) => onSelectionChange(control.id, data.value)} style={{ minHeight: 96 }} />
      </Field>
    );
  }

  if (control.kind === 'radio') {
    const isChecked = selections[control.name] === control.id;

    return (
      <label style={{ ...CHOICE_CARD, borderColor: isChecked ? hds.brand : hds.borderPrimary, background: isChecked ? hds.brandFaint : hds.surfacePrimary }}>
        <input type="radio" name={control.name} checked={isChecked} onChange={() => onSelectionChange(control.name, control.id)} />
        <span>
          <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3 }}>{control.label}</strong>
          <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{control.helper}</span>
        </span>
      </label>
    );
  }

  if (control.kind === 'link') {
    return (
      <a
        href={control.href}
        style={{ ...CHOICE_CARD, textDecoration: 'none', color: hds.textPrimary, borderColor: hds.borderPrimary }}
        onClick={(event) => event.preventDefault()}
      >
        <span style={{ color: hds.brand, fontSize: 18, lineHeight: 1 }} aria-hidden="true">→</span>
        <span>
          <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3, color: hds.brand }}>{control.label}</strong>
          <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{control.description}</span>
        </span>
      </a>
    );
  }

  return (
    <label style={CHOICE_CARD}>
      <input type="checkbox" checked={Boolean(selections[control.id])} onChange={(event) => onSelectionChange(control.id, event.target.checked)} />
      <span>
        <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3 }}>{control.label}</strong>
        <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{control.helper}</span>
      </span>
    </label>
  );
}

const ARM_RESOURCE_GROUPS = [
  { id: 'rg-networking-prod', name: 'rg-networking-prod', subscription: 'Prod Networking', resourceCount: 38, location: 'eastus' },
  { id: 'rg-identity-shared', name: 'rg-identity-shared', subscription: 'Shared Services', resourceCount: 24, location: 'eastus' },
  { id: 'rg-app-prod', name: 'rg-app-prod', subscription: 'Production Apps', resourceCount: 44, location: 'westus2' },
  { id: 'rg-data-platform', name: 'rg-data-platform', subscription: 'Data Platform', resourceCount: 29, location: 'eastus2' },
  { id: 'rg-security-baseline', name: 'rg-security-baseline', subscription: 'Security', resourceCount: 31, location: 'eastus' },
];

function FormSection({ section, selections, onSelectionChange }: { section: AzureFormSection; selections: FormSelections; onSelectionChange: (id: string, value: FormValue) => void }) {
  return (
    <section style={SECTION_CARD} aria-label={section.title}>
      <SectionHeading count={section.controls.length}>{section.title}</SectionHeading>
      <FieldGrid section={section} selections={selections} onSelectionChange={onSelectionChange} />
    </section>
  );
}

const HCP_ORGANIZATION_WORKSPACE_COUNTS: Record<string, number> = {
  'atlas-platform': 4,
  'northstar-cloud': 2,
  'pioneer-infra': 6,
  'summit-ops': 3,
};

const HCP_ORGANIZATION_LABELS: Record<string, string> = {
  'atlas-platform': 'Atlas Platform',
  'northstar-cloud': 'Northstar Cloud',
  'pioneer-infra': 'Pioneer Infra',
  'summit-ops': 'Summit Ops',
};

function getOrganizationLabel(organization: string) {
  return HCP_ORGANIZATION_LABELS[organization] || organization;
}

const HCP_ORGANIZATION_WORKSPACES: Record<string, WorkspaceRow[]> = {
  'atlas-platform': [
    { id: 'atlas-network-prod', name: 'network-prod-core', repoNumber: 'repo-1842', subscription: 'Prod Networking', latestApplyStatus: 'Applied 2 hours ago', resourceCount: 38 },
    { id: 'atlas-identity-shared', name: 'identity-shared-services', repoNumber: 'repo-2271', subscription: 'Shared Services', latestApplyStatus: 'Applied yesterday', resourceCount: 24 },
    { id: 'atlas-observability', name: 'observability-platform', repoNumber: 'repo-3108', subscription: 'Platform Operations', latestApplyStatus: 'Plan pending', resourceCount: 17 },
    { id: 'atlas-security-baseline', name: 'security-baseline', repoNumber: 'repo-4420', subscription: 'Security', latestApplyStatus: 'Applied 5 days ago', resourceCount: 31 },
  ],
  'northstar-cloud': [
    { id: 'northstar-app-prod', name: 'app-prod-eastus', repoNumber: 'repo-0914', subscription: 'Production Apps', latestApplyStatus: 'Applied 4 hours ago', resourceCount: 44 },
    { id: 'northstar-data-platform', name: 'data-platform-shared', repoNumber: 'repo-1186', subscription: 'Data Platform', latestApplyStatus: 'Apply failed', resourceCount: 29 },
  ],
  'pioneer-infra': [
    { id: 'pioneer-hub-network', name: 'hub-network-global', repoNumber: 'repo-6501', subscription: 'Connectivity Hub', latestApplyStatus: 'Applied today', resourceCount: 26 },
    { id: 'pioneer-spoke-dev', name: 'spoke-dev-westus', repoNumber: 'repo-6502', subscription: 'Development', latestApplyStatus: 'Applied yesterday', resourceCount: 12 },
    { id: 'pioneer-spoke-prod', name: 'spoke-prod-eastus', repoNumber: 'repo-6503', subscription: 'Production', latestApplyStatus: 'Plan pending', resourceCount: 57 },
    { id: 'pioneer-keyvault', name: 'keyvault-shared', repoNumber: 'repo-6504', subscription: 'Shared Security', latestApplyStatus: 'Applied 3 days ago', resourceCount: 18 },
    { id: 'pioneer-monitoring', name: 'monitoring-core', repoNumber: 'repo-6505', subscription: 'Operations', latestApplyStatus: 'Applied 1 hour ago', resourceCount: 33 },
    { id: 'pioneer-aks-platform', name: 'aks-platform-prod', repoNumber: 'repo-6506', subscription: 'Container Platform', latestApplyStatus: 'Drift detected', resourceCount: 49 },
  ],
  'summit-ops': [
    { id: 'summit-landing-zone', name: 'landing-zone-prod', repoNumber: 'repo-5021', subscription: 'Enterprise Landing Zone', latestApplyStatus: 'Applied 6 hours ago', resourceCount: 64 },
    { id: 'summit-backup', name: 'backup-recovery', repoNumber: 'repo-5022', subscription: 'Business Continuity', latestApplyStatus: 'Applied yesterday', resourceCount: 21 },
    { id: 'summit-finops', name: 'finops-reporting', repoNumber: 'repo-5023', subscription: 'Finance Operations', latestApplyStatus: 'Plan pending', resourceCount: 15 },
  ],
};

function getWorkspacesForOrganization(organization: string) {
  const workspaceCount = HCP_ORGANIZATION_WORKSPACE_COUNTS[organization] || 0;
  return (HCP_ORGANIZATION_WORKSPACES[organization] || []).slice(0, workspaceCount);
}

function getProductStackWorkspaces() {
  return [
    HCP_ORGANIZATION_WORKSPACES['atlas-platform'][0],
    HCP_ORGANIZATION_WORKSPACES['atlas-platform'][1],
    HCP_ORGANIZATION_WORKSPACES['northstar-cloud'][0],
    HCP_ORGANIZATION_WORKSPACES['summit-ops'][0],
  ].filter((workspace): workspace is WorkspaceRow => Boolean(workspace));
}

function formatWorkspaceName(name: string) {
  return name
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function HcpConnectionStep({ selectedOrganization, onOrganizationChange, onContinue }: { selectedOrganization: string; onOrganizationChange: (organization: string) => void; onContinue: () => void }) {
  const [sessionState, setSessionState] = useState<'none' | 'signing-in' | 'signed-in'>('none');
  const [oauthStatus, setOauthStatus] = useState<'idle' | 'authorizing' | 'authorized'>('idle');

  const hasSelectedOrganization = Boolean(selectedOrganization);
  const selectedWorkspaceCount = HCP_ORGANIZATION_WORKSPACE_COUNTS[selectedOrganization];
  const selectedOrganizationLabel = getOrganizationLabel(selectedOrganization);
  // atlas-platform simulates an SSO-enforced organization
  const isSsoEnforcedOrg = selectedOrganization === 'atlas-platform';
  const canContinue = sessionState === 'signed-in' && hasSelectedOrganization && oauthStatus === 'authorized';

  useEffect(() => {
    if (sessionState !== 'signing-in') return undefined;
    const timeoutId = window.setTimeout(() => setSessionState('signed-in'), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [sessionState]);

  useEffect(() => {
    if (oauthStatus !== 'authorizing') return undefined;
    const timeoutId = window.setTimeout(() => setOauthStatus('authorized'), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [oauthStatus]);

  return (
    <form style={FORM_STACK} aria-label="Connect to HCP Terraform">
      <section style={SECTION_CARD} aria-labelledby="hcp-session-heading">
        <h3 id="hcp-session-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>HCP Terraform Account</h3>
        {sessionState === 'signed-in' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: hds.space8, padding: '8px 12px', background: hds.surfaceFaint, borderRadius: hds.radiusMedium, border: `1px solid ${hds.borderPrimary}` }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: hds.brand, color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>A</span>
            <span style={{ color: hds.textPrimary }}>Signed in as <strong>angela@company.com</strong></span>
          </div>
        ) : (
          <div style={{ display: 'grid', justifyItems: 'start', gap: hds.space12 }}>
            <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.55 }}>Sign in to HCP Terraform to connect your organization.</p>
            <Button
              onClick={() => setSessionState('signing-in')}
              disabledReason={sessionState === 'signing-in' ? 'Signing in...' : undefined}
            >
              {sessionState === 'signing-in' ? 'Signing in...' : 'Sign in to HCP Terraform'}
            </Button>
            {sessionState === 'signing-in' ? (
              <p role="status" style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.5 }}>Redirecting to identity provider...</p>
            ) : null}
          </div>
        )}
      </section>

      <section style={SECTION_CARD} aria-labelledby="hcp-organization-heading">
        <h3 id="hcp-organization-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>HCP Terraform Organization</h3>
        <div style={{ display: 'grid', gap: hds.space12 }}>
          <Field label="Organization">
            <Select
              id="hcp-organization"
              style={{ opacity: sessionState !== 'signed-in' ? 0.5 : 1 }}
              value={selectedOrganization}
              onChange={(event) => onOrganizationChange(event.target.value)}
              disabled={sessionState !== 'signed-in'}
            >
              <option value="">Select an organization</option>
              <option value="atlas-platform">Atlas Platform (SSO enforced)</option>
              <option value="northstar-cloud">Northstar Cloud</option>
              <option value="pioneer-infra">Pioneer Infra</option>
              <option value="summit-ops">Summit Ops</option>
            </Select>
          </Field>
          {sessionState !== 'signed-in' ? (
            <p style={{ margin: 0, color: hds.textFaint, fontSize: 14, lineHeight: 1.5 }}>Sign in above to unlock organization selection.</p>
          ) : null}
          {hasSelectedOrganization && sessionState === 'signed-in' ? (
            <p role="status" style={{ margin: 0, color: hds.textSecondary, fontSize: 15, lineHeight: 1.5 }}>
              {selectedOrganizationLabel} has {selectedWorkspaceCount} Terraform Workspaces.
            </p>
          ) : null}
        </div>
      </section>

      {sessionState === 'signed-in' && hasSelectedOrganization ? (
        <section style={SECTION_CARD} aria-labelledby="hcp-authorize-heading">
          <h3 id="hcp-authorize-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Authorize Azure</h3>
          <div style={{ display: 'grid', justifyItems: 'start', gap: hds.space12 }}>
            <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.55 }}>
              {isSsoEnforcedOrg
                ? `${selectedOrganizationLabel} requires company SSO. You'll be redirected to your identity provider to complete authorization.`
                : 'Allow Azure to query and connect to your HCP Terraform organization. You can revoke this at any time.'}
            </p>
            <Button
              onClick={() => setOauthStatus('authorizing')}
              disabledReason={oauthStatus === 'authorized' ? 'Already authorized.' : oauthStatus === 'authorizing' ? 'Authorization in progress.' : undefined}
            >
              {oauthStatus === 'authorized' ? 'Authorized' : isSsoEnforcedOrg ? 'Continue with company SSO' : 'Authorize Azure'}
            </Button>
            {oauthStatus === 'authorizing' ? (
              <p role="status" style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.5 }}>
                {isSsoEnforcedOrg ? 'Redirecting to identity provider...' : 'Waiting for authorization...'}
              </p>
            ) : null}
            {oauthStatus === 'authorized' ? (
              <p role="status" style={{ margin: 0, color: hds.success, lineHeight: 1.5 }}>Azure is authorized to connect to this organization.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
        <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
        <Button disabledReason="This is the first section.">Previous</Button>
        <ButtonSet>
          <Button variant="primary" disabledReason={canContinue ? undefined : 'Sign in, select an organization, and authorize Azure to continue.'} onClick={onContinue}>
            Next
          </Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function WorkspacesStep({ selectedOrganization, selections, onSelectionChange, onPrevious, onContinue }: { selectedOrganization: string; selections: FormSelections; onSelectionChange: (id: string, value: FormValue) => void; onPrevious: () => void; onContinue: () => void }) {
  const workspaces = getWorkspacesForOrganization(selectedOrganization);
  const tableTitle = selectedOrganization ? getOrganizationLabel(selectedOrganization) : 'Select an organization';
  const hasSelectedWorkspace = workspaces.some((workspace) => selections[`workspace:${workspace.id}`]);
  const hasSelectedAllWorkspaces = workspaces.length > 0 && workspaces.every((workspace) => selections[`workspace:${workspace.id}`]);
  const hasConnectedWorkspace = workspaces.some((workspace) => selections[`workspace-connected:${workspace.id}`]);

  function handleSelectAllWorkspaces(isSelected: boolean) {
    workspaces.forEach((workspace) => {
      onSelectionChange(`workspace:${workspace.id}`, isSelected);
    });
  }

  function handleConnectWorkspaces() {
    workspaces.forEach((workspace) => {
      if (selections[`workspace:${workspace.id}`]) {
        onSelectionChange(`workspace-connected:${workspace.id}`, true);
      }
    });
  }

  return (
    <form style={FORM_STACK} aria-label="Connect Terraform workspaces">
      <section style={SECTION_CARD} aria-labelledby="workspace-table-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: hds.space12, flexWrap: 'wrap' }}>
          <h3 id="workspace-table-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>
            {tableTitle} Workspaces <span style={{ color: '#6b7280', fontWeight: 600 }}>({workspaces.length})</span>
          </h3>
        </div>
        {workspaces.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th scope="col" style={{ width: 44, padding: '10px 12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary, fontSize: 12, fontWeight: 700, lineHeight: 1.3, textAlign: 'left' }}>
                    <Checkbox aria-label="Select all workspaces" checked={hasSelectedAllWorkspaces} onChange={(_, data) => handleSelectAllWorkspaces(Boolean(data.checked))} />
                  </th>
                  {['Connected', 'Workspace name', 'Repo number', 'Subscription', 'Latest apply status'].map((heading) => (
                    <th key={heading} scope="col" style={{ padding: '10px 12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary, fontSize: 12, fontWeight: 700, lineHeight: 1.3, textAlign: 'left' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workspaces.map((workspace) => {
                  const selectionId = `workspace:${workspace.id}`;
                  const isConnected = Boolean(selections[`workspace-connected:${workspace.id}`]);
                  const workspaceName = formatWorkspaceName(workspace.name);

                  return (
                    <tr key={workspace.id}>
                      <td style={{ width: 44, padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}` }}>
                        <Checkbox aria-label={`Select ${workspaceName}`} checked={Boolean(selections[selectionId])} onChange={(_, data) => onSelectionChange(selectionId, Boolean(data.checked))} />
                      </td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: isConnected ? hds.success : hds.textSecondary, fontWeight: isConnected ? 700 : 500 }}>{isConnected ? 'Connected' : 'Not connected'}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, fontWeight: 600 }}>{workspaceName}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{workspace.repoNumber}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{workspace.subscription}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{workspace.latestApplyStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>Select an HCP Terraform organization in Step 1 to discover workspaces.</p>
        )}
      </section>

      <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
        <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button disabledReason={hasSelectedWorkspace ? undefined : 'Select a workspace to connect.'} onClick={handleConnectWorkspaces}>Connect Workspaces</Button>
          <Button variant="primary" disabledReason={hasConnectedWorkspace ? undefined : 'Connect at least one workspace to continue.'} onClick={onContinue}>Next</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function SelectField({ label, name, options, selections, onSelectionChange }: { label: string; name: string; options: string[]; selections: FormSelections; onSelectionChange: (id: string, value: FormValue) => void }) {
  return (
    <Field label={label}>
      <Select value={typeof selections[name] === 'string' ? String(selections[name]) : ''} onChange={(event) => onSelectionChange(name, event.target.value)}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Select>
    </Field>
  );
}

function MapWorkspacesStep({ selectedOrganization, selections, verificationStatus, onSelectionChange, onPrevious, onVerify, onContinue }: { selectedOrganization: string; selections: FormSelections; verificationStatus: MapVerificationStatus; onSelectionChange: (id: string, value: FormValue) => void; onPrevious: () => void; onVerify: (resourceCount: number, workspaceCount: number) => void; onContinue: () => void }) {
  const selectedWorkspaces = getWorkspacesForOrganization(selectedOrganization).filter((workspace) => selections[`workspace:${workspace.id}`]);
  const mappedWorkspaces = selectedWorkspaces.filter((workspace) => (
    Boolean(selections[`workspace-map:${workspace.id}:scope`])
    || Boolean(selections[`workspace-map:${workspace.id}:environment`])
    || Boolean(selections[`workspace-map:${workspace.id}:owner`])
  ));
  const mappedResourceCount = mappedWorkspaces.reduce((total, workspace) => total + workspace.resourceCount, 0);
  const hasMappingSelection = mappedWorkspaces.length > 0;
  const isVerifying = verificationStatus === 'verifying';
  const isVerified = verificationStatus === 'verified';

  return (
    <form style={FORM_STACK} aria-label="Map selected Terraform workspaces">
      <section style={SECTION_CARD} aria-labelledby="map-workspaces-heading">
        <h3 id="map-workspaces-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Selected Workspaces</h3>
        {selectedWorkspaces.length > 0 ? (
          <div style={{ display: 'grid', gap: hds.space16 }}>
            {selectedWorkspaces.map((workspace) => {
              const workspaceName = formatWorkspaceName(workspace.name);

              return (
              <section key={workspace.id} style={{ display: 'grid', gap: hds.space14, padding: hds.space16, border: `1px solid ${hds.borderPrimary}`, borderRadius: hds.radiusLarge, background: hds.surfaceFaint }} aria-label={`${workspaceName} mapping`}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 15, lineHeight: 1.3 }}>{workspaceName}</h4>
                  <p style={{ margin: '0 0 4px', color: hds.textSecondary, lineHeight: 1.45 }}>{workspace.resourceCount} resources connected to this Workspace</p>
                  <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>{workspace.repoNumber} - {workspace.subscription}</p>
                </div>
                <SelectField label="Type" name={`workspace-map:${workspace.id}:scope`} options={['Azure subscription', 'Management group']} selections={selections} onSelectionChange={onSelectionChange} />
                <SelectField label="Environment" name={`workspace-map:${workspace.id}:environment`} options={['dev', 'test', 'prod']} selections={selections} onSelectionChange={onSelectionChange} />
                <SelectField label="Owner" name={`workspace-map:${workspace.id}:owner`} options={['team', 'Service']} selections={selections} onSelectionChange={onSelectionChange} />
              </section>
              );
            })}
          </div>
        ) : (
          <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>None have been selected, please go back to the previous step to select your Workspaces.</p>
        )}
      </section>

      <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
        <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button disabledReason={hasMappingSelection && !isVerifying ? undefined : isVerifying ? 'Verification is in progress.' : 'Select at least one workspace mapping value to verify.'} onClick={() => onVerify(mappedResourceCount, mappedWorkspaces.length)}>{isVerifying ? 'Verifying...' : 'Verify'}</Button>
          <Button variant="primary" disabledReason={isVerified ? undefined : 'Verify workspace mappings to continue.'} onClick={onContinue}>Next</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function MapVerificationToast({ resourceCount, workspaceCount, onClose }: { resourceCount: number; workspaceCount: number; onClose: () => void }) {
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', left: '50%', bottom: 28, zIndex: 1000, width: 'min(520px, calc(100vw - 32px))', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: hds.space16, padding: hds.space16, border: `1px solid ${hds.borderPrimary}`, borderRadius: hds.radiusLarge, background: hds.surfacePrimary, color: hds.textPrimary, boxShadow: hds.shadowHigh }}>
      <span style={{ lineHeight: 1.45 }}>{resourceCount} resources across {workspaceCount} workspaces will be governed by Azure Terraform RP. No state migration is required.</span>
      <FluentButton appearance="transparent" aria-label="Close verification alert" onClick={onClose} style={{ flex: '0 0 auto' }}>X</FluentButton>
    </div>
  );
}

function TerraformStacksTable({ selectedWorkspaces, headingId, headingLevel = 'h3', description }: { selectedWorkspaces: WorkspaceRow[]; headingId: string; headingLevel?: 'h2' | 'h3'; description?: string }) {
  const [sortMode, setSortMode] = useState('newest');
  const createdTimestamps = ['May 19, 2026 09:12 AM', 'May 18, 2026 03:44 PM', 'May 17, 2026 11:06 AM', 'May 16, 2026 02:25 PM', 'May 15, 2026 10:38 AM', 'May 14, 2026 04:51 PM'];
  const createdDates = ['2026-05-19T09:12:00', '2026-05-18T15:44:00', '2026-05-17T11:06:00', '2026-05-16T14:25:00', '2026-05-15T10:38:00', '2026-05-14T16:51:00'];
  const rows = selectedWorkspaces.map((workspace, index) => {
    const workspaceName = formatWorkspaceName(workspace.name);
    const stackName = `${workspaceName} Stack`;
    const repoMetadata = `${workspace.repoNumber} - main - last scanned ${index + 2}h ago`;
    const createdTimestamp = createdTimestamps[index % createdTimestamps.length];
    const createdDate = Date.parse(createdDates[index % createdDates.length]);

    return { id: workspace.id, stackName, workspaceName, subscription: workspace.subscription, repoMetadata, createdTimestamp, createdDate };
  });
  const visibleRows = rows
    .sort((first, second) => {
      if (sortMode === 'oldest') return first.createdDate - second.createdDate;
      if (sortMode === 'stack-az') return first.stackName.localeCompare(second.stackName);
      if (sortMode === 'stack-za') return second.stackName.localeCompare(first.stackName);
      return second.createdDate - first.createdDate;
    });
  const headingStyle = { margin: 0, fontSize: headingLevel === 'h2' ? 22 : 16, lineHeight: 1.25 };

  return (
    <div style={{ display: 'grid', gap: hds.space16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: hds.space16, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 6 }}>
          {headingLevel === 'h2' ? <h2 id={headingId} style={headingStyle}>Terraform Stacks</h2> : <h3 id={headingId} style={headingStyle}>Terraform Stacks</h3>}
          {description ? <p style={{ margin: 0, maxWidth: 760, color: hds.textSecondary, fontSize: headingLevel === 'h2' ? 16 : 14, lineHeight: 1.55 }}>{description}</p> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end', gap: hds.space12, flexWrap: 'wrap' }}>
          <Field label="Reorder" style={{ minWidth: 170 }}>
            <Select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
              <option value="newest">Newest to oldest</option>
              <option value="oldest">Oldest to newest</option>
              <option value="stack-az">Stack A-Z</option>
              <option value="stack-za">Stack Z-A</option>
            </Select>
          </Field>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {['Stack', 'Workspace', 'Azure subscription(s)', 'Repo metadata', 'Created'].map((heading) => (
                <th key={heading} scope="col" style={{ padding: '10px 12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary, fontSize: 12, fontWeight: 700, lineHeight: 1.3, textAlign: 'left' }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, fontWeight: 600 }}>{row.stackName}</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span>{row.workspaceName}</span>
                    <span aria-label="Opens in a new window" title="Opens in a new window" style={{ color: hds.textFaint, fontSize: 13, fontWeight: 700, lineHeight: 1 }}>↗</span>
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{row.subscription}</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{row.repoMetadata}</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{row.createdTimestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TerraformStacksStep({ selectedOrganization, selections, onPrevious, onContinue }: { selectedOrganization: string; selections: FormSelections; onPrevious: () => void; onContinue: () => void }) {
  const selectedWorkspaces = getWorkspacesForOrganization(selectedOrganization).filter((workspace) => selections[`workspace:${workspace.id}`]);

  return (
    <form style={FORM_STACK} aria-label="Register Terraform stacks">
      <section style={SECTION_CARD} aria-labelledby="terraform-stacks-heading">
        {selectedWorkspaces.length > 0 ? <TerraformStacksTable selectedWorkspaces={selectedWorkspaces} headingId="terraform-stacks-heading" /> : <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>No workspaces have been selected.</p>}
      </section>

      <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
        <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button variant="primary" onClick={onContinue}>Next</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function ConfirmStep({ selections, selectedOrganization, onPrevious, onConfirm }: { selections: FormSelections; selectedOrganization: string; onPrevious: () => void; onConfirm: () => void }) {
  const selectedWorkspaces = getWorkspacesForOrganization(selectedOrganization).filter((workspace) => selections[`workspace:${workspace.id}`]);

  return (
    <form style={FORM_STACK} aria-label="Confirm selected onboarding settings">
      <section style={SECTION_CARD} aria-labelledby="confirm-selections-heading">
        {selectedWorkspaces.length > 0 ? <TerraformStacksTable selectedWorkspaces={selectedWorkspaces} headingId="confirm-selections-heading" /> : <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>No workspaces have been selected.</p>}
      </section>

      <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
        <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button variant="primary" onClick={onConfirm}>Confirm</Button>
        </ButtonSet>
      </div>
    </form>
  );
}



// ---------------------------------------------------------------------------
// Scenario B step components
// ---------------------------------------------------------------------------

function HcpConnectionStepB({ onPrevious, onContinue }: { onPrevious: () => void; onContinue: () => void }) {
  const [hasAccount, setHasAccount] = useState<'no' | 'yes' | null>(null);
  // Branch A: create new org
  const [orgName, setOrgName] = useState('');
  const [tier, setTier] = useState('Free');
  const [teamEmails, setTeamEmails] = useState('');
  const [oauthStatus, setOauthStatus] = useState<'idle' | 'authorizing' | 'authorized'>('idle');
  // Branch B: existing account
  const [workEmail, setWorkEmail] = useState('');
  const [ssoDetected, setSsoDetected] = useState(false);
  const [ssoStatus, setSsoStatus] = useState<'idle' | 'signing-in' | 'signed-in'>('idle');
  const [existingOrgName, setExistingOrgName] = useState('');
  const [existingOauthStatus, setExistingOauthStatus] = useState<'idle' | 'authorizing' | 'authorized'>('idle');

  useEffect(() => {
    if (oauthStatus !== 'authorizing') return undefined;
    const timeoutId = window.setTimeout(() => setOauthStatus('authorized'), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [oauthStatus]);

  useEffect(() => {
    if (ssoStatus !== 'signing-in') return undefined;
    const timeoutId = window.setTimeout(() => setSsoStatus('signed-in'), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [ssoStatus]);

  useEffect(() => {
    if (existingOauthStatus !== 'authorizing') return undefined;
    const timeoutId = window.setTimeout(() => setExistingOauthStatus('authorized'), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [existingOauthStatus]);

  function handleWorkEmailChange(value: string) {
    setWorkEmail(value);
    const domain = value.includes('@') ? value.split('@')[1] : '';
    const isPersonal = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'].includes(domain ?? '');
    setSsoDetected(Boolean(domain) && domain.includes('.') && !isPersonal);
  }

  const canContinueNo = orgName.trim().length > 0 && oauthStatus === 'authorized';
  const canContinueYes = ssoStatus === 'signed-in' || existingOauthStatus === 'authorized';
  const canContinue = (hasAccount === 'no' && canContinueNo) || (hasAccount === 'yes' && canContinueYes);

  return (
    <form style={FORM_STACK} aria-label="Connect to HCP Terraform">
      <section style={SECTION_CARD} aria-labelledby="b-account-question-heading">
        <h3 id="b-account-question-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Do you have an HCP Terraform account?</h3>
        <RadioGroup value={hasAccount ?? ''} onChange={(_, data) => setHasAccount(data.value as 'no' | 'yes')}>
          <Radio value="no" label="No - create one now" />
          <Radio value="yes" label="Yes - I already have one" />
        </RadioGroup>
      </section>

      {hasAccount === 'no' ? (
        <>
          <section style={SECTION_CARD} aria-labelledby="b-org-heading">
            <h3 id="b-org-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>New HCP Terraform Organization</h3>
            <div style={{ display: 'grid', gap: hds.space14 }}>
              <Field label="Organization name">
                <Input id="b-org-name" value={orgName} onChange={(_, data) => setOrgName(data.value)} placeholder="e.g. my-company-infra" />
              </Field>
              <Field label="Plan tier">
                <Select id="b-tier" value={tier} onChange={(event) => setTier(event.target.value)}>
                  <option>Free</option>
                  <option>Plus</option>
                  <option>Enterprise</option>
                </Select>
              </Field>
              <Field label="Invite teammates (optional)">
                <Input id="b-team-emails" value={teamEmails} onChange={(_, data) => setTeamEmails(data.value)} placeholder="email@company.com, email2@company.com" />
              </Field>
            </div>
          </section>
          <section style={SECTION_CARD} aria-labelledby="b-oauth-heading">
            <h3 id="b-oauth-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Authorize Azure</h3>
            <div style={{ display: 'grid', justifyItems: 'start', gap: hds.space12 }}>
              <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.55 }}>Allow Azure to connect to your new HCP Terraform organization. You can revoke this at any time.</p>
              <Button
                onClick={() => setOauthStatus('authorizing')}
                disabledReason={oauthStatus === 'authorized' ? 'Already authorized.' : oauthStatus === 'authorizing' ? 'Authorization in progress.' : undefined}
              >
                {oauthStatus === 'authorized' ? 'Authorized' : 'Authorize Azure'}
              </Button>
              {oauthStatus === 'authorizing' ? <p role="status" style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.5 }}>Waiting for authorization...</p> : null}
              {oauthStatus === 'authorized' ? <p role="status" style={{ margin: 0, color: hds.success, lineHeight: 1.5 }}>Azure is authorized to connect to this organization.</p> : null}
            </div>
          </section>
        </>
      ) : null}

      {hasAccount === 'yes' ? (
        <section style={SECTION_CARD} aria-labelledby="b-existing-heading">
          <h3 id="b-existing-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Sign in to HCP Terraform</h3>
          <div style={{ display: 'grid', gap: hds.space14 }}>
            <Field label="Work email">
              <Input
                id="b-work-email"
                type="email"
                value={workEmail}
                onChange={(_, data) => handleWorkEmailChange(data.value)}
                placeholder="you@company.com"
              />
            </Field>
            {workEmail.includes('@') && ssoDetected ? (
              <div style={{ display: 'grid', justifyItems: 'start', gap: hds.space12 }}>
                <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.55 }}>
                  Your organization uses company SSO. You'll be redirected to your identity provider to sign in.
                </p>
                <Button
                  onClick={() => setSsoStatus('signing-in')}
                  disabledReason={ssoStatus !== 'idle' ? (ssoStatus === 'signing-in' ? 'Signing in...' : 'Already signed in.') : undefined}
                >
                  {ssoStatus === 'signed-in' ? 'Signed in' : 'Sign in with company SSO'}
                </Button>
                {ssoStatus === 'signing-in' ? <p role="status" style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.5 }}>Redirecting to identity provider...</p> : null}
                {ssoStatus === 'signed-in' ? <p role="status" style={{ margin: 0, color: hds.success, lineHeight: 1.5 }}>Signed in. Select an organization to continue.</p> : null}
              </div>
            ) : null}
            {workEmail.includes('@') && !ssoDetected ? (
              <div style={{ display: 'grid', gap: hds.space14 }}>
                <Field label="Organization name">
                  <Input id="b-existing-org" value={existingOrgName} onChange={(_, data) => setExistingOrgName(data.value)} placeholder="e.g. platform-prod" />
                </Field>
                <div style={{ display: 'grid', justifyItems: 'start', gap: hds.space12 }}>
                  <Button
                    onClick={() => setExistingOauthStatus('authorizing')}
                    disabledReason={existingOauthStatus === 'authorized' ? 'Already authorized.' : existingOauthStatus === 'authorizing' ? 'Authorization in progress.' : undefined}
                  >
                    {existingOauthStatus === 'authorized' ? 'Authorized' : 'Authorize Azure'}
                  </Button>
                  {existingOauthStatus === 'authorizing' ? <p role="status" style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.5 }}>Waiting for authorization...</p> : null}
                  {existingOauthStatus === 'authorized' ? <p role="status" style={{ margin: 0, color: hds.success, lineHeight: 1.5 }}>Azure is authorized to connect to this organization.</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <div style={ACTIONS}>
        <Button disabledReason="This is the first section.">Previous</Button>
        <ButtonSet>
          <Button variant="primary" disabledReason={canContinue ? undefined : 'Complete the steps above to continue.'} onClick={onContinue}>Next</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function SelectAzureResourcesStep({ selections, onSelectionChange, onPrevious, onContinue }: { selections: FormSelections; onSelectionChange: (id: string, value: FormValue) => void; onPrevious: () => void; onContinue: () => void }) {
  const hasSelection = ARM_RESOURCE_GROUPS.some((rg) => selections[`b-rg:${rg.id}`]);
  const allSelected = ARM_RESOURCE_GROUPS.every((rg) => selections[`b-rg:${rg.id}`]);

  return (
    <form style={FORM_STACK} aria-label="Select Azure resource groups">
      <section style={SECTION_CARD} aria-labelledby="b-rg-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: hds.space12, flexWrap: 'wrap' }}>
          <h3 id="b-rg-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Azure Resource Groups</h3>
          <span style={{ color: hds.textSecondary, fontSize: 13 }}>{ARM_RESOURCE_GROUPS.length} resource groups found</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                <th scope="col" style={{ width: 44, padding: '10px 12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary, fontSize: 12, fontWeight: 700, textAlign: 'left' }}>
                  <Checkbox aria-label="Select all resource groups" checked={allSelected} onChange={(_, data) => ARM_RESOURCE_GROUPS.forEach((rg) => onSelectionChange(`b-rg:${rg.id}`, Boolean(data.checked)))} />
                </th>
                {['Resource group', 'Subscription', 'Resources', 'Location'].map((heading) => (
                  <th key={heading} scope="col" style={{ padding: '10px 12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary, fontSize: 12, fontWeight: 700, textAlign: 'left' }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ARM_RESOURCE_GROUPS.map((rg) => (
                <tr key={rg.id}>
                  <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}` }}>
                    <Checkbox aria-label={`Select ${rg.name}`} checked={Boolean(selections[`b-rg:${rg.id}`])} onChange={(_, data) => onSelectionChange(`b-rg:${rg.id}`, Boolean(data.checked))} />
                  </td>
                  <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, fontWeight: 600 }}>{rg.name}</td>
                  <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{rg.subscription}</td>
                  <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{rg.resourceCount} resources</td>
                  <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{rg.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={ACTIONS}>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button variant="primary" disabledReason={hasSelection ? undefined : 'Select at least one resource group to continue.'} onClick={onContinue}>Next</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function ConfirmStepB({ selections, onPrevious, onConfirm }: { selections: FormSelections; onPrevious: () => void; onConfirm: () => void }) {
  const selectedRgs = ARM_RESOURCE_GROUPS.filter((rg) => selections[`b-rg:${rg.id}`]);
  const totalResources = selectedRgs.reduce((sum, rg) => sum + rg.resourceCount, 0);

  return (
    <form style={FORM_STACK} aria-label="Confirm Terraform setup">
      <section style={SECTION_CARD} aria-labelledby="b-confirm-heading">
        <div style={{ display: 'grid', gap: hds.space12 }}>
          <h3 id="b-confirm-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>
            {selectedRgs.length > 0 ? `${selectedRgs.length} resource group${selectedRgs.length > 1 ? 's' : ''} will be under Terraform management` : 'No resource groups selected'}
          </h3>
          {selectedRgs.length > 0 ? (
            <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.55 }}>{totalResources} total resources. No state migration required - Terraform will import the current state of these resources.</p>
          ) : null}
        </div>
        {selectedRgs.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Resource group', 'Workspace name', 'Resources', 'Subscription'].map((heading) => (
                    <th key={heading} scope="col" style={{ padding: '10px 12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary, fontSize: 12, fontWeight: 700, textAlign: 'left' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedRgs.map((rg) => (
                  <tr key={rg.id}>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, fontWeight: 600 }}>{rg.name}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.brand }}>{String(selections[`b-rg-${rg.id.replace('rg-', '').replace(/-/g, '-')}-workspace`] || rg.name.replace('rg-', ''))}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{rg.resourceCount}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${hds.borderPrimary}`, color: hds.textSecondary }}>{rg.subscription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section style={SECTION_CARD} aria-labelledby="b-confirm-outcomes-heading">
        <h3 id="b-confirm-outcomes-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>What happens next</h3>
        <div style={{ display: 'grid', gap: hds.space12 }}>
          {[
            { label: 'Terraform workspaces created', detail: 'One workspace per selected resource group, registered in your HCP Terraform organization.' },
            { label: 'Azure governance applied', detail: 'Policy evaluation, approvals, and cost signals are active for selected resources.' },
            { label: 'Resources visible in Azure portal', detail: 'Connected stacks appear in your Azure Terraform resource view.' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: hds.success, fontWeight: 700, lineHeight: 1.4 }}>✓</span>
              <span>
                <strong style={{ display: 'block', lineHeight: 1.3 }}>{item.label}</strong>
                <span style={{ color: hds.textSecondary, lineHeight: 1.45 }}>{item.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <div style={ACTIONS}>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button variant="primary" onClick={onConfirm}>Finish setup</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Scenario C step components
// ---------------------------------------------------------------------------

function GetStartedStep({ onContinue }: { onContinue: () => void }) {
  const [orgName, setOrgName] = useState('');
  const [ssoStatus, setSsoStatus] = useState<SsoStatus>('idle');

  useEffect(() => {
    if (ssoStatus !== 'connecting') return undefined;
    const timeoutId = window.setTimeout(() => setSsoStatus('connected'), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [ssoStatus]);

  const canContinue = orgName.trim().length > 0 && ssoStatus === 'connected';

  return (
    <form style={FORM_STACK} aria-label="Get started with Terraform and Azure">
      <section style={SECTION_CARD} aria-labelledby="c-whatyoullsetup-heading">
        <h3 id="c-whatyoullsetup-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>What you'll set up</h3>
        <div style={{ display: 'grid', gap: hds.space12 }}>
          {[
            { label: 'Create an HCP Terraform organization', detail: 'A free account that stores your configurations and state.' },
            { label: 'Connect your Azure subscription', detail: 'Terraform gets permission to read and manage Azure resources on your behalf.' },
            { label: 'Define your first workspace', detail: 'A workspace is where a single configuration and its state live.' },
            { label: 'Manage other clouds from the same place', detail: 'Once set up, you can add AWS, GCP, or on-prem resources to the same organization.' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: hds.brand, fontWeight: 700, lineHeight: 1.4, minWidth: 18 }}>→</span>
              <span>
                <strong style={{ display: 'block', lineHeight: 1.3 }}>{item.label}</strong>
                <span style={{ color: hds.textSecondary, lineHeight: 1.45 }}>{item.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={SECTION_CARD} aria-labelledby="c-org-heading">
        <h3 id="c-org-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Create your HCP Terraform organization</h3>
        <div style={{ display: 'grid', gap: hds.space14 }}>
          <Field label="Organization name">
            <Input id="c-org-name" value={orgName} onChange={(_, data) => setOrgName(data.value)} placeholder="e.g. my-company-infra" />
          </Field>
          <div style={{ display: 'grid', justifyItems: 'start', gap: hds.space12 }}>
            <Button onClick={() => setSsoStatus('connecting')} disabledReason={ssoStatus === 'connected' ? 'Already authorized.' : undefined}>
              {ssoStatus === 'connected' ? 'Authorized' : 'Authorize with Azure'}
            </Button>
            {ssoStatus === 'connecting' ? <p role="status" style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.5 }}>Authorizing...</p> : null}
            {ssoStatus === 'connected' ? <p role="status" style={{ margin: 0, color: hds.success, lineHeight: 1.5 }}>Organization created and authorized.</p> : null}
          </div>
        </div>
      </section>

      <div style={ACTIONS}>
        <Button disabledReason="This is the first section.">Previous</Button>
        <ButtonSet>
          <Button variant="primary" disabledReason={canContinue ? undefined : 'Enter an organization name and authorize to continue.'} onClick={onContinue}>Next</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function CreateFirstWorkspaceStep({ onPrevious, onContinue, onSelectionChange }: { onPrevious: () => void; onContinue: () => void; onSelectionChange: (id: string, value: string) => void }) {
  const [workspaceName, setWorkspaceName] = useState('');
  const [subscription, setSubscription] = useState('');
  const [region, setRegion] = useState('');
  const [template, setTemplate] = useState('empty');

  const canContinue = workspaceName.trim().length > 0 && Boolean(subscription) && Boolean(region);

  return (
    <form style={FORM_STACK} aria-label="Create your first workspace">
      <section style={SECTION_CARD} aria-labelledby="c-workspace-heading">
        <h3 id="c-workspace-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Workspace details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: hds.space14 }} className="azure-terraform-field-grid">
          <label htmlFor="c-ws-name" style={{ gridColumn: '1 / -1' }}>
            <Field label="Workspace name">
              <Input id="c-ws-name" value={workspaceName} onChange={(_, data) => { setWorkspaceName(data.value); onSelectionChange('c-ws-name', data.value); }} placeholder="e.g. azure-networking-dev" />
            </Field>
          </label>
          <Field label="Azure subscription">
            <Select id="c-ws-sub" value={subscription} onChange={(event) => { setSubscription(event.target.value); onSelectionChange('c-ws-sub', event.target.value); }}>
              <option value="">Select subscription...</option>
              <option>My Azure Subscription</option>
              <option>Development Subscription</option>
              <option>Production Subscription</option>
            </Select>
          </Field>
          <Field label="Primary region">
            <Select id="c-ws-region" value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="">Select region...</option>
              <option>East US</option>
              <option>West US 2</option>
              <option>West Europe</option>
              <option>Southeast Asia</option>
            </Select>
          </Field>
        </div>
      </section>

      <section style={SECTION_CARD} aria-labelledby="c-template-heading">
        <h3 id="c-template-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Starter template</h3>
        <div style={{ display: 'grid', gap: hds.space12 }} role="radiogroup" aria-label="Starter template">
          {[
            { id: 'empty', label: 'Empty workspace', helper: 'Start from scratch. You write the configuration.' },
            { id: 'vm', label: 'Example: Virtual Machine', helper: 'A starter config that creates a single Azure VM.' },
            { id: 'storage', label: 'Example: Storage Account', helper: 'A starter config that creates a storage account and container.' },
          ].map((option) => (
            <label key={option.id} style={{ ...CHOICE_CARD, borderColor: template === option.id ? hds.brand : hds.borderPrimary, background: template === option.id ? hds.brandFaint : hds.surfacePrimary, cursor: 'pointer' }}>
              <input type="radio" name="c-template" value={option.id} checked={template === option.id} onChange={() => setTemplate(option.id)} />
              <span>
                <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3 }}>{option.label}</strong>
                <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{option.helper}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div style={ACTIONS}>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button variant="primary" disabledReason={canContinue ? undefined : 'Enter a workspace name, subscription, and region to continue.'} onClick={onContinue}>Next</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function ConfirmStepC({ selections, onPrevious, onConfirm }: { selections: FormSelections; onPrevious: () => void; onConfirm: () => void }) {
  return (
    <form style={FORM_STACK} aria-label="Setup complete">
      <section style={SECTION_CARD} aria-labelledby="c-done-heading">
        <div style={{ display: 'grid', gap: hds.space12 }}>
          <h3 id="c-done-heading" style={{ margin: 0, fontSize: 20, lineHeight: 1.3 }}>You're set up.</h3>
          <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.55 }}>Your first Terraform workspace is connected to Azure. Here's where to go next.</p>
        </div>
        <div style={{ display: 'grid', gap: hds.space12 }}>
          {[
            { label: 'Open your workspace in HCP Terraform', detail: 'View your workspace, write your first configuration, and run a plan.' },
            { label: 'Run your first plan', detail: 'A plan shows what Terraform would create or change without applying anything.' },
            { label: 'Explore the Azure Terraform resource view', detail: 'See your connected workspace in the Azure portal.' },
            { label: 'Read the getting started guide', detail: 'Step-by-step docs for managing Azure infrastructure with Terraform.' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 14, border: `1px solid ${hds.borderPrimary}`, borderRadius: hds.radiusLarge, background: hds.surfacePrimary }}>
              <span style={{ color: hds.brand, fontSize: 18, lineHeight: 1, minWidth: 20 }} aria-hidden="true">→</span>
              <span>
                <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3, color: hds.brand }}>{item.label}</strong>
                <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{item.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <div style={ACTIONS}>
        <Button onClick={onPrevious}>Previous</Button>
        <ButtonSet>
          <Button variant="primary" onClick={onConfirm}>Open HCP Terraform</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function StepperNav({ steps, currentStep, onStepChange }: { steps: AzureFormStep[]; currentStep: number; onStepChange: (index: number) => void }) {
  return (
    <TabList
      selectedValue={String(currentStep)}
      onTabSelect={(_, data) => onStepChange(Number(data.value))}
      style={{ borderBottom: '1px solid #d1d1d1', padding: '0 24px', background: '#ffffff' }}
    >
      {steps.map((step, index) => (
        <Tab
          key={step.code}
          id={`azure-terraform-step-${index}`}
          value={String(index)}
        >
          {step.title}
        </Tab>
      ))}
    </TabList>
  );
}

export function AzureTerraformTabbedFormWireframe({ initialScenario, initialScreen }: { initialScenario?: Scenario; initialScreen?: 'splash' | 'product' | 'resource' | 'stepper' | 'c-success' } = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screen, setScreen] = useState<'splash' | 'product' | 'resource' | 'stepper' | 'c-success'>(initialScreen ?? 'splash');
  const [scenario, setScenario] = useState<Scenario | null>(initialScenario ?? null);
  const [formSelections, setFormSelections] = useState<FormSelections>(() => getInitialFormSelections());
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [mapVerificationStatus, setMapVerificationStatus] = useState<MapVerificationStatus>('idle');
  const [verifiedResourceCount, setVerifiedResourceCount] = useState(0);
  const [verifiedWorkspaceCount, setVerifiedWorkspaceCount] = useState(0);
  const [showMapVerificationToast, setShowMapVerificationToast] = useState(false);
  const [productStackWorkspaces, setProductStackWorkspaces] = useState<WorkspaceRow[]>([]);

  const activeSteps = scenario === 'B' ? azureTerraformStepsB : scenario === 'C' ? azureTerraformStepsC : azureTerraformSteps;
  const activeStep = activeSteps[activeIndex];
  const progress = ((activeIndex + 1) / activeSteps.length) * 100;

  useEffect(() => {
    if (mapVerificationStatus !== 'verifying') return undefined;

    const timeoutId = window.setTimeout(() => {
      setMapVerificationStatus('verified');
      setShowMapVerificationToast(true);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [mapVerificationStatus]);

  function handleSelectionChange(id: string, value: FormValue) {
    if (id.startsWith('workspace:') || id.startsWith('workspace-map:')) {
      setMapVerificationStatus('idle');
      setShowMapVerificationToast(false);
    }

    setFormSelections((currentSelections) => ({
      ...currentSelections,
      [id]: value,
    }));
  }

  function handleMapVerification(resourceCount: number, workspaceCount: number) {
    setVerifiedResourceCount(resourceCount);
    setVerifiedWorkspaceCount(workspaceCount);
    setShowMapVerificationToast(false);
    setMapVerificationStatus('verifying');
  }

  function handleConfirmSetup() {
    if (scenario === 'A' || scenario === null) {
      const createdStackWorkspaces = getWorkspacesForOrganization(selectedOrganization).filter((workspace) => formSelections[`workspace:${workspace.id}`]);
      if (createdStackWorkspaces.length > 0) setProductStackWorkspaces(createdStackWorkspaces);
    }
    if (scenario === 'B') {
      const createdStackWorkspaces = ARM_RESOURCE_GROUPS
        .filter((rg) => formSelections[`b-rg:${rg.id}`])
        .map((rg): WorkspaceRow => ({
          id: rg.id,
          name: rg.name.replace(/^rg-/, ''),
          repoNumber: 'n/a',
          subscription: rg.subscription,
          latestApplyStatus: 'Imported today',
          resourceCount: rg.resourceCount,
        }));
      if (createdStackWorkspaces.length > 0) setProductStackWorkspaces(createdStackWorkspaces);
    }
    if (scenario === 'C') {
      const wsName = (formSelections['c-ws-name'] as string | undefined) ?? 'azure-networking-dev';
      const wsSub = (formSelections['c-ws-sub'] as string | undefined) ?? 'My Azure Subscription';
      setProductStackWorkspaces([{ id: 'c-new-1', name: wsName, repoNumber: '#001', subscription: wsSub, latestApplyStatus: 'Connected today', resourceCount: 0 }]);
      setScreen('c-success');
    } else {
      setScreen('product');
    }
    setActiveIndex(0);
  }

  function handleStepKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastAvailable = activeSteps.length - 1;
    let nextIndex = index;

    if (event.key === 'ArrowRight') nextIndex = index >= lastAvailable ? 0 : index + 1;
    if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastAvailable : index - 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = lastAvailable;
    if (event.key === 'Enter' || event.key === ' ') nextIndex = index;

    if (nextIndex <= lastAvailable && (nextIndex !== index || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      requestAnimationFrame(() => document.getElementById(`azure-terraform-step-${nextIndex}`)?.focus());
    }
  }

  if (screen === 'splash') {
    return <AzurePortalSplash onSearchResult={() => setScreen('product')} onCreateResource={() => setScreen('resource')} />;
  }

  if (screen === 'product') {
    return <TerraformProductScreen stackWorkspaces={productStackWorkspaces} onGetStarted={(selected) => { setScenario(selected); setActiveIndex(0); setScreen('stepper'); }} onHome={() => setScreen('splash')} onTerraformSearch={() => setScreen('product')} onCreateResource={() => setScreen('resource')} />;
  }

  if (screen === 'resource') {
    return <CreateResourcePage onHome={() => setScreen('splash')} onTerraformSearch={() => setScreen('product')} onCreateResource={() => setScreen('resource')} onGetStarted={() => setScreen('product')} />;
  }

  if (screen === 'c-success') {
    return <TerraformCSuccessScreen onHome={() => setScreen('splash')} onTerraformSearch={() => setScreen('product')} onCreateResource={() => setScreen('resource')} />;
  }

  return (
    <div className="azure-terraform-shell" style={APP_FRAME}>
      <style>{RESPONSIVE_STYLES}</style>
      <a className="azure-terraform-skip-link" href="#azure-terraform-main" style={SKIP_LINK}>Skip to form</a>
      <AzureTopBar onHome={() => setScreen('splash')} onTerraformSelect={() => setScreen('product')} onCreateResource={() => setScreen('resource')} />
      <main className="azure-terraform-main" id="azure-terraform-main" style={MAIN}>
        <div style={AZ_PAGE_CHROME}>
          <div style={AZ_BREADCRUMB}>Home &rsaquo; Terraform RP</div>
          <TerraformHeader />
          <StepperNav steps={activeSteps} currentStep={activeIndex} onStepChange={setActiveIndex} />
        </div>

        <section className="azure-terraform-panel" id="azure-terraform-step-panel" aria-labelledby={`azure-terraform-step-${activeIndex}`} style={PANEL}>
          <div className="azure-terraform-overview" style={OVERVIEW}>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 600, lineHeight: 1.2, color: '#201f1e' }}>{activeStep.title}</h2>
            {activeStep.title === 'Workspaces' ? (
              <p style={{ margin: 0, maxWidth: 640, color: hds.textSecondary, lineHeight: 1.55 }}>
                Discover and connect existing Terraform workspaces, map to Azure scope, and verify the state & resource ownership.
              </p>
            ) : null}
            {activeStep.title === 'Register Workspaces in Azure' ? (
              <p style={{ margin: 0, maxWidth: 640, color: hds.textSecondary, lineHeight: 1.55 }}>
                Review your Terraform Stack details to continue.
              </p>
            ) : null}
            {activeStep.title === 'Confirm' ? (
              <p style={{ margin: 0, maxWidth: 640, color: hds.textSecondary, lineHeight: 1.55 }}>
                Existing Terraform infrastructure is now connected to Azure. Please select APPLY to confirm this setup.
              </p>
            ) : null}
          </div>

          <div className="azure-terraform-body">
              {scenario === 'B' ? (
                activeIndex === 0 ? (
                  <HcpConnectionStepB onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(1)} />
                ) : activeStep.title === 'Select Azure Resources' ? (
                  <SelectAzureResourcesStep selections={formSelections} onSelectionChange={handleSelectionChange} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))} />
                ) : activeStep.title === 'Enable Governance' ? (
                  <form style={FORM_STACK} aria-label={activeStep.title}>
                    {activeStep.sections.map((section) => (
                      <FormSection key={section.title} section={section} selections={formSelections} onSelectionChange={handleSelectionChange} />
                    ))}
                    <div style={ACTIONS}>
                      <Button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous</Button>
                      <ButtonSet>
                        <Button variant="primary" onClick={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))}>Next</Button>
                      </ButtonSet>
                    </div>
                  </form>
                ) : activeStep.title === 'Register Resources' ? (
                  <TerraformStacksStep selectedOrganization={selectedOrganization} selections={formSelections} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))} />
                ) : activeIndex === activeSteps.length - 1 ? (
                  <ConfirmStepB selections={formSelections} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onConfirm={handleConfirmSetup} />
                ) : (
                  <form style={FORM_STACK} aria-label={activeStep.title}>
                    {activeStep.sections.map((section) => (
                      <FormSection key={section.title} section={section} selections={formSelections} onSelectionChange={handleSelectionChange} />
                    ))}
                    <div style={ACTIONS}>
                      <Button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous</Button>
                      <ButtonSet>
                        <Button variant="primary" onClick={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))}>Next</Button>
                      </ButtonSet>
                    </div>
                  </form>
                )
              ) : scenario === 'C' ? (
                activeIndex === 0 ? (
                  <GetStartedStep onContinue={() => setActiveIndex(1)} />
                ) : activeStep.title === 'Create Your First Workspace' ? (
                  <CreateFirstWorkspaceStep onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))} onSelectionChange={handleSelectionChange} />
                ) : activeIndex === activeSteps.length - 1 ? (
                  <ConfirmStepC selections={formSelections} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onConfirm={handleConfirmSetup} />
                ) : (
                  <form style={FORM_STACK} aria-label={activeStep.title}>
                    {activeStep.sections.map((section) => (
                      <FormSection key={section.title} section={section} selections={formSelections} onSelectionChange={handleSelectionChange} />
                    ))}
                    <div style={ACTIONS}>
                      <Button disabledReason={activeIndex === 0 ? 'This is the first section.' : undefined} onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous</Button>
                      <ButtonSet>
                        <Button variant="primary" onClick={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))}>Next</Button>
                      </ButtonSet>
                    </div>
                  </form>
                )
              ) : (
                activeIndex === 0 ? (
                  <HcpConnectionStep selectedOrganization={selectedOrganization} onOrganizationChange={setSelectedOrganization} onContinue={() => setActiveIndex(1)} />
                ) : activeStep.title === 'Workspaces' ? (
                  <WorkspacesStep selectedOrganization={selectedOrganization} selections={formSelections} onSelectionChange={handleSelectionChange} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))} />
                ) : activeStep.title === 'Map Workspaces' ? (
                  <MapWorkspacesStep selectedOrganization={selectedOrganization} selections={formSelections} verificationStatus={mapVerificationStatus} onSelectionChange={handleSelectionChange} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onVerify={handleMapVerification} onContinue={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))} />
                ) : activeStep.title === 'Enable Azure Governance' ? (
                  <form style={FORM_STACK} aria-label={activeStep.title}>
                    <section style={SECTION_CARD} aria-label="Enable Azure Governance placeholder">
                      <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>TBD - Optional/Recommended?</p>
                    </section>
                    <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
                      <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
                      <Button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous</Button>
                      <ButtonSet>
                        <Button variant="primary" onClick={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))}>Next</Button>
                      </ButtonSet>
                    </div>
                  </form>
                ) : activeStep.title === 'Register Workspaces in Azure' ? (
                  <TerraformStacksStep selectedOrganization={selectedOrganization} selections={formSelections} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))} />
                ) : activeIndex === activeSteps.length - 1 ? (
                  <ConfirmStep selections={formSelections} selectedOrganization={selectedOrganization} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onConfirm={handleConfirmSetup} />
                ) : (
                  <form style={FORM_STACK} aria-label={activeStep.title}>
                    {activeStep.sections.map((section) => (
                      <FormSection key={section.title} section={section} selections={formSelections} onSelectionChange={handleSelectionChange} />
                    ))}
                    <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
                      <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
                      <Button disabledReason={activeIndex === 0 ? 'This is the first section.' : undefined} onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous</Button>
                      <ButtonSet>
                        <Button variant="primary" onClick={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))}>Next</Button>
                      </ButtonSet>
                    </div>
                  </form>
                )
              )}
            </div>
        </section>
      </main>
      {showMapVerificationToast ? <MapVerificationToast resourceCount={verifiedResourceCount} workspaceCount={verifiedWorkspaceCount} onClose={() => setShowMapVerificationToast(false)} /> : null}
    </div>
  );
}

const meta: Meta = {
  title: 'Wireframes/Azure Terraform RP/Stepper Nav Form',
  excludeStories: ['AzureTerraformTabbedFormWireframe'],
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Azure Terraform RP', height: '92vh' },
  },
};

export default meta;

type Story = StoryObj;

export const OnboardingForm: Story = {
  render: () => (
    <FluentProvider theme={webLightTheme} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <AzureTerraformTabbedFormWireframe />
    </FluentProvider>
  ),
};

export const ScenarioA: Story = {
  name: 'Scenario A - Existing Terraform User',
  render: () => (
    <FluentProvider theme={webLightTheme} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <AzureTerraformTabbedFormWireframe initialScenario="A" initialScreen="stepper" />
    </FluentProvider>
  ),
};

export const ScenarioB: Story = {
  name: 'Scenario B - Azure User, New to Terraform',
  render: () => (
    <FluentProvider theme={webLightTheme} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <AzureTerraformTabbedFormWireframe initialScenario="B" initialScreen="stepper" />
    </FluentProvider>
  ),
};

export const ScenarioC: Story = {
  name: 'Scenario C - New to Both',
  render: () => (
    <FluentProvider theme={webLightTheme} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <AzureTerraformTabbedFormWireframe initialScenario="C" initialScreen="stepper" />
    </FluentProvider>
  ),
};