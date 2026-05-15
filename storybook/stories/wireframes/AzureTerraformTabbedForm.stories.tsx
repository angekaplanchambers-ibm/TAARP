import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { azureTerraformSteps } from './_azure-terraform-fixtures';
import type { AzureFormControl, AzureFormSection, AzureFormStep } from './_azure-terraform-fixtures';

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
    grid-template-columns: repeat(10, minmax(0, 1fr));
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
  gridTemplateRows: 'minmax(0, 1fr)',
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
  gridTemplateRows: 'auto minmax(0, 1fr)',
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

const REVIEW_PANEL: CSSProperties = {
  position: 'sticky',
  top: 0,
  display: 'grid',
  gap: 14,
  padding: 18,
  border: `1px solid ${hds.borderPrimary}`,
  borderRadius: hds.radiusLarge,
  background: hds.surfaceFaint,
};

const ACTIONS: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  paddingTop: 20,
  borderTop: `1px solid ${hds.borderPrimary}`,
};

const BUTTON_SET: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
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

function Alert({ children }: { children: string }) {
  return (
    <div role="status" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 10, border: `1px solid ${hds.warningFaint}`, borderLeft: `4px solid ${hds.warning}`, borderRadius: hds.radiusMedium, background: hds.warningFaint, padding: 12, color: hds.textPrimary, lineHeight: 1.45 }}>
      <strong aria-hidden="true" style={{ color: hds.warning }}>!</strong>
      <span>{children}</span>
    </div>
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

function SectionHeading({ children, count }: { children: string; count: number }) {
  return (
    <div style={SECTION_HEADER}>
      <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3 }}>{children}</h3>
      <Badge>{count} fields</Badge>
    </div>
  );
}

function FieldGrid({ section }: { section: AzureFormSection }) {
  const columns = section.layout === 'one' ? '1fr' : section.layout === 'three' ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))';

  return (
    <div className="azure-terraform-field-grid" style={{ display: 'grid', gridTemplateColumns: columns, gap: hds.space14 }}>
      {section.controls.map((control) => (
        <Control key={control.id} control={control} />
      ))}
    </div>
  );
}

function Control({ control }: { control: AzureFormControl }) {
  if (control.kind === 'text') {
    return (
      <label htmlFor={control.id}>
        <span style={LABEL}>{control.label}</span>
        <input id={control.id} style={INPUT} defaultValue={control.value} />
      </label>
    );
  }

  if (control.kind === 'select') {
    return (
      <label htmlFor={control.id}>
        <span style={LABEL}>{control.label}</span>
        <select id={control.id} style={INPUT} defaultValue={control.options[0]}>
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
        <textarea id={control.id} style={{ ...INPUT, minHeight: 96, resize: 'vertical' }} defaultValue={control.value} />
      </label>
    );
  }

  if (control.kind === 'radio') {
    return (
      <label style={{ ...CHOICE_CARD, borderColor: control.checked ? hds.brand : hds.borderPrimary, background: control.checked ? hds.brandFaint : hds.surfacePrimary }}>
        <input type="radio" name={control.name} defaultChecked={control.checked} />
        <span>
          <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3 }}>{control.label}</strong>
          <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{control.helper}</span>
        </span>
      </label>
    );
  }

  return (
    <label style={CHOICE_CARD}>
      <input type="checkbox" defaultChecked={control.checked} />
      <span>
        <strong style={{ display: 'block', marginBottom: 4, lineHeight: 1.3 }}>{control.label}</strong>
        <span style={{ display: 'block', color: hds.textSecondary, lineHeight: 1.45 }}>{control.helper}</span>
      </span>
    </label>
  );
}

function FormSection({ section }: { section: AzureFormSection }) {
  return (
    <section style={SECTION_CARD} aria-label={section.title}>
      <SectionHeading count={section.controls.length}>{section.title}</SectionHeading>
      <FieldGrid section={section} />
    </section>
  );
}

function ReviewPanel({ step }: { step: AzureFormStep }) {
  return (
    <aside className="azure-terraform-review-panel" style={REVIEW_PANEL} aria-label={`${step.title} guidance`}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Badge tone={step.scenario === 'Scenario B' ? 'success' : 'brand'}>{step.scenario}</Badge>
        <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.25 }}>{step.title} guidance</h3>
      </div>
      <p style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.5 }}>{step.summary}</p>
      <Alert>Validation guardrail: this section must not trigger Terraform apply, migrate state, or replace HCP Terraform execution.</Alert>
      <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
        {step.guidance.map((item) => (
          <div key={item.label} style={{ borderLeft: `3px solid ${hds.brand}`, paddingLeft: 12 }}>
            <dt style={{ margin: '0 0 3px', fontWeight: 700 }}>{item.label}</dt>
            <dd style={{ margin: 0, color: hds.textSecondary, lineHeight: 1.45 }}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
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
  const isInteractive = index <= currentStep;
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
        aria-disabled={!isInteractive || undefined}
        tabIndex={status === 'current' ? 0 : -1}
        onClick={(event) => {
          if (!isInteractive) {
            event.preventDefault();
            return;
          }
          onStepChange(index);
        }}
        onKeyDown={(event) => onKeyDown(event, index)}
        style={{
          ...STEPPER_STEP,
          cursor: isInteractive ? 'pointer' : 'default',
          color: status === 'current' ? hds.textPrimary : hds.textSecondary,
        }}
      >
        <span style={indicatorStyle} aria-hidden="true">{status === 'complete' ? 'OK' : index + 1}</span>
        <span style={{ display: 'grid', gap: 3, minWidth: 0 }}>
          <span style={{ fontWeight: 700, lineHeight: 1.25 }}>{step.title}</span>
          <span style={{ color: hds.textFaint, fontSize: 12, fontWeight: 700 }}>{status === 'current' ? 'Current step' : status === 'complete' ? 'Complete' : 'Not started'}</span>
        </span>
      </button>
    </div>
  );
}

export function AzureTerraformTabbedFormWireframe() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = azureTerraformSteps[activeIndex];
  const progress = ((activeIndex + 1) / azureTerraformSteps.length) * 100;

  function handleStepKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastAvailable = activeIndex;
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

  return (
    <div className="azure-terraform-shell" style={APP_FRAME}>
      <style>{RESPONSIVE_STYLES}</style>
      <a className="azure-terraform-skip-link" href="#azure-terraform-main" style={SKIP_LINK}>Skip to form</a>
      <main className="azure-terraform-main" id="azure-terraform-main" style={MAIN}>
        <section style={PAGE_CARD} aria-label="Stepper onboarding form">
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
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <Badge tone={activeStep.scenario === 'Scenario B' ? 'success' : 'brand'}>{activeStep.scenario}</Badge>
                </div>
                <h2 style={{ margin: '0 0 8px', fontSize: 24, lineHeight: 1.18 }}>{activeStep.title}</h2>
                <p style={{ margin: 0, maxWidth: 780, color: hds.textSecondary, lineHeight: 1.55 }}>{activeStep.summary}</p>
              </div>
              <Badge tone="success">{activeStep.status}</Badge>
            </div>

            <div className="azure-terraform-body-grid" style={BODY_GRID}>
              <form style={FORM_STACK} aria-label={activeStep.title}>
                {activeStep.sections.map((section) => (
                  <FormSection key={section.title} section={section} />
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
                    <Button>Save draft</Button>
                    <Button variant="primary" onClick={() => setActiveIndex(Math.min(azureTerraformSteps.length - 1, activeIndex + 1))}>
                      {activeStep.primaryAction}
                    </Button>
                  </ButtonSet>
                </div>
              </form>
              <ReviewPanel step={activeStep} />
            </div>
          </section>
        </section>
      </main>
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