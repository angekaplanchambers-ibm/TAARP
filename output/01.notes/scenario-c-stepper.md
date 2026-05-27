# Scenario C - New to Both Terraform and Azure Governance

**Who this is for:** Someone setting up Terraform and Azure governance together for the first time. They may have some Azure familiarity but no existing Terraform footprint. The flow is educational and uses a guided orientation pattern.

---

## Step 1: Get Started

**Goal:** Orient the operator to what they are about to set up and create their HCP Terraform organization in the same step. Progress should feel immediate.

### Orientation list
- "Connect Azure and Terraform in one guided setup"
- "No prior Terraform experience required"
- "Your infrastructure stays in Azure. Terraform adds management structure."
- "You can always adjust settings after setup."

### Simplified HCP Terraform account creation (inline, fewer fields than Scenario B)
- Organization name: text input (e.g. "my-company")
- HCP Account email: text input

No tier picker, no teammate invite - those are surfaced after setup is complete.

**Primary action:** Create account and continue

---

## Step 2: Create Your First Workspace

**Goal:** Configure the first Terraform workspace. Kept to minimal required fields. No discovery, no table of resources - single form for one workspace.

### Form fields
- Workspace name: text input (e.g. "my-first-workspace")
- Azure subscription: dropdown (populated from Azure session context)
- Region: dropdown (populated from Azure session context)

### Starter template (radio, shown below the main fields)
- Blank workspace (start empty, add resources manually)
- Web app (App Service + SQL) - includes common web app resource types
- Kubernetes (AKS) - includes AKS cluster, node pools, networking
- Storage (Blob, Queue, Table) - includes Azure storage account resources

The starter template pre-populates the workspace configuration after creation.

**Primary action:** Create workspace

---

## Step 3: Configure Azure

**Goal:** Connect the workspace to Azure and add basic governance controls. Simplified to the minimum required for first-time success.

### Azure connection
- Select subscription: pre-populated from session, editable
- Authorize Azure to connect to this workspace: Authorize button

### Governance (simplified from B, no checkboxes - just toggles)
- Azure Policy enabled: Toggle (on by default)
- Cost signals: Toggle (on by default)

Note: "You can add more governance controls from the Azure Terraform settings page after setup."

**Primary action:** Connect

---

## Step 4: Review and Connect

**Goal:** One review screen before the final apply. Operator confirms their organization, workspace, and settings before anything is registered.

### Summary table
Columns: Setting, Value

Rows:
- Organization: value from Step 1
- Workspace name: value from Step 2
- Subscription: value from Step 2
- Region: value from Step 2
- Starter template: value from Step 2
- Azure Policy: Enabled / Disabled
- Cost signals: Enabled / Disabled

Note: "Nothing is created in Azure until you click Connect."

**Primary action:** Connect

---

## Step 5: You're Set Up

**Goal:** Celebrate completion and give the operator a clear next-steps launchpad. No ambiguity about what was created or what to do next.

### Summary (concise)
- One organization created in HCP Terraform
- One workspace connected to Azure
- Governance controls active

### Next steps (arrow-link rows)
- Open your workspace in HCP Terraform
- Browse the Terraform Registry for Azure modules
- Invite your teammates to HCP Terraform
- Explore Azure resource management

**Primary action:** Done (closes modal or redirects to Azure portal)

---

## Notes

- No ARM resource picker, no workspace mapping table - C is a singular-workspace flow
- Tier picker and teammate invites are intentionally deferred to post-onboarding
- The starter template picker is the main complexity in Step 2 - all other fields are simple
- Governance controls are binary toggles in C vs. itemized checkboxes in A and B
- The final screen is a launchpad, not a static confirmation - it pushes the operator toward the next real action
