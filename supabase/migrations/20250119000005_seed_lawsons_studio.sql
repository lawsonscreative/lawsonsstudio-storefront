-- Seed data: Create Lawsons Studio brand record

INSERT INTO brands (
  name,
  slug,
  primary_domain,
  is_active,
  logo_url,
  primary_color,
  secondary_color,
  accent_color,
  background_color_dark,
  currency
) VALUES (
  'Lawsons Studio',
  'lawsons-studio',
  'lawsonsstudio.co.uk',
  true,
  '/images/logo.png',
  '#28E8EB',
  '#ED474A',
  '#50468C',
  '#160F19',
  'GBP'
)
ON CONFLICT (slug) DO NOTHING;

-- Store the brand ID for reference in subsequent migrations (if needed)
COMMENT ON TABLE brands IS 'Multi-tenant brand/tenant configuration table. Lawsons Studio is slug: lawsons-studio';
