/**
 * Awareness content for India — statistics point to official sources; figures change yearly.
 * Images: Unsplash (free to use) — respectful, non-sensational imagery.
 */

export const WOMENS_SAFETY_STATS_INDIA = [
  {
    id: 's1',
    headline: '4.45L+',
    label: 'Crimes vs women',
    note: '2022 NCRB (cognizable cases — see latest report)',
    href: 'https://ncrb.gov.in/',
  },
  {
    id: 's2',
    headline: '~32K',
    label: 'Rape FIRs (2022)',
    note: 'NCRB registered cases; under-reporting remains high',
    href: 'https://ncrb.gov.in/',
  },
  {
    id: 's3',
    headline: '1091',
    label: 'Women’s helpline',
    note: 'National emergency — save & share',
    href: 'tel:1091',
  },
  {
    id: 's4',
    headline: 'POCSO',
    label: 'Child + minors',
    note: 'Protection of Children from Sexual Offences Act',
    href: 'https://wcd.nic.in/',
  },
]

/**
 * @type {Array<{
 *   id: string
 *   title: string
 *   excerpt: string
 *   category: string
 *   imageUrl: string
 *   imageAlt: string
 *   source: string
 *   href: string
 * }>}
 */
export const WOMENS_SAFETY_ARTICLES = [
  {
    id: 'ncrb-context',
    title: 'Sexual violence in India: what official data shows',
    excerpt:
      'National Crime Records Bureau (NCRB) annual reports track offences including rape, assault, and cruelty. Reported numbers are only part of the picture — stigma, fear, and barriers to police often mean many survivors never file FIRs.',
    category: 'Data',
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Law books and justice theme — symbolic',
    source: 'NCRB — Crime in India reports',
    href: 'https://ncrb.gov.in/',
  },
  {
    id: 'legal-framework',
    title: 'Laws that protect women in India',
    excerpt:
      'The IPC defines offences; amendments after 2013 strengthened consent, stalking, and acid-attack provisions. POCSO protects minors. State commissions for women offer support; fast-track courts exist in many districts though delays remain.',
    category: 'Legal',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Modern building — civic institutions',
    source: 'PRS Legislative / MWCD resources',
    href: 'https://www.wcd.nic.in/',
  },
  {
    id: 'safety-habits',
    title: 'Everyday safety: trust, boundaries, and plans',
    excerpt:
      'Share live location with people you trust, note vehicle numbers, use well-lit routes, and pre-agree a check-in code word. Your instincts matter — leaving an uncomfortable situation is always valid.',
    category: 'Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Woman walking with confidence outdoors',
    source: 'Rakshika awareness',
    href: 'https://www.mygov.in/',
  },
  {
    id: 'digital-safety',
    title: 'Online harassment and image-based abuse',
    excerpt:
      'Save evidence (screenshots, URLs), block safely, and report on platforms and via cyber crime portals. In India, cyber cells and 1930 (helpline) can guide next steps; never pay blackmail demands.',
    category: 'Digital',
    imageUrl:
      'https://images.unsplash.com/photo-1512428558873-502ded1d163e?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Phone in hand — digital connectivity',
    source: 'Cyber Crime portal — gov.in',
    href: 'https://cybercrime.gov.in/',
  },
  {
    id: 'support',
    title: 'You are not alone: support and counselling',
    excerpt:
      'One-stop centres, district legal services, and NGOs offer counselling and legal aid. Asking for help is a sign of strength. Helplines like 1091 and 181 (women) connect to trained responders.',
    category: 'Support',
    imageUrl:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Friends supporting each other — togetherness',
    source: 'MWCD — schemes & centres',
    href: 'https://wcd.nic.in/',
  },
]
