# ALDEN ROVELL — V2 logo placement map

Source: `Alden-Rovell-Logo-Collection-4K-Guide(1).pdf`, 10-page owner-supplied guide. These are derived from its **seven supplied** raster designs, not reimagined or substituted logo artwork. Full PDF exports are raster/upscaled, not editable vector masters.

| UI placement | Actual file | Reference | Behavior |
| --- | --- | --- | --- |
| Top navigation on near-black surface | `public/brand/primary-header-white.png` | PDF page 7 dark-banner light wordmark + page 3 primary lockup geometry | Transparent red emblem + white wordmark; entire mark has natural visible aspect ratio. |
| Original light-surface horizontal logo | `public/brand/primary-header.png` | PDF page 3 | Red symbol and original dark wordmark, cropped from supplied artwork without changing shape. |
| Loading screen | `public/brand/loader-black.png` | PDF page 8 monochrome horizontal | Black logo on light background; subtle short loading indicator. |
| Favicon / home-screen icon | `public/favicon.ico`, `public/apple-touch-icon.png`, `src/app/icon.png` | PDF page 6 transparent symbol | Only supplied red symbol with safe breathing room; multiple icon sizes. |
| Footer on dark background | `public/brand/primary-header-white.png` | PDF page 7 / derived white horizontal wordmark | Red + white brand lockup; not black text on black. |
| Brand profile / story section | `public/brand/profile-dark.png` | PDF page 4 | Original charcoal square tile; keep art centered. |
| About page stacked presentation | `public/brand/stacked-logo.png` | PDF page 5 | Symbol above wordmark; use only on a light surface. |
| Home's brand signature banner | `public/brand/wide-banner.png` | PDF page 7 | Landscape dark banner, preserve crop around lettering. |
| Social/Open Graph cover | `public/brand/landscape-cover.png` | PDF page 9 | Original 16:9 dark cover for social preview. |
| Hero supporting emblem | `public/brand/mark-clean.png` | PDF page 6 | Transparent emblem only, no accidental black rectangle. |

## Colors from supplied PDF, page 10

Red `#DA0D12` · Oxblood `#80060B` · Near black `#161616` · Graphite `#424141` · Warm gray `#666362` · Pale gray `#CBCAC8`.

## Important technical repair

Prior exports omitted a PDF soft-mask/transparency channel. That caused ostensibly transparent brand images to display black backgrounds. V2 re-extracts both original image pixels and the PDF transparency soft mask. The white horizontal variant recolors **only the dark wordmark** to white while retaining the original red emblem and logo shapes. White wordmark is a website contrast adaptation, not a new approved logo design.
