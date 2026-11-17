# Graph Report - Tacocards Tijuana  (2026-11-11)

## Corpus Check
- Corpus is ~30,592 words - fits in a single context window. You may not need a graph.

## Summary
- 122 nodes · 454 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.91)
- Token cost: 18,500 input · 2,400 output

## Community Hubs (Navigation)
- State Store, DevModal & Profile
- PWA Shell, Manifest & Roadmap
- App Router & Business Portal
- Album Lightbox, Coupons & QR
- Loyalty Visits & Map Discovery
- Trading Cards & Local Data
- Architecture Spec & Design System
- QR Scanner & Button Component
- Module Self-Check Tests
- SVG Icon System

## God Nodes (most connected - your core abstractions)
1. `getIconSvg()` - 45 edges
2. `getState()` - 35 edges
3. `setState()` - 30 edges
4. `AGENT.md: Architectural Spec & Monolithic React Prototype Reference` - 28 edges
5. `navigateTo()` - 26 edges
6. `renderApp()` - 15 edges
7. `renderMapView()` - 13 edges
8. `createTradingCard()` - 12 edges
9. `renderAlbumView()` - 11 edges
10. `renderLoyaltyView()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Manual PWA Configuration & Offline Cache Strategy` --conceptually_related_to--> `registerServiceWorker()`  [INFERRED]
  md/AGENT.md → js/app.js
- `AGENT.md: Architectural Spec & Monolithic React Prototype Reference` --references--> `locals`  [EXTRACTED]
  md/AGENT.md → js/data/mockData.js
- `3D Collectible Lightbox, Album Sorting & Web Share Flow` --conceptually_related_to--> `couponsData`  [INFERRED]
  md/design.md → js/data/mockData.js
- `Sequential 1-8 Loyalty Visits & Passive Counter Validation UX` --conceptually_related_to--> `incrementVisit()`  [INFERRED]
  md/design.md → js/state.js
- `AGENT.md: Architectural Spec & Monolithic React Prototype Reference` --references--> `goldenLocal`  [EXTRACTED]
  md/AGENT.md → js/data/mockData.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Static PWA Shell & Service Worker Boot Architecture** — index_html_entry, index_css_style, manifest, sw, js_app, js_app_registerserviceworker, vercel, md_agent_pwa_offline_strategy [EXTRACTED 1.00]
- **Consumer Mobile Views & Collectible Flow** — js_views_consumer_mapview, js_views_consumer_detailview, js_views_consumer_scanview, js_views_consumer_albumview, js_views_consumer_couponsview, js_views_consumer_loyaltyview, js_views_consumer_profileview, js_views_consumer_consumernav, js_components_tradingcard [EXTRACTED 1.00]
- **Business (Locatario) Analytics, Loyalty & Redemption Portal** — js_views_business_dashboard, js_views_business_redeempage, js_views_business_loyaltypage, js_views_business_qrpage, js_views_business_planpage, js_views_business_businessnav [EXTRACTED 1.00]
- **Phase 4 UI/UX Refinement & Business Logic Roadmap** — md_design_spec, md_design_inverted_map_ux, md_design_semantic_iconography, md_design_album_3d_lightbox, md_design_sequential_loyalty_passive_validation, md_design_volatile_guest_profile_checkout [EXTRACTED 1.00]

## Communities (10 total, 1 thin omitted)

### Community 0 - "State Store, DevModal & Profile"
Cohesion: 0.15
Nodes (18): closeDevModal(), initDevModalTrigger(), openDevModal(), businessKpis, currentState, DEFAULT_STATE, DEFAULT_VOLATILE_PROFILE, listeners (+10 more)

### Community 1 - "PWA Shell, Manifest & Roadmap"
Cohesion: 0.10
Nodes (19): css/style.css Stylesheet Reference, Typography: Cinzel & Manrope Google Fonts, index.html (PWA Shell & Root Container), registerServiceWorker(), background_color, description, display, icons (+11 more)

### Community 2 - "App Router & Business Portal"
Cohesion: 0.34
Nodes (13): renderApp(), initRouter(), navigateTo(), getState(), createBusinessNav(), prizes, renderLoyaltyPage(), renderPlanPage() (+5 more)

### Community 3 - "Album Lightbox, Coupons & QR"
Cohesion: 0.31
Nodes (12): createFakeQR(), getIconSvg(), createTradingCard(), couponsData, renderQrPage(), openCardLightbox(), toggleFlip(), rarityRank (+4 more)

### Community 4 - "Loyalty Visits & Map Discovery"
Cohesion: 0.33
Nodes (10): incrementVisit(), resetVisits(), setState(), render(), renderLoyaltyView(), getLocalFoodIcon(), renderMapView(), buildPlaceCardHtml() (+2 more)

### Community 5 - "Trading Cards & Local Data"
Cohesion: 0.44
Nodes (5): currentTilt, initGyroscope(), cardDetails, locals, rarityLabel

### Community 6 - "Architecture Spec & Design System"
Cohesion: 0.29
Nodes (6): goldenLocal, Design System Tokens (Warm Light Palette, Gold/Teal/Terra Accents), AGENT.md: Architectural Spec & Monolithic React Prototype Reference, Zero-Framework Vanilla ES Modules & Pure CSS3 Architecture, cleanUrls, rewrites

### Community 7 - "QR Scanner & Button Component"
Cohesion: 0.53
Nodes (4): createButton(), photos, renderScanView(), render()

### Community 8 - "Module Self-Check Tests"
Cohesion: 0.33
Nodes (3): feeAt100, initialState, updatedState

## Knowledge Gaps
- **4 isolated node(s):** `README: Tacocards`, `Typography: Cinzel & Manrope Google Fonts`, `Zero-Framework Vanilla ES Modules & Pure CSS3 Architecture`, `Design System Tokens (Warm Light Palette, Gold/Teal/Terra Accents)`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 30 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AGENT.md: Architectural Spec & Monolithic React Prototype Reference` connect `Architecture Spec & Design System` to `State Store, DevModal & Profile`, `PWA Shell, Manifest & Roadmap`, `App Router & Business Portal`, `Album Lightbox, Coupons & QR`, `Loyalty Visits & Map Discovery`, `Trading Cards & Local Data`, `QR Scanner & Button Component`, `SVG Icon System`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **What connects `README: Tacocards`, `Typography: Cinzel & Manrope Google Fonts`, `Zero-Framework Vanilla ES Modules & Pure CSS3 Architecture` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PWA Shell, Manifest & Roadmap` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `getIconSvg()` connect `Album Lightbox, Coupons & QR` to `State Store, DevModal & Profile`, `App Router & Business Portal`, `Loyalty Visits & Map Discovery`, `Trading Cards & Local Data`, `QR Scanner & Button Component`, `Module Self-Check Tests`, `SVG Icon System`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Why does `index.html (PWA Shell & Root Container)` connect `PWA Shell, Manifest & Roadmap` to `App Router & Business Portal`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._