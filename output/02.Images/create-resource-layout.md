# Azure Portal - Create a Resource Layout Reference

## Full-page ASCII diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [⠿]  [≡]   Microsoft Az...   [⊕ Upg]  🔍 Search resources, services, and docs (G+/)   [>_] [🔔1] [⚙] [?] [💬]  ange.kaplanchambers@...  [👤🔒] │
│                                                                                           │   <- BLUE TOP NAV (#0078d4), 40px tall
└──────────────────────────────────────────────────────────────────────────────────────────┘

  Home                                                                                      <- BREADCRUMB  font-size: 12px, color: #605e5c, padding: 8px 0

  Explore services  ...                                                             [✕]    <- PAGE TITLE + OVERFLOW + CLOSE
  ─────────────────────────────────────                                                     font-size: 28px, font-weight: 600, color: #201f1e
                                                                                            "..." = overflow menu icon (·· ·), gray
                                                                                            [✕] = close button, top-right, 20px, color: #605e5c
  [spacer ~24px]


  Popular services   [Free options available]                                               <- SECTION HEADING
  ────────────────────────────────────────────                                              heading: font-size: 20px, font-weight: 600, color: #201f1e
                                                                                            badge: border: 1px solid #107c10, border-radius: 4px,
                                                                                                   padding: 2px 8px, font-size: 12px, color: #107c10 (green)
                                                                                                   background: white, display: inline, margin-left: 12px

  From hosting and storage to functions and containers, choose the service that             <- DESCRIPTION
  matches your workload and deployment needs.                                                font-size: 14px, color: #605e5c, line-height: 1.5, margin-bottom: 20px

  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐
  │  [🖥]  Virtual machines         │  │  [≡≡] Storage accounts          │  │  [SQL] SQL databases            │
  │                                 │  │                                 │  │                                 │
  │  Build, deploy, and run your    │  │  Store and access files,        │  │  Set up a scalable, secure      │
  │  applications on resilient and  │  │  backups, and unstructured      │  │  relational database in         │
  │  scalable infrastructure.       │  │  data reliably and securely.    │  │  minutes with built-in          │
  │                                 │  │                                 │  │  intelligence.                  │
  └─────────────────────────────────┘  └─────────────────────────────────┘  └─────────────────────────────────┘

  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐
  │  [🌐] Web App                   │  │  [📦] Container Apps            │  │  [⚡] Function App              │
  │                                 │  │                                 │  │                                 │
  │  Easily host and manage         │  │  Run your app in containers     │  │  Build serverless apps that     │
  │  websites and web applications  │  │  with automatic scaling and     │  │  run code on demand without     │
  │  without managing               │  │  built-in microservices         │  │  worrying about servers.        │
  │  infrastructure.                │  │  support.                       │  │                                 │
  └─────────────────────────────────┘  └─────────────────────────────────┘  └─────────────────────────────────┘


  Explore more                                                                              <- SECTION HEADING
  ────────────────                                                                           font-size: 20px, font-weight: 600, color: #201f1e, margin-bottom: 16px

  ┌─────────────────────────────────┐
  │  [≡+] All services              │
  │                                 │
  │  Choose from over 200 services  │
  │  across various categories      │
  │  like compute, databases,       │
  │  analytics, and storage.        │
  └─────────────────────────────────┘


```

---

## Layout zones

| Zone | Spec |
|---|---|
| Top nav bar | Full-width, `#0078d4` blue, 40px tall. Left: waffle grid `[⠿]`, hamburger `[≡]`, "Microsoft Az..." wordmark (white, 13px). Center: Upgrade pill badge (outlined, white text) + search box (dark rounded bar, 480px wide, placeholder text gray). Right: terminal icon, bell with badge `1`, gear, help `?`, feedback, user email + avatar + lock icon. |
| Breadcrumb | Below nav, `Home` in 12px `#605e5c`, no separator needed (single level), 8px top padding, 0 left inset (not indented). |
| Page title | `Explore services` in 28px/600 `#201f1e`. `...` overflow icon immediately right (small, gray `#605e5c`). `✕` close button pinned to the far right edge at same vertical center, 20px, `#605e5c`. Separator line below title is NOT a border - just visual spacing. |
| Section heading | `Popular services` 20px/600 `#201f1e`. Followed inline by `[Free options available]` badge: `1px solid #107c10`, `border-radius: 4px`, `padding: 2px 8px`, `font-size: 12px`, `color: #107c10`, white background. |
| Section description | 14px, `#605e5c`, max-width ~720px, `line-height: 1.5`, `margin-bottom: 20px`. |
| Service cards | 3-column grid, equal width columns, `gap: 16px`. Each card: `border: 1px solid #e1dfdd`, `border-radius: 8px`, `background: #ffffff`, `padding: 20px`, no shadow. Card min-height ~160px. |
| Card icon | 32x32px colored product icon, top-left of card content row. Positioned inline-left of the title. |
| Card title | 16px/600 `#201f1e`, vertically centered with icon. No subtitle. |
| Card description | 14px/400 `#605e5c`, `line-height: 1.5`, below the icon+title row, `margin-top: 12px`. Wraps naturally within card width. |
| Card hover | Not visible in screenshot - expected to add subtle box-shadow or border-color shift. |
| "Explore more" section | Same heading style as "Popular services" (20px/600), no inline badge. |
| "All services" card | Same card style but only 1 card wide (1/3 column width), same padding, icon+title+description pattern. |
| Content area background | White (`#ffffff`). No sidebar. Content left-aligned with `~32px` left padding from the window edge. |
| Overall max-width | Content is not centered - it fills the available page width with natural padding. Cards stretch to fill the 3-column grid. |

---

## Typography scale

| Element | Size | Weight | Color |
|---|---|---|---|
| Page title (h1) | 28px | 600 | `#201f1e` |
| Section heading (h2) | 20px | 600 | `#201f1e` |
| Card title | 16px | 600 | `#201f1e` |
| Description / body | 14px | 400 | `#605e5c` |
| Breadcrumb | 12px | 400 | `#605e5c` |
| Badge text | 12px | 400 | `#107c10` |
| Nav bar text | 13px | 400 | `#ffffff` |

Font family: `Segoe UI, system-ui, sans-serif` throughout.

---

## Card grid spec

```
[gap: 16px between cards]

┌──────────────────────────────┐
│ padding: 20px                │
│                              │
│ [32px icon]  Card Title      │  <- flex row, align-items: center, gap: 12px
│              16px/600        │
│                              │
│ Description text at 14px     │  <- margin-top: 12px
│ color: #605e5c               │
│ line-height: 1.5             │
│                              │
└──────────────────────────────┘
  border: 1px solid #e1dfdd
  border-radius: 8px
  background: #ffffff
  cursor: pointer (whole card is clickable)
```

---

## Differences from the form creation flow (Azure-Example.png)

| Element | Create Resource page | Form creation (Oracle/Terraform) |
|---|---|---|
| Page chrome | Full page, no sticky footer | Sticky Previous/Next/Review bar at bottom |
| Tab nav | None | Yes - Basics, Configuration, etc. |
| Layout | Card grid (3-col) | Single-column form with label/input rows |
| Close button | Top-right ✕ | Top-right ✕ |
| Page title | 28px h1, no icon | 22px h1, no icon (after our update) |
| Breadcrumb | "Home" (1 level) | Multi-level path |
| Background | White, no outer card | White, flat |
