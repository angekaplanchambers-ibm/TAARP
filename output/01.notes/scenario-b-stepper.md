# Scenario B - Azure User, New to Terraform

**Who this is for:** Someone who has managed Azure infrastructure via the portal (ARM) for some time and wants to bring in Terraform for better management and governance. They have no existing HCP Terraform account.

---

## Step 1: Connect to HCP Terraform

**Goal:** Route the operator to the right account path before any org or resource work begins. Progressive disclosure keeps the form short - only the relevant fields appear based on the operator's answer.

### Entry question
"Do you have an HCP Terraform account?"
- Radio: No - create one now (default)
- Radio: Yes - I already have one

### Branch A: No account (create new)
Shown when "No" is selected:
- Organization name: text input (e.g. "my-company-infra")
- Plan tier: Free (default) / Plus / Enterprise
- Invite teammates: optional email field (email or AAD group lookup)
- Authorize Azure section: "Allow Azure to connect to your new HCP Terraform organization." + Authorize button; states: idle / authorizing / authorized

### Branch B: Existing account
Shown when "Yes" is selected:
- Work email: text input (e.g. "you@company.com")
- After email entry with a recognized corporate domain: SSO path shown
  - "Your organization uses company SSO. You'll be redirected to your identity provider."
  - "Sign in with company SSO" button; states: idle / signing-in ("Redirecting to identity provider...") / signed-in (green "Signed in. Select an organization to continue.")
- After email entry with no SSO domain detected: standard path shown
  - Organization name: text input (e.g. "platform-prod")
  - Authorize Azure button; same states as Branch A

**Primary action:** Next (enabled after completing whichever branch is active)

---

## Step 2: Select Azure Resources

**Goal:** Browse the operator's existing Azure ARM inventory and select which resource groups to bring under Terraform management. The operator controls which resources are included.

### Azure Resource Groups table
Columns: checkbox, Resource group name, Subscription, Resources (count), Location

All resource groups in scope are listed. Operator uses checkboxes to select which ones to include. A "select all" checkbox is available.

No HCP Terraform query happens at this step - selection drives workspace creation in the next step.

**Primary action:** Next (enabled when at least one resource group is selected)

---

## Step 3: Map to Workspaces

**Goal:** Each selected resource group becomes a Terraform workspace. The operator assigns workspace names, environments, and owners before registration.

### Workspace configuration (two-column grid, one row per selected resource group)
For each resource group:
- Workspace name: text input (pre-filled from resource group name, e.g. "networking-prod")
- Environment: Production / Test / Development (or Shared infrastructure for shared resource groups)
- Owner: text input (e.g. "Network Platform Team")
- Execution mode: Remote (HCP Terraform) / Local

**Primary action:** Validate mappings

---

## Step 4: Register Resources

**Goal:** Create Azure RP resources that represent the newly created Terraform workspaces, linking each record to HCP Terraform and the operator's Azure subscriptions.

### Registration preview (table)
Each workspace is shown with its corresponding Microsoft.Terraform/stacks entry, resource count, and subscription. Operator reviews before confirming.

**Primary action:** Register resources

---

## Step 5: Confirm

**Goal:** Show the operator that their Azure resources are now under Terraform management. The tone is accomplishment - something was set up, not just connected.

### Summary table
Columns: Resource group, Workspace name, Resources (count), Subscription

### What happens next (checklist)
- Terraform workspaces created - one workspace per selected resource group, registered in your HCP Terraform organization
- Resources visible in Azure portal - connected stacks appear in your Azure Terraform resource view

Note: No state migration required - Terraform will import the current state of these resources.

**Primary action:** Finish setup

---

## Notes

- No existing HCP Terraform account is required to start this flow
- The default connection choice is "Create new org" (opposite of Scenario A)
- Teammate invitations are available but optional - this is not a solo-only flow
- Governance is surfaced prominently as the primary outcome, not an optional add-on
- The import step is implied (resources are imported into Terraform state) but not surfaced as a manual step
