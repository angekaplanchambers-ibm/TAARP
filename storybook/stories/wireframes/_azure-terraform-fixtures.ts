export type AzureFormControl =
  | {
      kind: 'text';
      id: string;
      label: string;
      value: string;
    }
  | {
      kind: 'select';
      id: string;
      label: string;
      options: string[];
    }
  | {
      kind: 'textarea';
      id: string;
      label: string;
      value: string;
    }
  | {
      kind: 'checkbox';
      id: string;
      label: string;
      helper: string;
      checked?: boolean;
    }
  | {
      kind: 'radio';
      id: string;
      name: string;
      label: string;
      helper: string;
      checked?: boolean;
    }
  | {
      kind: 'link';
      id: string;
      label: string;
      href: string;
      description: string;
    };

export interface AzureFormSection {
  title: string;
  layout?: 'one' | 'two' | 'three';
  controls: AzureFormControl[];
}

export interface AzureFormStep {
  code: string;
  title: string;
  summary: string;
  primaryAction: string;
  sections: AzureFormSection[];
}

const azureTerraformStepSource: AzureFormStep[] = [
  {
    code: 'A1',
    title: 'Connect to HCP TF',
    summary: 'Establish trust between Azure and HCP Terraform before discovery, governance, or workspace registration begins.',
    primaryAction: 'Continue after HCP connection',
    sections: [
      {
        title: 'Entry point',
        controls: [
          { kind: 'text', id: 'portal-search', label: 'Portal search term', value: 'Terraform' },
          { kind: 'select', id: 'resource-filter', label: 'Resource filter', options: ['Resources tag', 'Services', 'Marketplace'] },
          { kind: 'select', id: 'intro-state', label: 'Intro state', options: ['Splash intro visible', 'Returning user summary'] },
          { kind: 'text', id: 'setup-tenant', label: 'Azure tenant', value: 'Azure Commercial tenant' },
        ],
      },
      {
        title: 'Expectation copy',
        controls: [
          { kind: 'checkbox', id: 'hcp-runs', label: 'HCP Terraform runs execution', helper: 'TF runs remain in Hashi-managed control plane.', checked: true },
          { kind: 'checkbox', id: 'azure-governs', label: 'Azure adds governance', helper: 'Discovery, governance, management, and support context are Azure-side additions.', checked: true },
          { kind: 'checkbox', id: 'no-cli', label: 'No Terraform CLI install', helper: 'The operator does not need to install or run Terraform CLI to connect.', checked: true },
          { kind: 'checkbox', id: 'existing-path', label: 'Existing infra path', helper: 'The page clearly says existing Terraform-managed infrastructure is supported.', checked: true },
        ],
      },
    ],
  },
  {
    code: 'A2',
    title: 'Connect to HCP Terraform',
    summary: 'Capture how the operator creates or connects an HCP Terraform organization and verify permission before workspace discovery.',
    primaryAction: 'Verify HCP organization',
    sections: [
      {
        title: 'Connection choice',
        controls: [
          { kind: 'radio', id: 'new-hcp-org', name: 'hcp-choice', label: 'Create a new HCP Terraform organization', helper: 'Use when the operator has no existing HCP Terraform org.' },
          { kind: 'radio', id: 'existing-hcp-org', name: 'hcp-choice', label: 'Connect an existing HCP Terraform organization', helper: 'Use for infrastructure already managed by Terraform.', checked: true },
        ],
      },
      {
        title: 'Organization verification',
        controls: [
          { kind: 'select', id: 'oauth-state', label: 'OAuth / SSO state', options: ['Azure-initiated OAuth verified', 'Waiting for SSO', 'Expired authorization'] },
          { kind: 'text', id: 'hcp-org', label: 'Selected HCP org', value: 'platform-prod' },
          { kind: 'select', id: 'org-role', label: 'Operator permission', options: ['Org admin', 'Onboarding permission', 'Insufficient permission'] },
          { kind: 'text', id: 'workspace-count', label: 'Detected workspaces', value: '42' },
        ],
      },
    ],
  },
  {
    code: 'A3',
    title: 'Choose Onboarding Mode',
    summary: 'Make the existing-workspace path the selected and honest path. Import remains visible as future or limited scope.',
    primaryAction: 'Continue with existing workspaces',
    sections: [
      {
        title: 'Onboarding mode',
        controls: [
          { kind: 'radio', id: 'connect-existing', name: 'onboarding-mode', label: 'Connect existing workspaces', helper: 'My infrastructure is already managed by Terraform.', checked: true },
          { kind: 'radio', id: 'import-unmanaged', name: 'onboarding-mode', label: 'Import unmanaged Azure resources', helper: 'Future or limited scope. Not the primary flow here.' },
        ],
      },
      {
        title: 'Scope confirmation',
        layout: 'one',
        controls: [
          { kind: 'textarea', id: 'mode-rationale', label: 'Operator rationale', value: 'Infrastructure is already managed by Terraform in HCP Terraform. Azure should discover existing workspaces, validate ownership, and register connected stack resources.' },
        ],
      },
    ],
  },
  {
    code: 'A4',
    title: 'Discover Existing Terraform Workspaces',
    summary: 'Query HCP Terraform for AzureRM workspaces, subscription hints, execution mode, and run health. The form lets the operator select eligible workspaces.',
    primaryAction: 'Add selected workspaces',
    sections: [
      {
        title: 'Discovery filters',
        layout: 'three',
        controls: [
          { kind: 'select', id: 'provider-filter', label: 'Provider', options: ['AzureRM provider', 'Any provider'] },
          { kind: 'select', id: 'execution-filter', label: 'Execution mode', options: ['Remote preferred', 'Remote and local'] },
          { kind: 'select', id: 'health-filter', label: 'Run health', options: ['Healthy and review', 'Healthy only', 'All workspaces'] },
        ],
      },
      {
        title: 'Workspace candidates',
        controls: [
          { kind: 'checkbox', id: 'network-prod-core', label: 'network-prod-core', helper: 'infra/network-core - Prod Networking - Remote execution, healthy run', checked: true },
          { kind: 'checkbox', id: 'identity-shared', label: 'identity-shared', helper: 'infra/identity - Shared Services - Remote execution, review status', checked: true },
          { kind: 'checkbox', id: 'partner-sandbox-east', label: 'partner-sandbox-east', helper: 'partner/sandbox - Unknown subscription - Local execution, low confidence' },
        ],
      },
    ],
  },
  {
    code: 'A5',
    title: 'Map Workspaces to Azure Scope',
    summary: 'Collect subscription, management group, environment, and owner metadata for each selected workspace before Azure configures identity and trust.',
    primaryAction: 'Validate mappings',
    sections: [
      {
        title: 'network-prod-core',
        controls: [
          { kind: 'text', id: 'network-sub', label: 'Subscription or management group', value: 'Prod Networking Subscription' },
          { kind: 'select', id: 'network-env', label: 'Environment', options: ['Production', 'Test', 'Development'] },
          { kind: 'text', id: 'network-owner', label: 'Owner', value: 'Network Platform Team' },
          { kind: 'text', id: 'network-identity', label: 'Managed identity', value: 'azure-tf-rp-network-prod' },
        ],
      },
      {
        title: 'identity-shared',
        controls: [
          { kind: 'text', id: 'identity-sub', label: 'Subscription or management group', value: 'Shared Services Subscription' },
          { kind: 'select', id: 'identity-env', label: 'Environment', options: ['Shared infrastructure', 'Production', 'Test'] },
          { kind: 'text', id: 'identity-owner', label: 'Owner', value: 'Identity Services Team' },
          { kind: 'select', id: 'oidc-state', label: 'OIDC trust', options: ['Ready to configure', 'Configured', 'Needs review'] },
        ],
      },
    ],
  },
  {
    code: 'A6',
    title: 'Verify State and Resource Ownership',
    summary: 'Confirm Terraform state health, Azure resource IDs, and subscription alignment without applying changes or migrating state.',
    primaryAction: 'Accept validation results',
    sections: [
      {
        title: 'Validation checks',
        controls: [
          { kind: 'checkbox', id: 'state-exists', label: 'Terraform state exists', helper: 'State backend and lineage are readable.', checked: true },
          { kind: 'checkbox', id: 'state-healthy', label: 'State is healthy', helper: 'Latest state snapshot is usable for resource attribution.', checked: true },
          { kind: 'checkbox', id: 'resource-ids-match', label: 'Azure resource IDs match', helper: 'Resources in state map to selected Azure scopes.', checked: true },
          { kind: 'checkbox', id: 'no-apply-validation', label: 'No apply triggered', helper: 'Validation is read-only and non-destructive.', checked: true },
        ],
      },
      {
        title: 'Ownership summary',
        layout: 'three',
        controls: [
          { kind: 'text', id: 'resource-count', label: 'Governed resources', value: '34' },
          { kind: 'text', id: 'mismatch-count', label: 'Mismatches', value: '1 tag mismatch' },
          { kind: 'text', id: 'state-migration', label: 'State migration', value: 'Not required' },
        ],
      },
    ],
  },
  {
    code: 'A8',
    title: 'Register Terraform Workspaces as Azure Resources',
    summary: 'Create Azure RP resources that represent Terraform stacks and environments, linking each record to HCP Terraform and Azure subscription context.',
    primaryAction: 'Register connected resources',
    sections: [
      {
        title: 'Resource registration',
        controls: [
          { kind: 'text', id: 'stack-resource', label: 'Stack resource type', value: 'Microsoft.Terraform/stacks' },
          { kind: 'text', id: 'env-resource', label: 'Environment resource type', value: 'Microsoft.Terraform/environments' },
          { kind: 'select', id: 'repo-metadata', label: 'Repo metadata', options: ['Attach repo metadata', 'Do not attach repo metadata'] },
          { kind: 'select', id: 'deep-links', label: 'HCP deep links', options: ['Create deep links', 'Skip deep links'] },
        ],
      },
      {
        title: 'Registration preview',
        controls: [
          { kind: 'checkbox', id: 'register-network', label: 'Microsoft.Terraform/stacks/network-prod-core', helper: 'HCP workspace network-prod-core - Prod Networking - Ready', checked: true },
          { kind: 'checkbox', id: 'register-identity', label: 'Microsoft.Terraform/stacks/identity-shared', helper: 'HCP workspace identity-shared - Shared Services - Ready', checked: true },
        ],
      },
    ],
  },
  {
    code: 'A9',
    title: 'Confirm and Finish',
    summary: 'Confirm that existing Terraform infrastructure is connected to Azure and show what the operator can now see without implying any hidden apply.',
    primaryAction: 'Finish onboarding',
    sections: [
      {
        title: 'Finish confirmation',
        controls: [
          { kind: 'text', id: 'finish-message', label: 'Confirmation message', value: 'Existing Terraform infrastructure is now connected to Azure' },
          { kind: 'text', id: 'apply-status', label: 'Terraform apply status', value: 'No apply triggered' },
          { kind: 'select', id: 'status-view', label: 'Azure status view', options: ['Show last run status', 'Show setup summary'] },
          { kind: 'text', id: 'handoff-link', label: 'Deep action destination', value: 'Open HCP Terraform workspace' },
        ],
      },
      {
        title: 'Visible outcomes',
        controls: [
          { kind: 'checkbox', id: 'portal-stacks', label: 'Terraform stacks in Portal', helper: 'Connected resources appear in Azure inventory.', checked: true },
          { kind: 'checkbox', id: 'owner-metadata', label: 'Ownership metadata', helper: 'Teams and subscriptions are attached.', checked: true },
          { kind: 'checkbox', id: 'run-status', label: 'Run status', helper: 'Azure can show last known run status.', checked: true },
          { kind: 'checkbox', id: 'hcp-links', label: 'HCP links', helper: 'Deep debugging stays in HCP Terraform.', checked: true },
        ],
      },
    ],
  },
  {
    code: 'B1',
    title: 'Operate After Setup Confirmation',
    summary: 'Show what the operator can do after setup: view Terraform-managed infrastructure in Azure, approve or block future applies, inspect policy and run status, and hand support context to Microsoft.',
    primaryAction: 'Save operating defaults',
    sections: [
      {
        title: 'Azure-side actions',
        controls: [
          { kind: 'checkbox', id: 'view-infra', label: 'View Terraform-managed infrastructure', helper: 'Group connected stacks by subscription and owner.', checked: true },
          { kind: 'checkbox', id: 'approve-applies', label: 'Approve or block future applies', helper: 'Use Azure governance controls for production changes.', checked: true },
          { kind: 'checkbox', id: 'policy-run-status', label: 'See policy and run status', helper: 'Surface Azure policy posture and HCP Terraform run state.', checked: true },
          { kind: 'checkbox', id: 'support-context', label: 'Hand issues to Microsoft support', helper: 'Attach stack context, subscription, owner, and run metadata.', checked: true },
        ],
      },
      {
        title: 'HCP Terraform continuity',
        layout: 'one',
        controls: [
          { kind: 'textarea', id: 'hcp-continuity', label: 'Preserved workflows', value: 'Teams continue authoring modules and configs, running plans and applies, and debugging deeply in HCP Terraform. Azure adds visibility, governance, approvals, and support context without breaking existing workflows.' },
        ],
      },
    ],
  },
];

export const azureTerraformSteps: AzureFormStep[] = [
  azureTerraformStepSource[0],
  {
    ...azureTerraformStepSource[3],
    title: 'Workspaces',
  },
  {
    ...azureTerraformStepSource[4],
    title: 'Map Workspaces',
  },
  {
    ...azureTerraformStepSource[6],
    title: 'Review & Register',
  },
];

// ---------------------------------------------------------------------------
// Scenario B: Azure-experienced, Terraform novice
// "I manage Azure resources and want to start using Terraform for governance"
// ---------------------------------------------------------------------------

export const azureTerraformStepsB: AzureFormStep[] = [
  {
    code: 'B1',
    title: 'Connect to HCP Terraform',
    summary: 'Create a new HCP Terraform organization. Your existing Azure resources stay where they are - Terraform adds management and governance on top.',
    primaryAction: 'Create organization',
    sections: [],
  },
  {
    code: 'B2',
    title: 'Select Azure Resources',
    summary: 'Choose the Azure resource groups you want to bring under Terraform management. You control which resources are included.',
    primaryAction: 'Continue with selected resources',
    sections: [],
  },
  {
    code: 'B3',
    title: 'Map to Workspaces',
    summary: 'Each selected resource group will become a Terraform workspace. Assign names, environments, and owners before registration.',
    primaryAction: 'Validate mappings',
    sections: [
      {
        title: 'Workspace configuration',
        layout: 'two',
        controls: [
          { kind: 'text', id: 'b-rg-1-workspace', label: 'rg-networking-prod - Workspace name', value: 'networking-prod' },
          { kind: 'select', id: 'b-rg-1-env', label: 'rg-networking-prod - Environment', options: ['Production', 'Test', 'Development'] },
          { kind: 'text', id: 'b-rg-1-owner', label: 'rg-networking-prod - Owner', value: 'Network Platform Team' },
          { kind: 'select', id: 'b-rg-1-exec', label: 'rg-networking-prod - Execution mode', options: ['Remote (HCP Terraform)', 'Local'] },
          { kind: 'text', id: 'b-rg-2-workspace', label: 'rg-identity-shared - Workspace name', value: 'identity-shared' },
          { kind: 'select', id: 'b-rg-2-env', label: 'rg-identity-shared - Environment', options: ['Shared infrastructure', 'Production', 'Test'] },
          { kind: 'text', id: 'b-rg-2-owner', label: 'rg-identity-shared - Owner', value: 'Identity Services Team' },
          { kind: 'select', id: 'b-rg-2-exec', label: 'rg-identity-shared - Execution mode', options: ['Remote (HCP Terraform)', 'Local'] },
        ],
      },
    ],
  },
  {
    code: 'B5',
    title: 'Register Resources',
    summary: 'Create Azure RP resources that represent your Terraform workspaces, linking each record to HCP Terraform and your Azure subscriptions.',
    primaryAction: 'Register resources',
    sections: [],
  },
  {
    code: 'B6',
    title: 'Confirm',
    summary: 'Your Azure resources are now under Terraform management. Review what was set up.',
    primaryAction: 'Finish setup',
    sections: [],
  },
];

// ---------------------------------------------------------------------------
// Scenario C: New to both Terraform and Azure
// "I'm new to both and want to connect Azure and Terraform for the first time"
// ---------------------------------------------------------------------------

export const azureTerraformStepsC: AzureFormStep[] = [
  {
    code: 'C1',
    title: 'Get Started',
    summary: 'Create your HCP Terraform organization and connect it to Azure. This takes about 5 minutes.',
    primaryAction: 'Create organization',
    sections: [],
  },
  {
    code: 'C2',
    title: 'Create Your First Workspace',
    summary: 'A workspace is where your Terraform configuration and state live. Start with one resource group or subscription.',
    primaryAction: 'Create workspace',
    sections: [],
  },
  {
    code: 'C3',
    title: 'Configure Azure',
    summary: 'Set up the credentials and permissions Terraform needs to manage Azure resources.',
    primaryAction: 'Save configuration',
    sections: [
      {
        title: 'Azure credentials',
        controls: [
          { kind: 'select', id: 'c-auth-method', label: 'Authentication method', options: ['OIDC (recommended)', 'Service principal', 'Managed identity'] },
          { kind: 'text', id: 'c-subscription', label: 'Target subscription', value: 'My Azure Subscription' },
          { kind: 'select', id: 'c-permission-scope', label: 'Permission scope', options: ['Subscription level', 'Resource group level', 'Management group level'] },
        ],
      },
      {
        title: 'What Terraform will use',
        layout: 'one',
        controls: [
          { kind: 'textarea', id: 'c-provider-note', label: 'Provider block (auto-generated)', value: 'provider "azurerm" {\n  features {}\n  subscription_id = "<your-subscription-id>"\n}' },
        ],
      },
    ],
  },
  {
    code: 'C4',
    title: 'Review & Connect',
    summary: 'Review your setup before connecting. Terraform will read your Azure subscription without making any changes.',
    primaryAction: 'Connect',
    sections: [
      {
        title: 'Setup summary',
        controls: [
          { kind: 'checkbox', id: 'c-org-ready', label: 'HCP Terraform organization created', helper: 'Your org is ready to manage infrastructure.', checked: true },
          { kind: 'checkbox', id: 'c-workspace-ready', label: 'First workspace configured', helper: 'Workspace name, subscription, and region are set.', checked: true },
          { kind: 'checkbox', id: 'c-credentials-set', label: 'Azure credentials configured', helper: 'OIDC connection is authorized.', checked: true },
          { kind: 'checkbox', id: 'c-no-changes', label: 'No changes made yet', helper: 'Connect is read-only. You run your first plan from HCP Terraform.', checked: true },
        ],
      },
    ],
  },
  {
    code: 'C5',
    title: "You're Set Up",
    summary: "Your first Terraform workspace is connected to Azure. Here's where to go next.",
    primaryAction: 'Open HCP Terraform',
    sections: [
      {
        title: "Next steps",
        controls: [
          { kind: 'link', id: 'c-open-hcp', label: 'Open your workspace in HCP Terraform', href: '#', description: 'View your workspace, write your first configuration, and run a plan.' },
          { kind: 'link', id: 'c-run-plan', label: 'Run your first plan', href: '#', description: 'A plan shows what Terraform would create or change without applying anything.' },
          { kind: 'link', id: 'c-explore-azure', label: 'Explore the Azure Terraform resource view', href: '#', description: 'See your connected workspace in the Azure portal.' },
          { kind: 'link', id: 'c-docs', label: 'Read the getting started guide', href: '#', description: 'Step-by-step docs for managing Azure infrastructure with Terraform.' },
        ],
      },
    ],
  },
];