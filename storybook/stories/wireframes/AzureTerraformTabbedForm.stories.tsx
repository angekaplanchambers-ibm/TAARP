import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { azureTerraformSteps } from './_azure-terraform-fixtures';
import type { AzureFormControl, AzureFormSection, AzureFormStep } from './_azure-terraform-fixtures';

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

  azureTerraformSteps.forEach((step) => {
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
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .azure-terraform-stepper-step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 19px;
    left: calc(50% + 18px);
    right: calc(-50% + 18px);
    height: 2px;
    background: var(--token-color-border-primary, #d5d7de);
  }

  .azure-terraform-stepper-step[data-status='complete']:not(:last-child)::after {
    background: var(--token-color-terraform-brand, #7b42bc);
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
      grid-template-columns: 1fr;
      gap: var(--hds-space-12, 12px);
    }

    .azure-terraform-stepper-step:not(:last-child)::after {
      display: none;
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
  padding: hds.space24,
  overflow: 'hidden',
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
  display: 'grid',
  gap: 0,
  padding: `${hds.space32} ${hds.space24} ${hds.space24}`,
  borderBottom: `1px solid ${hds.borderPrimary}`,
  background: hds.surfacePrimary,
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
  minHeight: 0,
  overflow: 'auto',
  padding: hds.space24,
};

const OVERVIEW: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'start',
  gap: hds.space20,
  paddingBottom: hds.space20,
  marginBottom: hds.space20,
  borderBottom: `1px solid ${hds.borderPrimary}`,
};

const BODY_GRID: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 336px',
  gap: hds.space24,
  alignItems: 'start',
};

const FORM_STACK: CSSProperties = {
  display: 'grid',
  gap: hds.space22,
};

const SECTION_CARD: CSSProperties = {
  display: 'grid',
  gap: hds.space14,
  padding: hds.space18,
  border: `1px solid ${hds.borderPrimary}`,
  borderRadius: hds.radiusLarge,
  background: hds.surfacePrimary,
};

const SECTION_HEADER: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: hds.space12,
};

const LABEL: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  color: hds.textSecondary,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.3,
};

const INPUT: CSSProperties = {
  width: '100%',
  minHeight: 40,
  boxSizing: 'border-box',
  border: `1px solid ${hds.borderStrong}`,
  borderRadius: hds.radiusMedium,
  background: hds.surfacePrimary,
  color: hds.textPrimary,
  padding: '9px 11px',
  lineHeight: 1.45,
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
  gap: 12,
  flexWrap: 'wrap',
  paddingTop: 20,
  borderTop: `1px solid ${hds.borderPrimary}`,
};

const BUTTON_SET: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: 10,
  flexWrap: 'wrap',
};

const BUTTON_PRIMARY: CSSProperties = {
  minHeight: 40,
  border: `1px solid ${hds.brand}`,
  borderRadius: hds.radiusMedium,
  background: hds.brand,
  color: hds.surfacePrimary,
  padding: '8px 16px',
  fontWeight: 600,
  cursor: 'pointer',
};

const BUTTON_SECONDARY: CSSProperties = {
  ...BUTTON_PRIMARY,
  borderColor: hds.borderStrong,
  background: hds.surfacePrimary,
  color: hds.textPrimary,
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 40,
  padding: '0 8px',
  background: '#0078d4',
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
  left: 8,
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

function Button({ children, variant = 'secondary', disabledReason, onClick, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: 'primary' | 'secondary'; disabledReason?: string }) {
  const isDisabled = Boolean(disabledReason);

  return (
    <button
      {...props}
      aria-disabled={isDisabled || undefined}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
      style={{
        ...(variant === 'primary' ? BUTTON_PRIMARY : BUTTON_SECONDARY),
        opacity: isDisabled ? 0.55 : 1,
        ...style,
      }}
      title={disabledReason || props.title}
      type={props.type || 'button'}
    >
      {children}
    </button>
  );
}

function ButtonSet({ children }: { children: ReactNode }) {
  return <div style={BUTTON_SET}>{children}</div>;
}

function TerraformIcon() {
  return <span style={{ width: 28, height: 28, borderRadius: 4, display: 'grid', placeItems: 'center', background: '#f4ecff', color: '#7b42bc', fontSize: 13, fontWeight: 700 }} aria-hidden="true">T</span>;
}

function SplashCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={SPLASH_CARD}>
      <span style={SPLASH_CARD_ICON} aria-hidden="true">{icon}</span>
      <span style={{ display: 'grid', gap: 12 }}>
        <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25 }}>{title}</span>
        <span style={{ fontSize: 15, lineHeight: 1.45 }}>{description}</span>
      </span>
    </div>
  );
}

function AzureSearchForm({ onTerraformSelect }: { onTerraformSelect: () => void }) {
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
      <input
        aria-autocomplete="list"
        aria-controls="azure-splash-search-results"
        aria-expanded={shouldShowTerraformResult}
        aria-label="Search resources, services and docs"
        autoComplete="off"
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search resources, services and docs"
        role="combobox"
        style={AZURE_SEARCH}
        value={searchQuery}
      />
      <button type="submit" style={AZURE_SEARCH_BUTTON}>Search</button>
      {shouldShowTerraformResult ? (
        <div id="azure-splash-search-results" role="listbox" style={AZURE_SEARCH_DROPDOWN}>
          <button type="button" role="option" aria-selected="false" style={AZURE_SEARCH_RESULT} onClick={onTerraformSelect}>
            <TerraformIcon />
            <span>Terraform</span>
          </button>
        </div>
      ) : null}
    </form>
  );
}

function AzureTopBar({ onHome, onTerraformSelect }: { onHome?: () => void; onTerraformSelect: () => void }) {
  return (
    <header className="azure-splash-bar" style={AZURE_BAR} aria-label="Search resources">
      {onHome ? <button type="button" style={HOME_BUTTON} onClick={onHome}>Home</button> : null}
      <AzureSearchForm onTerraformSelect={onTerraformSelect} />
    </header>
  );
}

function AzurePortalSplash({ onSearchResult }: { onSearchResult: () => void }) {
  const cards = [
    { icon: 'TPL', title: 'Start with a template', description: 'Deploy in minutes using pre-made templates.' },
    { icon: '+', title: 'Create a resource', description: 'Choose a service to create a resource in your subscription.' },
    { icon: 'AI', title: 'Build an AI agent', description: 'Create and manage AI apps and agents using the latest models.' },
    { icon: 'GH', title: 'Import code from GitHub', description: 'Connect your GitHub account and deploy existing repositories.' },
  ];

  return (
    <div style={SPLASH_FRAME}>
      <AzureTopBar onTerraformSelect={onSearchResult} />

      <main className="azure-splash-main" style={SPLASH_MAIN}>
        <section style={SPLASH_CONTENT} aria-label="Azure portal start screen">
          <div style={{ display: 'grid', justifyItems: 'center', gap: 20 }}>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.15, fontWeight: 700, letterSpacing: 0 }}>Let's start building!</h1>
          </div>

          <div className="azure-splash-grid" style={SPLASH_GRID}>
            {cards.map((card) => (
              <SplashCard key={card.title} icon={card.icon} title={card.title} description={card.description} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function TerraformProductScreen({ stackWorkspaces, onGetStarted, onHome, onTerraformSearch }: { stackWorkspaces: WorkspaceRow[]; onGetStarted: () => void; onHome: () => void; onTerraformSearch: () => void }) {
  return (
    <div style={PRODUCT_FRAME}>
      <AzureTopBar onHome={onHome} onTerraformSelect={onTerraformSearch} />
      <header style={PRODUCT_HEADER} aria-label="Terraform product header">
        <TerraformIcon />
        <h1 style={{ margin: 0, fontSize: 20, lineHeight: 1.25, fontWeight: 600, letterSpacing: 0 }}>Terraform</h1>
      </header>
      <main style={PRODUCT_MAIN}>
        <section style={PRODUCT_CONTENT} aria-label="Terraform product overview">
          <div style={PRODUCT_PANEL}>
            <div style={{ display: 'grid', gap: 14 }}>
              <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.15, fontWeight: 700, letterSpacing: 0 }}>Extend Your Terraform Workflows</h2>
              <p style={{ margin: 0, maxWidth: 760, color: '#3b3d45', fontSize: 17, lineHeight: 1.55 }}>
                Connect existing Terraform-managed infrastructure to Azure without changing your current workflows.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" style={BUTTON_PRIMARY} onClick={onGetStarted}>Get Started</button>
            </div>
          </div>

          <section style={PRODUCT_PANEL} aria-labelledby="existing-terraform-stacks-heading">
            <TerraformStacksTable selectedWorkspaces={stackWorkspaces} headingId="existing-terraform-stacks-heading" headingLevel="h2" description="Existing stacks already connected to Azure." />
          </section>
        </section>
      </main>
    </div>
  );
}

function TerraformHeader() {
  return (
    <header style={TERRAFORM_PAGE_HEADER} aria-label="Terraform product header">
      <TerraformIcon />
      <div style={{ display: 'grid', gap: 2 }}>
        <h1 style={{ margin: 0, fontSize: 20, lineHeight: 1.25 }}>Terraform</h1>
        <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.35 }}>Connect existing Terraform-managed infrastructure to Azure.</p>
      </div>
    </header>
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
      <label htmlFor={control.id}>
        <span style={LABEL}>{control.label}</span>
        <input id={control.id} style={INPUT} value={String(selections[control.id] ?? '')} onChange={(event) => onSelectionChange(control.id, event.target.value)} />
      </label>
    );
  }

  if (control.kind === 'select') {
    return (
      <label htmlFor={control.id}>
        <span style={LABEL}>{control.label}</span>
        <select id={control.id} style={INPUT} value={String(selections[control.id] ?? control.options[0] ?? '')} onChange={(event) => onSelectionChange(control.id, event.target.value)}>
          {control.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  if (control.kind === 'textarea') {
    return (
      <label htmlFor={control.id}>
        <span style={LABEL}>{control.label}</span>
        <textarea id={control.id} style={{ ...INPUT, minHeight: 96, resize: 'vertical' }} value={String(selections[control.id] ?? '')} onChange={(event) => onSelectionChange(control.id, event.target.value)} />
      </label>
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

function HcpConnectionStep({ selectedOrganization, ssoStatus, onOrganizationChange, onSsoStatusChange, onContinue }: { selectedOrganization: string; ssoStatus: SsoStatus; onOrganizationChange: (organization: string) => void; onSsoStatusChange: (status: SsoStatus) => void; onContinue: () => void }) {
  const hasSelectedOrganization = Boolean(selectedOrganization);
  const selectedWorkspaceCount = HCP_ORGANIZATION_WORKSPACE_COUNTS[selectedOrganization];
  const selectedOrganizationLabel = getOrganizationLabel(selectedOrganization);

  useEffect(() => {
    if (ssoStatus !== 'connecting') return undefined;

    const timeoutId = window.setTimeout(() => onSsoStatusChange('connected'), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [onSsoStatusChange, ssoStatus]);

  return (
    <form style={FORM_STACK} aria-label="Connect to HCP Terraform">
      <section style={SECTION_CARD} aria-labelledby="hcp-organization-heading">
        <h3 id="hcp-organization-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>HCP Terraform Organization</h3>
        <div style={{ display: 'grid', gap: hds.space12 }}>
          <div>
            <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3 }}>Connect an existing HCP Terraform organization</strong>
            <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>Use the organization that already manages Terraform workspaces.</span>
          </div>
          <label htmlFor="hcp-organization">
            <span style={LABEL}>Organizations</span>
            <select
              id="hcp-organization"
              style={INPUT}
              value={selectedOrganization}
              onChange={(event) => onOrganizationChange(event.target.value)}
            >
              <option value="">Select an organization</option>
              <option value="atlas-platform">Atlas Platform</option>
              <option value="northstar-cloud">Northstar Cloud</option>
              <option value="pioneer-infra">Pioneer Infra</option>
              <option value="summit-ops">Summit Ops</option>
            </select>
          </label>
          {hasSelectedOrganization ? (
            <p role="status" style={{ margin: 0, color: hds.textSecondary, fontSize: 15, lineHeight: 1.5 }}>
              {selectedOrganizationLabel} has {selectedWorkspaceCount} Terraform Workspaces.
            </p>
          ) : null}
        </div>
      </section>

      <section style={SECTION_CARD} aria-labelledby="hcp-oauth-sso-heading">
        <h3 id="hcp-oauth-sso-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>Initiating OAuth/SSO</h3>
        <div style={{ display: 'grid', justifyItems: 'start', gap: hds.space12 }}>
          <Button onClick={() => onSsoStatusChange('connecting')}>{ssoStatus === 'connected' ? 'Connected' : 'Initiate OAuth / SSO'}</Button>
          {ssoStatus === 'connecting' ? (
            <p role="status" style={{ margin: 0, color: hds.textSecondary, fontSize: 15, lineHeight: 1.5 }}>
              Connecting through SSO. Waiting for identity provider response and validating access permissions...
            </p>
          ) : null}
          {ssoStatus === 'connected' ? (
            <p role="status" style={{ margin: 0, color: hds.textSecondary, fontSize: 15, lineHeight: 1.5 }}>
              Connected. You have admin and Onboarding permissions to proceed.
            </p>
          ) : null}
        </div>
      </section>

      <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
        <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
        <Button disabledReason="This is the first section.">Previous section</Button>
        <ButtonSet>
          <Button variant="primary" disabledReason={hasSelectedOrganization ? undefined : 'Select an organization to continue.'} onClick={onContinue}>
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
                    <input aria-label="Select all workspaces" type="checkbox" checked={hasSelectedAllWorkspaces} onChange={(event) => handleSelectAllWorkspaces(event.target.checked)} />
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
                        <input aria-label={`Select ${workspaceName}`} type="checkbox" checked={Boolean(selections[selectionId])} onChange={(event) => onSelectionChange(selectionId, event.target.checked)} />
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
        <Button onClick={onPrevious}>Previous section</Button>
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
    <label style={{ display: 'grid', gap: hds.space8 }}>
      <span style={{ color: hds.textSecondary, fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{label}</span>
      <select value={typeof selections[name] === 'string' ? selections[name] : ''} onChange={(event) => onSelectionChange(name, event.currentTarget.value)} style={{ minHeight: 40, padding: '0 12px', border: `1px solid ${hds.borderPrimary}`, borderRadius: hds.radiusMedium, background: hds.surfacePrimary, color: hds.textPrimary, font: 'inherit' }}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
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
        <Button onClick={onPrevious}>Previous section</Button>
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
      <button type="button" aria-label="Close verification alert" onClick={onClose} style={{ flex: '0 0 auto', border: 0, background: 'transparent', color: hds.textSecondary, cursor: 'pointer', fontSize: 18, fontWeight: 700, lineHeight: 1 }}>X</button>
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
          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ color: hds.textSecondary, fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>Reorder</span>
            <select value={sortMode} onChange={(event) => setSortMode(event.currentTarget.value)} style={{ minHeight: 36, minWidth: 170, padding: '0 10px', border: `1px solid ${hds.borderPrimary}`, borderRadius: hds.radiusMedium, background: hds.surfacePrimary, color: hds.textPrimary, font: 'inherit' }}>
              <option value="newest">Newest to oldest</option>
              <option value="oldest">Oldest to newest</option>
              <option value="stack-az">Stack A-Z</option>
              <option value="stack-za">Stack Z-A</option>
            </select>
          </label>
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
        <Button onClick={onPrevious}>Previous section</Button>
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
        <Button onClick={onPrevious}>Previous section</Button>
        <ButtonSet>
          <Button variant="primary" onClick={onConfirm}>Confirm</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function StepperNav({ steps, currentStep, onStepChange, onKeyDown }: { steps: AzureFormStep[]; currentStep: number; onStepChange: (index: number) => void; onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void }) {
  return (
    <nav className="azure-terraform-stepper-nav" style={STEPPER_NAV} aria-label="Azure Terraform RP setup progress">
      {steps.map((step, index) => (
        <StepperStep key={step.code} step={step} index={index} currentStep={currentStep} onStepChange={onStepChange} onKeyDown={onKeyDown} />
      ))}
    </nav>
  );
}

function StepperStep({ step, index, currentStep, onStepChange, onKeyDown }: { step: AzureFormStep; index: number; currentStep: number; onStepChange: (index: number) => void; onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void }) {
  const status = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'incomplete';
  const indicatorStyle = {
    ...STEPPER_INDICATOR,
    borderColor: status === 'incomplete' ? hds.borderPrimary : hds.brand,
    background: status === 'complete' ? hds.brand : hds.surfacePrimary,
    color: status === 'complete' ? hds.surfacePrimary : status === 'current' ? hds.brand : hds.textFaint,
  } satisfies CSSProperties;

  return (
    <div className="azure-terraform-stepper-step" data-status={status} style={STEPPER_STEP_WRAPPER}>
      <button
        id={`azure-terraform-step-${index}`}
        type="button"
        aria-current={status === 'current' ? 'step' : undefined}
        aria-controls="azure-terraform-step-panel"
        onClick={() => onStepChange(index)}
        onKeyDown={(event) => onKeyDown(event, index)}
        style={{
          ...STEPPER_STEP,
          cursor: 'pointer',
          color: status === 'current' ? hds.textPrimary : hds.textSecondary,
        }}
      >
        <span style={indicatorStyle} aria-hidden="true">{index + 1}</span>
        <span style={{ display: 'grid', gap: 3, minWidth: 0 }}>
          <span style={{ fontWeight: 700, lineHeight: 1.25 }}>{step.title}</span>
        </span>
      </button>
    </div>
  );
}

export function AzureTerraformTabbedFormWireframe() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screen, setScreen] = useState<'splash' | 'product' | 'stepper'>('splash');
  const [formSelections, setFormSelections] = useState<FormSelections>(() => getInitialFormSelections());
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [ssoStatus, setSsoStatus] = useState<SsoStatus>('idle');
  const [mapVerificationStatus, setMapVerificationStatus] = useState<MapVerificationStatus>('idle');
  const [verifiedResourceCount, setVerifiedResourceCount] = useState(0);
  const [verifiedWorkspaceCount, setVerifiedWorkspaceCount] = useState(0);
  const [showMapVerificationToast, setShowMapVerificationToast] = useState(false);
  const [productStackWorkspaces, setProductStackWorkspaces] = useState<WorkspaceRow[]>(() => getProductStackWorkspaces());
  const activeStep = azureTerraformSteps[activeIndex];
  const progress = ((activeIndex + 1) / azureTerraformSteps.length) * 100;

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
    const createdStackWorkspaces = getWorkspacesForOrganization(selectedOrganization).filter((workspace) => formSelections[`workspace:${workspace.id}`]);
    if (createdStackWorkspaces.length > 0) setProductStackWorkspaces(createdStackWorkspaces);
    setScreen('product');
    setActiveIndex(0);
  }

  function handleStepKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastAvailable = azureTerraformSteps.length - 1;
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
    return <AzurePortalSplash onSearchResult={() => setScreen('product')} />;
  }

  if (screen === 'product') {
    return <TerraformProductScreen stackWorkspaces={productStackWorkspaces} onGetStarted={() => setScreen('stepper')} onHome={() => setScreen('splash')} onTerraformSearch={() => setScreen('product')} />;
  }

  return (
    <div className="azure-terraform-shell" style={APP_FRAME}>
      <style>{RESPONSIVE_STYLES}</style>
      <a className="azure-terraform-skip-link" href="#azure-terraform-main" style={SKIP_LINK}>Skip to form</a>
      <AzureTopBar onHome={() => setScreen('splash')} onTerraformSelect={() => setScreen('product')} />
      <main className="azure-terraform-main" id="azure-terraform-main" style={MAIN}>
        <section style={PAGE_CARD} aria-label="Stepper onboarding form">
          <TerraformHeader />
          <StepperNav steps={azureTerraformSteps} currentStep={activeIndex} onStepChange={setActiveIndex} onKeyDown={handleStepKeyDown} />

          <section className="azure-terraform-panel" id="azure-terraform-step-panel" aria-labelledby={`azure-terraform-step-${activeIndex}`} style={PANEL}>
            <div aria-label="Form progress" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <strong style={{ color: hds.textSecondary, fontSize: 13 }}>Section {activeIndex + 1} of {azureTerraformSteps.length}</strong>
                <span style={{ color: hds.textSecondary, fontSize: 13 }}>{Math.round(progress)}% complete</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: hds.surfaceStrong, overflow: 'hidden' }} aria-hidden="true">
                <div style={{ width: `${progress}%`, height: '100%', background: hds.brand }} />
              </div>
            </div>

            <div className="azure-terraform-overview" style={OVERVIEW}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 24, lineHeight: 1.18 }}>{activeStep.title}</h2>
                {activeStep.title === 'Workspaces' ? (
                  <p style={{ margin: 0, maxWidth: 780, color: hds.textSecondary, lineHeight: 1.55 }}>
                    Discover and connect existing Terraform workspaces, map to Azure scope, and verify the state & resource ownership.
                  </p>
                ) : null}
                {activeStep.title === 'Register Workspaces in Azure' ? (
                  <p style={{ margin: 0, maxWidth: 780, color: hds.textSecondary, lineHeight: 1.55 }}>
                    Review your Terraform Stack details to continue.
                  </p>
                ) : null}
                {activeStep.title === 'Confirm' ? (
                  <p style={{ margin: 0, maxWidth: 780, color: hds.textSecondary, lineHeight: 1.55 }}>
                    Existing Terraform infrastructure is now connected to Azure. Please select APPLY to confirm this setup.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="azure-terraform-body-grid" style={{ ...BODY_GRID, gridTemplateColumns: '1fr' }}>
              {activeIndex === 0 ? (
                <HcpConnectionStep selectedOrganization={selectedOrganization} ssoStatus={ssoStatus} onOrganizationChange={setSelectedOrganization} onSsoStatusChange={setSsoStatus} onContinue={() => setActiveIndex(1)} />
              ) : activeStep.title === 'Workspaces' ? (
                <WorkspacesStep selectedOrganization={selectedOrganization} selections={formSelections} onSelectionChange={handleSelectionChange} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(Math.min(azureTerraformSteps.length - 1, activeIndex + 1))} />
              ) : activeStep.title === 'Map Workspaces' ? (
                <MapWorkspacesStep selectedOrganization={selectedOrganization} selections={formSelections} verificationStatus={mapVerificationStatus} onSelectionChange={handleSelectionChange} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onVerify={handleMapVerification} onContinue={() => setActiveIndex(Math.min(azureTerraformSteps.length - 1, activeIndex + 1))} />
              ) : activeStep.title === 'Enable Azure Governance' ? (
                <form style={FORM_STACK} aria-label={activeStep.title}>
                  <section style={SECTION_CARD} aria-label="Enable Azure Governance placeholder">
                    <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>TBD - Optional/Recommended?</p>
                  </section>

                  <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
                    <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
                    <Button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous section</Button>
                    <ButtonSet>
                      <Button variant="primary" onClick={() => setActiveIndex(Math.min(azureTerraformSteps.length - 1, activeIndex + 1))}>Next</Button>
                    </ButtonSet>
                  </div>
                </form>
              ) : activeStep.title === 'Register Workspaces in Azure' ? (
                <TerraformStacksStep selectedOrganization={selectedOrganization} selections={formSelections} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onContinue={() => setActiveIndex(Math.min(azureTerraformSteps.length - 1, activeIndex + 1))} />
              ) : activeIndex === azureTerraformSteps.length - 1 ? (
                <ConfirmStep selections={formSelections} selectedOrganization={selectedOrganization} onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))} onConfirm={handleConfirmSetup} />
              ) : (
                <form style={FORM_STACK} aria-label={activeStep.title}>
                  {activeStep.sections.map((section) => (
                    <FormSection key={section.title} section={section} selections={formSelections} onSelectionChange={handleSelectionChange} />
                  ))}

                  <div style={ACTIONS} aria-describedby="azure-terraform-action-help">
                    <span className="azure-terraform-sr-only" id="azure-terraform-action-help">Primary action is placed on the right and secondary actions are grouped together.</span>
                    <Button
                      disabledReason={activeIndex === 0 ? 'This is the first section.' : undefined}
                      onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                    >
                      Previous section
                    </Button>
                    <ButtonSet>
                      <Button variant="primary" onClick={() => setActiveIndex(Math.min(azureTerraformSteps.length - 1, activeIndex + 1))}>
                        Next
                      </Button>
                    </ButtonSet>
                  </div>
                </form>
              )}
            </div>
          </section>
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
  render: () => <AzureTerraformTabbedFormWireframe />,
};