# Azure Portal Layout - ASCII Reference

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [::] ≡  Microsoft Azure   [Upgrade]   🔍  🎨  📋  🔔1  ⚙  ?  💬  user@...  │  <- BLUE TOP NAV BAR
└──────────────────────────────────────────────────────────────────────────────┘

  Home > Oracle AI Database@Azure | Oracle Autonomous AI Database               <- BREADCRUMB

  Create Oracle Autonomous AI Database  ...                              [X]    <- PAGE TITLE + CLOSE

  ─────────────────────────────────────────────────────────────────────────────

  Basics    Configuration    Networking    Maintenance    Consent    Tags    Review + create
  ▔▔▔▔▔▔                                                                        <- TAB NAV (Basics underlined/active)

  ─────────────────────────────────────────────────────────────────────────────

  Project details                                                               <- SECTION HEADING (bold)

  Select the subscription to manage deployed resources and costs. Use resource
  groups like folders to organize and manage all your resources.                <- DESCRIPTION TEXT

  Subscription *  (i)            ┌──────────────────────────────────────────┐
                                  │ Azure subscription 1                   ∨ │   <- DROPDOWN
                                  └──────────────────────────────────────────┘
                                  ✖ Microsoft.BareMetal resource provider not registered
                                  ✖ Microsoft.Compute resource provider not registered
                                  ✖ Microsoft.Network resource provider not registered

  └─ Resource group *  (i)       ┌──────────────────────────────────────────┐
                                  │                                        ∨ │   <- DROPDOWN (empty)
                                  └──────────────────────────────────────────┘
                                    Create new                                   <- INLINE LINK

  ─────────────────────────────────────────────────────────────────────────────

  Instance details                                                               <- SECTION HEADING (bold)

  Name *  (i)                    ┌──────────────────────────────────────────┐
                                  │                                          │   <- TEXT INPUT (empty)
                                  └──────────────────────────────────────────┘

  Region *  (i)                  ┌──────────────────────────────────────────┐
                                  │ (US) East US                           ∨ │   <- DROPDOWN
                                  └──────────────────────────────────────────┘

  [large empty content area]




  ─────────────────────────────────────────────────────────────────────────────
┌──────────────────────────────────────────────────────────────────────────────┐
│  [ Previous ]   [ Next ]   [■ Review + create ]          Give feedback  App  │  <- STICKY BOTTOM BAR
└──────────────────────────────────────────────────────────────────────────────┘
```

## Layout zones

| Zone | Notes |
|---|---|
| Top blue nav bar | Full-width, dark blue (`#0078d4`), Microsoft branding + global controls |
| Breadcrumb | Below nav, single line, muted text |
| Page title | Large bold heading, `...` overflow menu, `X` close top-right |
| Tab nav | Horizontal tabs below title, active tab has blue underline indicator |
| Content area | Left-aligned form, labels ~220px wide, inputs ~420px wide |
| Section headings | Bold, no border, followed by description text |
| Field labels | Left column, `*` for required, `(i)` tooltip icon |
| Inputs/dropdowns | Right column, aligned to ~220px offset |
| Validation errors | Inline below the field, red `✖` icon + link-styled error text |
| Indent indicator | `└─` visual indent for dependent fields (Resource group under Subscription) |
| Bottom button bar | Sticky footer, left-aligned secondary buttons, primary `Review + create` in blue |
