export const FEATURES_LIST = [
  'Booking',
  'Contact',
  'Multi-language',
  'Blog',
  'Pricing',
  'Portfolio',
  'Catalogue',
  'Payment',
  'FAQ',
  'Chat Widget',
  'Social Proof',
  'Testimonials',
  'Newsletter',
] as const

export type FeatureType = (typeof FEATURES_LIST)[number]
