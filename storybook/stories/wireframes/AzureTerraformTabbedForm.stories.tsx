import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { azureTerraformSteps } from './_azure-terraform-fixtures';
import type { AzureFormControl, AzureFormSection, AzureFormStep } from './_azure-terraform-fixtures';

const tok = {
  bg: 'var(--z-bg)',
  layer01: 'var(--z-layer-01)',
  layer02: 'var(--z-layer-02)',
  textPrimary: 'var(--z-text-primary)',
  textSecondary: 'var(--z-text-secondary)',
  textPlaceholder: 'var(--z-text-placeholder)',
  border: 'var(--z-border-subtle)',
  borderStrong: 'var(--z-border-strong)',
  focus: 'var(--z-focus)',
};

const SHELL: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  background: tok.bg,
  color: tok.textPrimary,
  fontFamily: 'system-ui, sans-serif',
  fontSize: 13,
  overflow: 'hidden',
};

const TOPBAR: CSSProperties = {
  height: 58,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '0 18px',
  borderBottom: `1px solid ${tok.border}`,
  background: tok.layer01,
  flexShrink: 0,
};

const BRAND: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 0,
};

const BRAND_MARK: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 4,
  border: `1px solid ${tok.borderStrong}`,
  display: 'grid',
  placeItems: 'center',
  fontWeight: 700,
  background: tok.bg,
  flexShrink: 0,
};

const BADGE_ROW: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
};

const BADGE: CSSProperties = {
  border: `1px solid ${tok.border}`,
  borderRadius: 999,
  padding: '4px 8px',
  background: tok.bg,
  color: tok.textSecondary,
  fontSize: 11,
  whiteSpace: 'nowrap',
};

const MAIN: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  padding: 18,
};

const CARD: CSSProperties = {
  height: '100%',
  border: `1px solid ${tok.border}`,
  background: tok.bg,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const TABLIST: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(10, minmax(108px, 1fr))',
  overflowX: 'auto',
  borderBottom: `1px solid ${tok.border}`,
  background: tok.layer01,
  flexShrink: 0,
};

const FORM_PANEL: CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: 20,
};

const PROGRESS_TRACK: CSSProperties = {
  height: 8,
  border: `1px solid ${tok.border}`,
  background: tok.layer01,
  marginBottom: 18,
};

const FORM_HEAD: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: 16,
  alignItems: 'start',
  paddingBottom: 16,
  marginBottom: 18,
  borderBottom: `1px solid ${tok.border}`,
};

const BODY_GRID: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 320px',
  gap: 18,
  alignItems: 'start',
};

const FORM_STACK: CSSProperties = {
  display: 'grid',
  gap: 18,
};

const SECTION: CSSProperties = {
  display: 'grid',
  gap: 12,
};

const LABEL: CSSProperties = {
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: tok.textPlaceholder,
  marginBottom: 5,
};

const INPUT: CSSProperties = {
  width: '100%',
  minHeight: 36,
  border: `1px solid ${tok.borderStrong}`,
  background: tok.bg,
  color: tok.textPrimary,
  padding: '8px 10px',
  borderRadius: 4,
  boxSizing: 'border-box',
};

const CHOICE: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  border: `1px solid ${tok.border}`,
  background: tok.bg,
  borderRadius: 4,
  padding: 10,
};

const REVIEW_PANEL: CSSProperties = {
  position: 'sticky',
  top: 0,
  display: 'grid',
  gap: 12,
  border: `1px solid ${tok.border}`,
  background: tok.layer01,
  padding: 14,
  borderRadius: 4,
};

const ACTIONS: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
  borderTop: `1px solid ${tok.border}`,
  paddingTop: 16,
  marginTop: 2,
};

const BUTTON: CSSProperties = {
  minHeight: 36,
  padding: '7px 12px',
  border: `1px solid ${tok.textPrimary}`,
  borderRadius: 4,
  background: tok.textPrimary,
  color: tok.bg,
  fontWeight: 600,
  cursor: 'default',
};

const BUTTON_SECONDARY: CSSProperties = {
  ...BUTTON,
  background: tok.bg,
  color: tok.textPrimary,
  borderColor: tok.borderStrong,
};

function FieldGrid({ section }: { section: AzureFormSection }) {
  const columns = section.layout === 'one' ? '1fr' : section.layout === 'three' ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 12 }}>
      {section.controls.map((control) => (
        <Control key={control.id} control={control} />
      ))}
    </div>
  );
}

function Control({ control }: { control: AzureFormControl }) {
  if (control.kind === 'text') {
    return (
      <label>
        <span style={LABEL}>{control.label}</span>
        <input style={INPUT} defaultValue={control.value} />
      </label>
    );
  }

  if (control.kind === 'select') {
    return (
      <label>
        <span style={LABEL}>{control.label}</span>
        <select style={INPUT} defaultValue={control.options[0]}>
          {control.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  if (control.kind === 'textarea') {
    return (
      <label>
        <span style={LABEL}>{control.label}</span>
        <textarea style={{ ...INPUT, minHeight: 88, resize: 'vertical' }} defaultValue={control.value} />
      </label>
    );
  }

  if (control.kind === 'radio') {
    return (
      <label style={{ ...CHOICE, background: control.checked ? tok.layer02 : tok.bg }}>
        <input type="radio" name={control.name} defaultChecked={control.checked} />
        <span>
          <strong style={{ display: 'block', marginBottom: 3 }}>{control.label}</strong>
          <span style={{ color: tok.textSecondary, lineHeight: 1.45 }}>{control.helper}</span>
        </span>
      </label>
    );
  }

  return (
    <label style={CHOICE}>
      <input type="checkbox" defaultChecked={control.checked} />
      <span>
        <strong style={{ display: 'block', marginBottom: 3 }}>{control.label}</strong>
        <span style={{ color: tok.textSecondary, lineHeight: 1.45 }}>{control.helper}</span>
      </span>
    </label>
  );
}

function Section({ section }: { section: AzureFormSection }) {
  return (
    <section style={SECTION}>
      <h3 style={{ margin: 0, fontSize: 16 }}>{section.title}</h3>
      <FieldGrid section={section} />
    </section>
  );
}

function ReviewPanel({ step }: { step: AzureFormStep }) {
  return (
    <aside style={REVIEW_PANEL} aria-label={`${step.code} guidance`}>
      <div>
        <span style={LABEL}>{step.scenario}</span>
        <h3 style={{ margin: 0, fontSize: 18 }}>{step.code} guidance</h3>
      </div>
      <p style={{ margin: 0, color: tok.textSecondary, lineHeight: 1.5 }}>{step.summary}</p>
      <div style={{ border: `1px solid ${tok.border}`, background: tok.bg, padding: 10, borderRadius: 4, color: tok.textSecondary, lineHeight: 1.45 }}>
        Validation guardrail: this section must not trigger Terraform apply, migrate state, or replace HCP Terraform execution.
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {step.guidance.map((item) => (
          <div key={item.label} style={{ borderLeft: `3px solid ${tok.borderStrong}`, paddingLeft: 10 }}>
            <strong style={{ display: 'block', marginBottom: 2 }}>{item.label}</strong>
            <span style={{ color: tok.textSecondary, lineHeight: 1.45 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function TabButton({ step, index, active, onSelect }: { step: AzureFormStep; index: number; active: boolean; onSelect: (index: number) => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls="azure-terraform-tabpanel"
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(index)}
      style={{
        minHeight: 70,
        border: 'none',
        borderRight: `1px solid ${tok.border}`,
        borderBottom: active ? `3px solid ${tok.textPrimary}` : '3px solid transparent',
        background: active ? tok.bg : 'transparent',
        color: active ? tok.textPrimary : tok.textSecondary,
        textAlign: 'left',
        padding: '10px 12px',
        cursor: 'default',
      }}
    >
      <span style={{ ...LABEL, color: active ? tok.textPrimary : tok.textPlaceholder, marginBottom: 4 }}>{step.code}</span>
      <span style={{ display: 'block', fontWeight: 600, lineHeight: 1.25 }}>{step.title}</span>
    </button>
  );
}

export function AzureTerraformTabbedFormWireframe() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = azureTerraformSteps[activeIndex];
  const progress = ((activeIndex + 1) / azureTerraformSteps.length) * 100;

  return (
    <div style={SHELL}>
      <header style={TOPBAR}>
        <div style={BRAND}>
          <span style={BRAND_MARK}>A</span>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 17, lineHeight: 1.2 }}>Azure Terraform RP onboarding form</h1>
            <p style={{ margin: '2px 0 0', color: tok.textSecondary, lineHeight: 1.35 }}>Tabbed sections from the approved Scenario A and Scenario B journey.</p>
          </div>
        </div>
        <div style={BADGE_ROW} aria-label="Form status">
          <span style={BADGE}>10 sections</span>
          <span style={BADGE}>No apply triggered</span>
          <span style={BADGE}>HCP execution retained</span>
        </div>
      </header>

      <main style={MAIN}>
        <section style={CARD} aria-label="Tabbed onboarding form">
          <div style={TABLIST} role="tablist" aria-label="Journey steps">
            {azureTerraformSteps.map((step, index) => (
              <TabButton key={step.code} step={step} index={index} active={index === activeIndex} onSelect={setActiveIndex} />
            ))}
          </div>

          <div id="azure-terraform-tabpanel" role="tabpanel" style={FORM_PANEL}>
            <div aria-label="Form progress">
              <strong style={LABEL}>Section {activeIndex + 1} of {azureTerraformSteps.length}</strong>
              <div style={PROGRESS_TRACK} aria-hidden="true">
                <div style={{ height: '100%', width: `${progress}%`, background: tok.textPrimary }} />
              </div>
            </div>

            <div style={FORM_HEAD}>
              <div>
                <span style={LABEL}>{activeStep.scenario} / {activeStep.code}</span>
                <h2 style={{ margin: '0 0 6px', fontSize: 22, lineHeight: 1.2 }}>{activeStep.title}</h2>
                <p style={{ margin: 0, color: tok.textSecondary, lineHeight: 1.5, maxWidth: 760 }}>{activeStep.summary}</p>
              </div>
              <span style={{ ...BADGE, background: tok.layer01, color: tok.textPrimary }}>{activeStep.status}</span>
            </div>

            <div style={BODY_GRID}>
              <form style={FORM_STACK} aria-label={activeStep.title}>
                {activeStep.sections.map((section) => (
                  <Section key={section.title} section={section} />
                ))}
                <div style={ACTIONS}>
                  <button
                    type="button"
                    style={{ ...BUTTON_SECONDARY, opacity: activeIndex === 0 ? 0.45 : 1 }}
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                  >
                    Previous section
                  </button>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button type="button" style={BUTTON_SECONDARY}>Save draft</button>
                    <button type="button" style={BUTTON} onClick={() => setActiveIndex(Math.min(azureTerraformSteps.length - 1, activeIndex + 1))}>
                      {activeStep.primaryAction}
                    </button>
                  </div>
                </div>
              </form>
              <ReviewPanel step={activeStep} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const meta: Meta = {
  title: 'Wireframes/Azure Terraform RP/Tabbed Form',
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