# ALDEN ROVELL V2 — release notes

**Release status:** Source ZIP prepared. Requires Vercel deployment and end-to-end/browser verification before being called production-ready.

## Corrected

1. Logos re-extracted directly from the latest 10-page PDF with original transparency masks, preventing black boxed logos.
2. Primary header uses red symbol + white wordmark on a dark surface, accurately scaled from tightly cropped original artwork.
3. Loader uses the black monochrome wordmark on a light background, instead of the wrong red standalone mark.
4. Favicon, Apple touch icon and Next.js app icon use the clean standalone original red symbol with sufficient padding.
5. Footer uses a high-contrast white wordmark on dark background, rather than nearly black text on a light gray surface.
6. Added the original supplied dark wide banner to the home page; corrected hero supporting emblem transparency.
7. Removed wrong persistent shop-category UI state: URL is now the source of truth for filtering and back/forward navigation.
8. Improved keyboard focus, mobile menu backdrop, Escape-to-close behavior, mobile navigation styling and layout wrapping.
9. Smoothed/stabilized hero image motion, product images and reduced-motion behavior; small-device CSS overrides added.
10. Replaced metadata canonical fallback (`example.com`) with current project preview URL and created proper icons.

## Checked

- Original logo PDF: read pages 1–10, extracted seven asset groups including original PDF masks.
- Logo pixels/transparency: checked generated light/dark mark composite.
- Automated order validation tests: 9 pass.
- TypeScript/TSX syntax parsing: see QA report.
- Package integrity: see ZIP QA log.

## Still requires configuration/owner approval

- Product images include AI-assisted concepts and have not been physically verified.
- Product prices, stock quantities and available variants remain unset; buy/cart is correctly disabled until verified, not a bug.
- Supabase project, SQL schema, keys, admin user, COD/shipping settings and approved listings must be configured for working checkout.
- Email alert requires verified Resend sender; no official public Gmail address has been supplied.
- Customer phone number remains “Coming soon” until owner supplies one.
- Confirm shipping, returns exceptions, and full commercial terms before launch. The 7-day return *window* is owner-confirmed; eligibility is not.
- Live Vercel deployment, actual mobile browser review, and payment/order/notification end-to-end tests were not performed in this file-building environment.

## Deployment

Replace files in your **existing GitHub repository** with this ZIP's extracted contents; do not upload ZIP as an unextracted single GitHub file. Commit to the branch connected to Vercel. Verify Vercel's new build and preview. Avoid overwriting any currently live secret `.env` file.

Read `DEPLOYMENT.md` and `BRAND_PLACEMENT_MAP.md` for the detailed steps and placement inventory.
