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
    };

export interface AzureFormSection {
  title: string;
  layout?: 'one' | 'two' | 'three';
  controls: AzureFormControl[];
}

export interface AzureFormStep {
  code: string;
  scenario: 'Scenario A' | 'Scenario B';
  title: string;
  status: string;
  summary: string;
  primaryAction: string;
  sections: AzureFormSection[];
  guidance: Array<{
    label: string;
    value: string;
  }>;
}

export const azureTerraformSteps: AzureFormStep[] = [
  {
    code: 'A1',
    scenario: 'Scenario A',
    title: 'Initial Setup in Azure Portal',
    status: 'Ready for input',
    summary: 'Set expectations before the operator connects anything. Azure adds visibility and governance while HCP Terraform remains the control plane.',
    primaryAction: 'Save setup expectations',
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
    guidance: [
      { label: 'User question', value: 'Is this greenfield only, or can I connect what I already have?' },
      { label: 'Required signal', value: 'Show "existing Terraform" before the primary action.' },
      { label: 'Next tab', value: 'Establish trust with HCP Terraform connection.' },
    ],
  },
  {
    code: 'A2',
    scenario: 'Scenario A',
    title: 'Connect to HCP Terraform',
    status: 'Requires identity',
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
    guidance: [
      { label: 'Permission gate', value: 'Do not let discovery start until org admin or onboarding permission is verified.' },
      { label: 'Recovery', value: 'If permission fails, explain which HCP role is needed.' },
      { label: 'Trust cue', value: 'Show the selected org name immediately after OAuth returns.' },
    ],
  },
  {
    code: 'A3',
    scenario: 'Scenario A',
    title: 'Choose Onboarding Mode',
    status: 'Decision required',
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
    guidance: [
      { label: 'Design pattern', value: 'Use radio selection because this is a path decision.' },
      { label: 'Avoid', value: 'Do not make import look equivalent to the existing workspace path.' },
      { label: 'Copy requirement', value: 'Use "existing workspaces" directly.' },
    ],
  },
  {
    code: 'A4',
    scenario: 'Scenario A',
    title: 'Discover Existing Terraform Workspaces',
    status: 'Selection in progress',
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
    guidance: [
      { label: 'Evidence needed', value: 'Provider, subscription hint, execution mode, and run health must be visible.' },
      { label: 'Selection rule', value: 'Low-confidence local execution should be skippable without blocking the flow.' },
      { label: 'Next tab', value: 'Map selected workspaces to Azure scope.' },
    ],
  },
  {
    code: 'A5',
    scenario: 'Scenario A',
    title: 'Map Workspaces to Azure Scope',
    status: 'Mapping required',
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
    guidance: [
      { label: 'Validation', value: 'Block continuation if a target subscription is not allowed.' },
      { label: 'Identity outcome', value: 'Managed identity and OIDC trust are configured behind the scenes after validation.' },
      { label: 'Secret handling', value: 'Service principals and secrets should be eliminated from the target flow.' },
    ],
  },
  {
    code: 'A6',
    scenario: 'Scenario A',
    title: 'Verify State and Resource Ownership',
    status: 'Non-destructive validation',
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
    guidance: [
      { label: 'Trust copy', value: 'Say "No changes applied" in the main section.' },
      { label: 'Mismatch handling', value: 'Treat minor mismatches as review items, not catastrophic failure.' },
      { label: 'Gate', value: 'The operator must understand what Azure verified before governance is enabled.' },
    ],
  },
  {
    code: 'A7',
    scenario: 'Scenario A',
    title: 'Enable Azure Governance',
    status: 'Optional controls',
    summary: 'Let the operator opt into Azure-side controls that wrap existing Terraform workflows without replacing Sentinel or HCP Terraform policy.',
    primaryAction: 'Save governance selection',
    sections: [
      {
        title: 'Governance controls',
        controls: [
          { kind: 'checkbox', id: 'policy-evaluation', label: 'Azure Policy evaluation before runs', helper: 'Evaluate high-risk changes before production applies proceed.', checked: true },
          { kind: 'checkbox', id: 'approval-requirements', label: 'Approval requirements', helper: 'Require Azure-side approval for production applies.', checked: true },
          { kind: 'checkbox', id: 'region-limits', label: 'Region and SKU limits', helper: 'Block disallowed regions or unsupported service tiers.' },
          { kind: 'checkbox', id: 'cost-signals', label: 'Cost signals', helper: 'Show cost warnings before unexpected expansion completes.', checked: true },
        ],
      },
      {
        title: 'Control boundaries',
        layout: 'one',
        controls: [
          { kind: 'textarea', id: 'governance-boundary', label: 'Boundary note', value: 'Azure governance wraps connected Terraform workspaces. Existing Sentinel and HCP Terraform policies remain intact.' },
        ],
      },
    ],
    guidance: [
      { label: 'Value moment', value: 'This is the first tangible Azure-only value in the flow.' },
      { label: 'Optionality', value: 'Recommended controls can be emphasized but should not feel forced.' },
      { label: 'Boundary', value: 'Azure wraps, HCP Terraform executes.' },
    ],
  },
  {
    code: 'A8',
    scenario: 'Scenario A',
    title: 'Register Terraform Workspaces as Azure Resources',
    status: 'Registration output',
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
    guidance: [
      { label: 'Connected moment', value: 'Make the new Azure resource records visible before finishing.' },
      { label: 'Attribution', value: 'The registration enables Azure awareness, auditing, support, and visibility.' },
      { label: 'Execution boundary', value: 'Do not move Terraform functionality into Azure.' },
    ],
  },
  {
    code: 'A9',
    scenario: 'Scenario A',
    title: 'Confirm and Finish',
    status: 'Ready to finish',
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
    guidance: [
      { label: 'Finish rule', value: 'The confirmation must show actual connected outcomes.' },
      { label: 'Do not imply', value: 'No Terraform apply happened unless the user explicitly asks.' },
      { label: 'Next tab', value: 'Operate connected stacks from Azure and HCP Terraform.' },
    ],
  },
  {
    code: 'B1',
    scenario: 'Scenario B',
    title: 'Operate After Setup Confirmation',
    status: 'Steady state',
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
    guidance: [
      { label: 'Scenario B role', value: 'This is the operating surface after setup confirmation.' },
      { label: 'Azure role', value: 'Visibility, approvals, policy status, run status, and support context.' },
      { label: 'HCP role', value: 'Authoring, plans, applies, and deep debugging continue there.' },
    ],
  },
];