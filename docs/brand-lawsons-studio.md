# Brand Definition – Lawsons Studio

## 1. Identity

- **Brand name:** Lawsons Studio  
- **Internal ID / slug:** `lawsons-studio`  
- **Owner:** Lawsons Enterprises Ltd  
- **Role in platform:** Consumer-facing merch brand (POD), first tenant on the multi-brand commerce platform.  
- **Positioning:** Bold, creative, colourful merch with a strong automotive / lifestyle flavour.

### 1.1 Domains

- **Primary domain (planned):** `lawsonsstudio.co.uk`  
- **Optional future domain:** `lawsonsstudio.com` → redirect to `.co.uk`

The platform should treat `lawsonsstudio.co.uk` as the canonical domain for this brand once DNS is configured.

---

## 2. Assets

### 2.1 Logo

- **Logo file (repo):**  
  `public/images/logo.png`
- **Logo path (web):**  
  `/images/logo.png`
- **Background:** Transparent PNG.
- **Usage:**
  - Primary logo in site header.
  - Used on checkout, order confirmation and customer portal (brand-aware UI).
  - Should generally sit on dark or very low-saturation backgrounds so the colours pop.

---

## 3. Visual Theme

The UI for Lawsons Studio must use colours derived from the logo.  
These are the canonical brand colours for this tenant.

### 3.1 Core palette

- **Primary colour:** `#28E8EB`  
  - Electric cyan from the logo.  
  - Use for primary buttons, key links and high-emphasis UI elements.

- **Secondary colour:** `#ED474A`  
  - Neon red/pink from the logo strokes.  
  - Use for secondary buttons, sale tags, badges and important highlights.

- **Accent colour:** `#50468C`  
  - Indigo/violet tone from the logo.  
  - Use for hovers, focus states, subtle borders and accent backgrounds.

### 3.2 Supporting colours

- **Sky blue:** `#4C9BD0`  
  - Can be used in gradients and less prominent accents.

- **Hot magenta:** `#A21556`  
  - For special highlights, small badges, and subtle gradient blending.

- **Dark base:** `#160F19`  
  - Primary dark background colour (hero sections, header/footer, or full dark theme).

### 3.3 Background & surfaces

- **Dark sections:**
  - Base: `#160F19`
  - Use for hero, header, footer, and key feature sections where the logo sits.

- **Light sections (optional if using mixed light/dark layout):**
  - Very dark grey for cards: e.g. `#1E1724`–`#221A2A`
  - Off-black text on light surfaces should still harmonise with the palette.

### 3.4 Gradients

Gradients should be built from the core palette, not random colours.

- **Gradient A (primary / hero / CTA):**  
  A left-to-right blend based on logo strokes, e.g.  
  `linear-gradient(90deg, #28E8EB, #4C9BD0, #ED474A, #A21556)`

- **Gradient B (badges / accent elements):**  
  `linear-gradient(135deg, #A21556, #50468C)`

Claude should use these hex values when defining theme tokens (CSS variables, Tailwind config, or equivalent).

---

## 4. Typography

These are brand preferences; exact implementation may depend on the chosen stack, but the feel should be:

- Modern, clean, and slightly playful.
- Easy to read on both dark and light backgrounds.

### 4.1 Recommended web fonts

If using Google Fonts (or similar):

- **Headings:** A bold geometric/modern sans-serif  
  - Example: `Poppins` or `Manrope`  
  - Usage: H1–H3, hero titles, section headings.

- **Body text:** Neutral, highly readable sans-serif  
  - Example: `Inter`  
  - Usage: Paragraphs, form labels, buttons.

If those exact fonts aren’t used, the chosen pair should be equivalent:  
modern sans-serif for headings, highly readable sans-serif for body.

### 4.2 General type rules

- Use larger sizes and good line spacing (feels premium and modern).
- On dark backgrounds, ensure sufficient contrast with text (accessibility).

---

## 5. Brand in the Platform (Data Model)

Lawsons Studio is represented in the `brands` table in Supabase.

The initial row for this brand should include:

- `name`: `"Lawsons Studio"`
- `slug`: `"lawsons-studio"`
- `primary_domain`: `"lawsonsstudio.co.uk"` (once live)
- `is_active`: `true`
- Theme-related fields (names may differ based on schema), for example:
  - `logo_url`: `/images/logo.png`
  - `primary_color`: `#28E8EB`
  - `secondary_color`: `#ED474A`
  - `accent_color`: `#50468C`
  - `background_color_dark`: `#160F19`

All `products`, `product_variants`, `orders` and other brand-specific records for this shop must reference:

- `brand_id` pointing to this brand’s row.

---

## 6. Brand-Specific Behaviour

### 6.1 Storefront

For the Lawsons Studio storefront:

- Use the logo and colour palette defined above.
- Visual style should feel:
  - Bold and colourful.
  - Slightly futuristic/creative (in line with the paint-stroke logo).
- Avoid dull greys and generic blues that clash with the palette.

### 6.2 Customer Experience

Although the platform supports multiple brands, for **Lawsons Studio** specifically:

- Tone of voice: friendly, a bit playful, but still professional.
- Imagery: high-contrast, colourful, with strong product mockups that feel “vibrant” like the logo.
- Dark or mixed dark/light theme is preferred to make the logo colours stand out.

---

## 7. Integration Pointers (for Claude / Platform Code)

- Any **brand resolution** based on domain/host should map `lawsonsstudio.co.uk` to the `lawsons-studio` brand ID.
- The **theme system** should read colours and logo data from the `brands` table for this brand, using the values specified here.
- Any **emails** (order confirmation, shipping, etc.) sent for orders with `brand_id` = Lawsons Studio should:
  - Use the Lawsons Studio logo.
  - Use the Lawsons Studio colours for email templates (where possible).

---

This document is the single source of truth for **Lawsons Studio** branding inside the commerce platform.  
Any future changes to colours, logo paths, or domain should be made here first, then reflected in the database and UI. 