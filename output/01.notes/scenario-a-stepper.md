# Scenario A - Existing Terraform User

**Who this is for:** Someone already using Terraform and HCP Terraform who wants to see and govern their infrastructure from the Azure portal without changing their existing workflows.

---

## Step 1: Connect to HCP Terraform

**Goal:** Establish trust between Azure and an existing HCP Terraform organization before discovery, governance, or workspace registration begins.

### Entry point
- Operator arrives via Azure portal search ("Terraform") or the Marketplace
- Intro state: splash intro for new users, or returning user summary if they have been here before
- Azure tenant is pre-populated from session context

### Expectation copy (checklist shown before the operator proceeds)
- HCP Terraform runs execution - TF runs remain in Hashi-managed control plane
- Azure adds governance - discovery, governance, management, and support context are Azure-side additions
- No Terraform CLI install required - the operator does not need to install or run Terraform CLI to connect
- Existing infra path - the page clearly says existing Terraform-managed infrastructure is supported

**Primary action:** Continue after HCP connection

---

## Step 2: Connect HCP Terraform Organization

**Goal:** Verify the operator has an active HCP Terraform session, then select the org and authorize Azure. The step uses a gate pattern - organization selection and Azure authorization are locked until HCP sign-in is confirmed.

### Mode 1 - No active HCP session (default entry state)
- "Sign in to HCP Terraform" button is the only action available
- Organization dropdown is present but disabled; a note reads "Sign in to unlock organization selection"
- After clicking Sign in: button shows "Signing in...", status reads "Redirecting to identity provider..."
- After sign-in completes: identity chip appears (avatar initial + "Signed in as angela@company.com"), organization dropdown unlocks

### Mode 2 - Active HCP session
- Identity chip shown at the top of the HCP Account section
- Organization dropdown is enabled immediately
- After selecting an org: workspace count status appears below the dropdown

### Authorize Azure (shown after session confirmed + org selected)
- If org has SSO enforced: button reads "Continue with company SSO"; helper text reads "[Org name] requires company SSO. You'll be redirected to your identity provider to complete authorization."
- If standard org: button reads "Authorize Azure"; helper text reads "Allow Azure to query and connect to your HCP Terraform organization. You can revoke this at any time."
- Authorization states: idle / authorizing ("Waiting for authorization...") / authorized (green "Azure is authorized to connect to this organization.")

**Primary action:** Next (enabled after sign-in + org selected + Azure authorized)

---

## Step 3: Workspaces

**Goal:** Query HCP Terraform for AzureRM workspaces and let the operator select which ones to connect.

### Workspace table (checkbox list)
Columns: checkbox, Connected status, Workspace name, Repo number, Subscription, Latest apply status.

All workspaces in the selected organization are listed. Operator uses checkboxes to select which ones to bring into Azure. A "select all" checkbox is available.

**Actions:** Connect Workspaces (marks selected workspaces as "Connected"), then Next (enabled after at least one workspace is connected)

---

## Step 4: Map Workspaces

**Goal:** Collect subscription, management group, environment, and owner metadata for each selected workspace before Azure configures identity and trust.

### Per-workspace mapping (one card per selected workspace)
Each card shows:
- Workspace name and resource count
- Repo number and subscription hint
- Type: Azure subscription / Management group
- Environment: dev / test / prod
- Owner: team / service

### Verification
Operator clicks Verify before advancing. A toast confirms resource count and workspace count that will be governed. No state migration is required.

**Primary action:** Validate mappings, then Next

---

## Step 5: Enable Azure Governance

**Goal:** Let the operator opt into Azure-side controls that wrap existing Terraform workflows without replacing Sentinel or HCP Terraform policy.

### Governance controls (checkboxes)
- Azure Policy evaluation before runs - evaluate high-risk changes before production applies proceed
- Approval requirements - require Azure-side approval for production applies
- Region and SKU limits - block disallowed regions or unsupported service tiers
- Cost signals - show cost warnings before unexpected expansion completes

### Boundary note
Azure governance wraps connected Terraform workspaces. Existing Sentinel and HCP Terraform policies remain intact.

**Primary action:** Save governance selection

---

## Step 6: Register Workspaces in Azure

**Goal:** Create Azure RP resources that represent Terraform stacks and environments, linking each record to HCP Terraform and Azure subscription context.

### Resource registration settings
- Stack resource type: Microsoft.Terraform/stacks
- Environment resource type: Microsoft.Terraform/environments
- Repo metadata: Attach repo metadata / Do not attach
- HCP deep links: Create deep links / Skip deep links

### Registration preview (checkbox list)
Each workspace is shown as a Microsoft.Terraform/stacks entry with its HCP workspace name, subscription, and ready status. Operator confirms which to register.

**Primary action:** Register connected resources

---

## Step 7: Confirm

**Goal:** Confirm that existing Terraform infrastructure is connected to Azure and show what the operator can now see without implying any hidden apply.

### Confirmation message
- "Existing Terraform infrastructure is now connected to Azure"
- "No apply triggered"
- Azure status view: Show last run status / Show setup summary
- Deep action destination: Open HCP Terraform workspace

### Visible outcomes (checklist)
- Terraform stacks in Portal - connected resources appear in Azure inventory
- Ownership metadata - teams and subscriptions are attached
- Run status - Azure can show last known run status
- HCP links - deep debugging stays in HCP Terraform

**Primary action:** Finish onboarding

---

## Notes

- No Terraform apply is triggered at any point in this flow
- State migration is not required
- Existing Sentinel and HCP Terraform policies are preserved
- The operator returns to HCP Terraform for deep debugging and run management
