import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
      <input
        aria-autocomplete="list"
        aria-controls={resultsId}
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

function CreateResourcePage({ onHome, onTerraformSearch, onCreateResource, onGetStarted }: { onHome: () => void; onTerraformSearch: () => void; onCreateResource: () => void; onGetStarted: () => void }) {
  return (
    <div style={PRODUCT_FRAME}>
      <AzureTopBar onHome={onHome} onTerraformSelect={onTerraformSearch} onCreateResource={onCreateResource} />
      <main style={PRODUCT_MAIN}>
        <section style={{ ...PRODUCT_CONTENT, justifyItems: 'stretch' }} aria-label="Create a resource page">
          <div style={{ display: 'grid', gap: hds.space20 }}>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15, fontWeight: 700, letterSpacing: 0 }}>Create a resource</h1>
            <div style={{ justifySelf: 'start' }}>
              <AzureSearchForm onTerraformSelect={onTerraformSearch} resultsId="azure-create-resource-search-results" />
            </div>
          </div>

          <section style={{ ...PRODUCT_PANEL, width: 'min(460px, 100%)', justifySelf: 'center' }} aria-label="Terraform resource card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <TerraformIcon />
              <strong style={{ fontSize: 18, lineHeight: 1.25 }}>Terraform</strong>
            </div>
            <p style={{ margin: 0, color: '#3b3d45', fontSize: 16, lineHeight: 1.55 }}>
              Connect existing Terraform-managed infrastructure to Azure without changing your current workflows.
            </p>
            <div>
              <button type="button" style={BUTTON_PRIMARY} onClick={onGetStarted}>Get Started</button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

function TerraformProductScreen({ stackWorkspaces, onGetStarted, onHome, onTerraformSearch, onCreateResource }: { stackWorkspaces: WorkspaceRow[]; onGetStarted: () => void; onHome: () => void; onTerraformSearch: () => void; onCreateResource: () => void }) {
  return (
    <div style={PRODUCT_FRAME}>
      <AzureTopBar onHome={onHome} onTerraformSelect={onTerraformSearch} onCreateResource={onCreateResource} />
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

          {stackWorkspaces.length > 0 ? (
            <section style={PRODUCT_PANEL} aria-labelledby="existing-terraform-stacks-heading">
              <TerraformStacksTable selectedWorkspaces={stackWorkspaces} headingId="existing-terraform-stacks-heading" headingLevel="h2" description="Existing stacks already connected to Azure." />
            </section>
          ) : null}
        </section>
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
              <button type="button" style={{ ...BUTTON_PRIMARY, background: 'transparent', color: hds.brand, border: `1px solid ${hds.brand}` }} onClick={onTerraformSearch}>View Terraform stacks</button>
            </div>
          </div>
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
          <label htmlFor="hcp-organization">
            <span style={LABEL}>Organization</span>
            <select
              id="hcp-organization"
              style={{ ...INPUT, opacity: sessionState !== 'signed-in' ? 0.5 : 1 }}
              value={selectedOrganization}
              onChange={(event) => onOrganizationChange(event.target.value)}
              disabled={sessionState !== 'signed-in'}
            >
              <option value="">Select an organization</option>
              <option value="atlas-platform">Atlas Platform (SSO enforced)</option>
              <option value="northstar-cloud">Northstar Cloud</option>
              <option value="pioneer-infra">Pioneer Infra</option>
              <option value="summit-ops">Summit Ops</option>
            </select>
          </label>
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
        <Button disabledReason="This is the first section.">Previous section</Button>
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

// ---------------------------------------------------------------------------
// Scenario selector screen
// ---------------------------------------------------------------------------

function ScenarioSelectScreen({ onSelect, onBack }: { onSelect: (scenario: Scenario) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<Scenario>('A');

  const scenarios: { id: Scenario; label: string; helper: string }[] = [
    { id: 'A', label: 'I already use Terraform and want to see my infrastructure in Azure', helper: 'Connect existing Terraform workspaces to Azure without changing your current workflows.' },
    { id: 'B', label: 'I manage Azure resources and want to start using Terraform for governance', helper: 'Bring existing Azure resources under Terraform management and improve governance across your team.' },
    { id: 'C', label: "I'm new to both and want to connect Azure and Terraform for the first time", helper: 'Set up from scratch with step-by-step guidance.' },
  ];

  return (
    <div style={PRODUCT_FRAME}>
      <AzureTopBar onTerraformSelect={onBack} onCreateResource={onBack} />
      <header style={PRODUCT_HEADER} aria-label="Terraform product header">
        <TerraformIcon />
        <h1 style={{ margin: 0, fontSize: 20, lineHeight: 1.25, fontWeight: 600, letterSpacing: 0 }}>Terraform</h1>
      </header>
      <main style={PRODUCT_MAIN}>
        <section style={PRODUCT_CONTENT} aria-label="Scenario selection">
          <div style={{ display: 'grid', gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.2, fontWeight: 700 }}>Which situation fits you?</h2>
            <p style={{ margin: 0, color: '#3b3d45', fontSize: 15, lineHeight: 1.55 }}>Your answer determines which setup steps you see. You can go back and change this at any time.</p>
          </div>
          <form style={{ display: 'grid', gap: 20 }}>
            <div role="radiogroup" aria-label="Setup scenario" style={{ display: 'grid', gap: 12 }}>
              {scenarios.map((scenario) => {
                const isSelected = selected === scenario.id;
                return (
                  <label
                    key={scenario.id}
                    style={{ ...CHOICE_CARD, minHeight: 88, alignItems: 'center', borderColor: isSelected ? hds.brand : hds.borderPrimary, background: isSelected ? hds.brandFaint : hds.surfacePrimary, cursor: 'pointer' }}
                  >
                    <input type="radio" name="scenario" value={scenario.id} checked={isSelected} onChange={() => setSelected(scenario.id)} />
                    <span>
                      <strong style={{ display: 'block', marginBottom: 6, lineHeight: 1.3, fontSize: 15 }}>{scenario.label}</strong>
                      <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{scenario.helper}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button onClick={onBack}>Back</Button>
              <Button variant="primary" onClick={() => onSelect(selected)}>Continue</Button>
            </div>
          </form>
        </section>
      </main>
    </div>
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
        <div style={{ display: 'grid', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: hds.space8, cursor: 'pointer' }}>
            <input type="radio" name="has-account" checked={hasAccount === 'no'} onChange={() => setHasAccount('no')} />
            <span>No - create one now</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: hds.space8, cursor: 'pointer' }}>
            <input type="radio" name="has-account" checked={hasAccount === 'yes'} onChange={() => setHasAccount('yes')} />
            <span>Yes - I already have one</span>
          </label>
        </div>
      </section>

      {hasAccount === 'no' ? (
        <>
          <section style={SECTION_CARD} aria-labelledby="b-org-heading">
            <h3 id="b-org-heading" style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>New HCP Terraform Organization</h3>
            <div style={{ display: 'grid', gap: hds.space14 }}>
              <label htmlFor="b-org-name">
                <span style={LABEL}>Organization name</span>
                <input id="b-org-name" style={INPUT} value={orgName} onChange={(event) => setOrgName(event.target.value)} placeholder="e.g. my-company-infra" />
              </label>
              <label htmlFor="b-tier">
                <span style={LABEL}>Plan tier</span>
                <select id="b-tier" style={INPUT} value={tier} onChange={(event) => setTier(event.target.value)}>
                  <option>Free</option>
                  <option>Plus</option>
                  <option>Enterprise</option>
                </select>
              </label>
              <label htmlFor="b-team-emails">
                <span style={LABEL}>Invite teammates (optional)</span>
                <input id="b-team-emails" style={INPUT} value={teamEmails} onChange={(event) => setTeamEmails(event.target.value)} placeholder="email@company.com, email2@company.com" />
              </label>
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
            <label htmlFor="b-work-email">
              <span style={LABEL}>Work email</span>
              <input
                id="b-work-email"
                type="email"
                style={INPUT}
                value={workEmail}
                onChange={(event) => handleWorkEmailChange(event.target.value)}
                placeholder="you@company.com"
              />
            </label>
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
                <label htmlFor="b-existing-org">
                  <span style={LABEL}>Organization name</span>
                  <input id="b-existing-org" style={INPUT} value={existingOrgName} onChange={(event) => setExistingOrgName(event.target.value)} placeholder="e.g. platform-prod" />
                </label>
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
        <Button disabledReason="This is the first section.">Previous section</Button>
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
                  <input aria-label="Select all resource groups" type="checkbox" checked={allSelected} onChange={(event) => ARM_RESOURCE_GROUPS.forEach((rg) => onSelectionChange(`b-rg:${rg.id}`, event.target.checked))} />
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
                    <input aria-label={`Select ${rg.name}`} type="checkbox" checked={Boolean(selections[`b-rg:${rg.id}`])} onChange={(event) => onSelectionChange(`b-rg:${rg.id}`, event.target.checked)} />
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
        <Button onClick={onPrevious}>Previous section</Button>
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
        <Button onClick={onPrevious}>Previous section</Button>
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
          <label htmlFor="c-org-name">
            <span style={LABEL}>Organization name</span>
            <input id="c-org-name" style={INPUT} value={orgName} onChange={(event) => setOrgName(event.target.value)} placeholder="e.g. my-company-infra" />
          </label>
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
        <Button disabledReason="This is the first section.">Previous section</Button>
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
            <span style={LABEL}>Workspace name</span>
            <input id="c-ws-name" style={INPUT} value={workspaceName} onChange={(event) => { setWorkspaceName(event.target.value); onSelectionChange('c-ws-name', event.target.value); }} placeholder="e.g. azure-networking-dev" />
          </label>
          <label htmlFor="c-ws-sub">
            <span style={LABEL}>Azure subscription</span>
            <select id="c-ws-sub" style={INPUT} value={subscription} onChange={(event) => { setSubscription(event.target.value); onSelectionChange('c-ws-sub', event.target.value); }}>
              <option value="">Select subscription...</option>
              <option>My Azure Subscription</option>
              <option>Development Subscription</option>
              <option>Production Subscription</option>
            </select>
          </label>
          <label htmlFor="c-ws-region">
            <span style={LABEL}>Primary region</span>
            <select id="c-ws-region" style={INPUT} value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="">Select region...</option>
              <option>East US</option>
              <option>West US 2</option>
              <option>West Europe</option>
              <option>Southeast Asia</option>
            </select>
          </label>
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
        <Button onClick={onPrevious}>Previous section</Button>
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
        <Button onClick={onPrevious}>Previous section</Button>
        <ButtonSet>
          <Button variant="primary" onClick={onConfirm}>Open HCP Terraform</Button>
        </ButtonSet>
      </div>
    </form>
  );
}

function StepperNav({ steps, currentStep, onStepChange, onKeyDown }: { steps: AzureFormStep[]; currentStep: number; onStepChange: (index: number) => void; onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void }) {
  return (
    <nav className="azure-terraform-stepper-nav" style={{ ...STEPPER_NAV, gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Azure Terraform RP setup progress">
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

export function AzureTerraformTabbedFormWireframe({ initialScenario, initialScreen }: { initialScenario?: Scenario; initialScreen?: 'splash' | 'product' | 'resource' | 'scenario' | 'stepper' | 'c-success' } = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screen, setScreen] = useState<'splash' | 'product' | 'resource' | 'scenario' | 'stepper' | 'c-success'>(initialScreen ?? 'splash');
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
    return <TerraformProductScreen stackWorkspaces={productStackWorkspaces} onGetStarted={() => setScreen('scenario')} onHome={() => setScreen('splash')} onTerraformSearch={() => setScreen('product')} onCreateResource={() => setScreen('resource')} />;
  }

  if (screen === 'resource') {
    return <CreateResourcePage onHome={() => setScreen('splash')} onTerraformSearch={() => setScreen('product')} onCreateResource={() => setScreen('resource')} onGetStarted={() => setScreen('product')} />;
  }

  if (screen === 'c-success') {
    return <TerraformCSuccessScreen onHome={() => setScreen('splash')} onTerraformSearch={() => setScreen('product')} onCreateResource={() => setScreen('resource')} />;
  }

  if (screen === 'scenario') {
    return (
      <ScenarioSelectScreen
        onSelect={(selected) => {
          setScenario(selected);
          setActiveIndex(0);
          setScreen('stepper');
        }}
        onBack={() => setScreen('product')}
      />
    );
  }

  return (
    <div className="azure-terraform-shell" style={APP_FRAME}>
      <style>{RESPONSIVE_STYLES}</style>
      <a className="azure-terraform-skip-link" href="#azure-terraform-main" style={SKIP_LINK}>Skip to form</a>
      <AzureTopBar onHome={() => setScreen('splash')} onTerraformSelect={() => setScreen('product')} onCreateResource={() => setScreen('resource')} />
      <main className="azure-terraform-main" id="azure-terraform-main" style={MAIN}>
        <section style={PAGE_CARD} aria-label="Stepper onboarding form">
          <TerraformHeader />
          <StepperNav steps={activeSteps} currentStep={activeIndex} onStepChange={setActiveIndex} onKeyDown={handleStepKeyDown} />

          <section className="azure-terraform-panel" id="azure-terraform-step-panel" aria-labelledby={`azure-terraform-step-${activeIndex}`} style={PANEL}>
            <div aria-label="Form progress" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <strong style={{ color: hds.textSecondary, fontSize: 13 }}>Section {activeIndex + 1} of {activeSteps.length}</strong>
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
                      <Button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous section</Button>
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
                      <Button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous section</Button>
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
                      <Button disabledReason={activeIndex === 0 ? 'This is the first section.' : undefined} onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous section</Button>
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
                      <Button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous section</Button>
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
                      <Button disabledReason={activeIndex === 0 ? 'This is the first section.' : undefined} onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous section</Button>
                      <ButtonSet>
                        <Button variant="primary" onClick={() => setActiveIndex(Math.min(activeSteps.length - 1, activeIndex + 1))}>Next</Button>
                      </ButtonSet>
                    </div>
                  </form>
                )
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

export const ScenarioA: Story = {
  name: 'Scenario A - Existing Terraform User',
  render: () => <AzureTerraformTabbedFormWireframe initialScenario="A" initialScreen="stepper" />,
};

export const ScenarioB: Story = {
  name: 'Scenario B - Azure User, New to Terraform',
  render: () => <AzureTerraformTabbedFormWireframe initialScenario="B" initialScreen="stepper" />,
};

export const ScenarioC: Story = {
  name: 'Scenario C - New to Both',
  render: () => <AzureTerraformTabbedFormWireframe initialScenario="C" initialScreen="stepper" />,
};