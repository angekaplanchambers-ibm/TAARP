import type { ShowcaseConfig } from '../../src/types';
import { AzureTerraformTabbedFormWireframe } from '@z/wireframes/AzureTerraformTabbedForm.stories';
import tabbedFormHtml from './annotations/tabbed-form.html?raw';

export const config: ShowcaseConfig = {
  title: 'Azure Terraform RP',
  subtitle: 'Approved Scenario A and Scenario B onboarding flow for connecting Azure to HCP Terraform without replacing Terraform execution.',
  outputName: '006.AzureTerraformRP-TabbedForm-Draft02',
  meta: {
    pdr: 'Approved Flows A/B',
    date: '2026-05-14',
  },
  sections: [
    {
      id: 'tabbed-form',
      title: 'Tabbed Onboarding Form',
      subtitle: 'Ten focused sections carry users from Azure tenant context through validation, review, and handoff.',
      stageNumber: 'A-B',
      phase: 'interactive',
      states: {
        'Onboarding Form': AzureTerraformTabbedFormWireframe,
      },
      annotation: tabbedFormHtml,
    },
  ],
};