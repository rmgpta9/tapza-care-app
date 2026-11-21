// Kept as plain JSON-shaped objects (not typed) so they go through the same
// validation as a real network response.
//
// Item shapes per section type:
//   hero_banner      { headline, subtitle?, imageUrl?, ctaLabel?, ctaAction? }
//   category_chips   { id, label, icon }
//   quick_actions    { id, label, icon, action: 'book'|'prescriptions'|'reminders'|'family' }
//   service_grid     { id, name, priceInr, mrpInr?, badge?, icon?, imageUrl?, category?, doctorId }
//   doctor_carousel  { doctorId }
//   offer_strip      { message, icon? }

const SERVICE_LAB = 'd7';

export const NORMAL_CONFIG = {
  version: 12,
  theme: {
    primary: '#0F766E',
    secondary: '#155E75',
    background: '#F6F8F7',
    surface: '#FFFFFF',
    textPrimary: '#14211F',
    textSecondary: '#53625F',
    accent: '#F59E0B',
    dark: {
      primary: '#0D9488',
      secondary: '#155E75',
      background: '#0B1413',
      surface: '#14211F',
      textPrimary: '#E8F1EF',
      textSecondary: '#A3B5B1',
      accent: '#FBBF24',
    },
  },
  tabs: [
    { id: 'home', label: 'Home', icon: 'home-outline', screen: 'home' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar-outline', screen: 'bookings' },
    { id: 'rx', label: 'Medicines', icon: 'medkit-outline', screen: 'prescriptions' },
    { id: 'me', label: 'Profile', icon: 'person-circle-outline', screen: 'profile' },
  ],
  sections: [
    {
      id: 'hero',
      type: 'hero_banner',
      background: { kind: 'gradient', value: '#DDF1EC,#F6F8F7' },
      title: '',
      items: [
        {
          headline: 'Your family doctor, a tap away',
          subtitle: 'Tapza Sunrise Clinic · Banjara Hills · Open till 9 PM',
          ctaLabel: 'Book a visit',
          ctaAction: 'book',
        },
      ],
    },
    {
      id: 'quick',
      type: 'quick_actions',
      background: { kind: 'color', value: '#F6F8F7' },
      title: 'Quick actions',
      items: [
        { id: 'qa-book', label: 'Book', icon: 'calendar-outline', action: 'book' },
        { id: 'qa-rx', label: 'Prescriptions', icon: 'document-text-outline', action: 'prescriptions' },
        { id: 'qa-rem', label: 'Reminders', icon: 'alarm-outline', action: 'reminders' },
        { id: 'qa-fam', label: 'Family', icon: 'people-outline', action: 'family' },
      ],
    },
    {
      id: 'cats',
      type: 'category_chips',
      background: { kind: 'color', value: '#FFFFFF' },
      title: 'What do you need today?',
      items: [
        { id: 'consult', label: 'Consult', icon: 'chatbubbles-outline' },
        { id: 'lab', label: 'Lab tests', icon: 'flask-outline' },
        { id: 'pharmacy', label: 'Pharmacy', icon: 'bandage-outline' },
        { id: 'vaccines', label: 'Vaccines', icon: 'shield-checkmark-outline' },
        { id: 'physio', label: 'Physio', icon: 'body-outline' },
        { id: 'dental', label: 'Dental', icon: 'happy-outline' },
      ],
    },
    {
      id: 'docs',
      type: 'doctor_carousel',
      background: { kind: 'gradient', value: '#FFFFFF,#EEF6F4' },
      title: 'Doctors available today',
      items: [{ doctorId: 'd1' }, { doctorId: 'd2' }, { doctorId: 'd3' }, { doctorId: 'd6' }, { doctorId: 'd4' }],
    },
    {
      id: 'offer',
      type: 'offer_strip',
      background: { kind: 'color', value: '#FFF4DE' },
      title: '',
      items: [{ message: 'Free BP & sugar check with every consultation this week', icon: 'heart-outline' }],
    },
    {
      id: 'labs',
      type: 'service_grid',
      background: { kind: 'color', value: '#F6F8F7' },
      title: 'Popular lab tests',
      columns: 2,
      items: [
        { id: 's-cbc', name: 'Complete Blood Count', priceInr: 349, mrpInr: 499, icon: 'water-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 's-thy', name: 'Thyroid Profile (T3, T4, TSH)', priceInr: 549, icon: 'pulse-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 's-hba1c', name: 'HbA1c (3-month sugar)', priceInr: 449, badge: 'Diabetes', icon: 'analytics-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 's-vitd', name: 'Vitamin D (25-OH)', priceInr: 899, mrpInr: 1499, badge: '40% off', icon: 'sunny-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 's-lipid', name: 'Lipid Profile', priceInr: 599, icon: 'heart-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 's-full', name: 'Full Body Checkup (72 tests)', priceInr: 1999, mrpInr: 3499, badge: 'Bestseller', icon: 'body-outline', category: 'lab', doctorId: SERVICE_LAB },
      ],
    },
    {
      id: 'vaccines',
      type: 'service_grid',
      background: { kind: 'gradient', value: '#EEF6F4,#F6F8F7' },
      title: 'Vaccines for the family',
      columns: 3,
      items: [
        { id: 'v-flu', name: 'Flu (annual)', priceInr: 1450, icon: 'shield-checkmark-outline', category: 'vaccines', doctorId: 'd2' },
        { id: 'v-typh', name: 'Typhoid', priceInr: 850, icon: 'shield-outline', category: 'vaccines', doctorId: 'd2' },
        { id: 'v-hpv', name: 'HPV', priceInr: 3999, badge: 'New', icon: 'shield-half-outline', category: 'vaccines', doctorId: 'd4' },
        { id: 'v-hepb', name: 'Hepatitis B', priceInr: 350, icon: 'medical-outline', category: 'vaccines', doctorId: 'd2' },
        { id: 'v-tdap', name: 'Tdap booster', priceInr: 1200, icon: 'fitness-outline', category: 'vaccines', doctorId: 'd1' },
        { id: 'v-pcv', name: 'Pneumococcal', priceInr: 2350, icon: 'leaf-outline', category: 'vaccines', doctorId: 'd1' },
      ],
    },
    {
      // unknown type on purpose - the app should skip it
      id: 'stories',
      type: 'video_stories',
      background: { kind: 'color', value: '#FFFFFF' },
      title: 'Health stories',
      items: [{ videoUrl: 'https://example.com/story.mp4' }],
    },
  ],
};

export const DIWALI_CONFIG = {
  version: 13,
  theme: {
    primary: '#9A3412',
    secondary: '#7C2D12',
    background: '#FFF8EF',
    surface: '#FFFFFF',
    textPrimary: '#2A1408',
    textSecondary: '#6B4A3A',
    accent: '#D97706',
    festival: {
      name: 'Diwali',
      greeting: 'Happy Diwali! Wishing your family light and good health',
      bannerImageUrl: 'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1200&q=70',
    },
    dark: {
      primary: '#C2410C',
      secondary: '#7C2D12',
      background: '#170D07',
      surface: '#24150C',
      textPrimary: '#FBEFE4',
      textSecondary: '#D6B9A3',
      accent: '#FBBF24',
    },
  },
  tabs: [
    { id: 'home', label: 'Home', icon: 'sparkles-outline', screen: 'home' },
    { id: 'rx', label: 'Medicines', icon: 'medkit-outline', screen: 'prescriptions' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar-outline', screen: 'bookings' },
    { id: 'me', label: 'Profile', icon: 'person-circle-outline', screen: 'profile' },
  ],
  sections: [
    {
      id: 'diwali-offer',
      type: 'offer_strip',
      background: { kind: 'gradient', value: '90deg,#FDE7C7,#FBD38D' },
      title: '',
      items: [{ message: 'Diwali health week · up to 40% off family packages', icon: 'sparkles' }],
    },
    {
      id: 'hero',
      type: 'hero_banner',
      background: { kind: 'gradient', value: '#FDE7C7,#FFF8EF' },
      title: '',
      items: [
        {
          headline: 'Celebrate with a healthy family',
          subtitle: 'Clinics open on Diwali 10 AM – 2 PM · Banjara Hills & Benz Circle',
          ctaLabel: 'See festive packages',
          ctaAction: 'book',
        },
      ],
    },
    {
      id: 'packages',
      type: 'service_grid',
      background: { kind: 'gradient', value: '#FFF8EF,#FDEBD3' },
      title: 'Diwali family health packages',
      columns: 2,
      items: [
        { id: 'p-family', name: 'Family of 4 · Full Body Checkup', priceInr: 5999, mrpInr: 9999, badge: 'Diwali special', icon: 'people-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 'p-parents', name: 'Parents Senior Care Package', priceInr: 2999, mrpInr: 4999, badge: '40% off', icon: 'heart-circle-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 'p-sugar', name: 'After-Sweets Sugar Check', priceInr: 299, badge: 'Popular', icon: 'analytics-outline', category: 'lab', doctorId: SERVICE_LAB },
        { id: 'p-lung', name: 'Lung Function (PFT) · smoke season', priceInr: 799, icon: 'cloud-outline', category: 'consult', doctorId: 'd1' },
      ],
    },
    {
      id: 'cats',
      type: 'category_chips',
      background: { kind: 'color', value: '#FFFFFF' },
      title: 'Explore',
      items: [
        { id: 'lab', label: 'Lab tests', icon: 'flask-outline' },
        { id: 'consult', label: 'Consult', icon: 'chatbubbles-outline' },
        { id: 'pharmacy', label: 'Pharmacy', icon: 'bandage-outline' },
        { id: 'vaccines', label: 'Vaccines', icon: 'shield-checkmark-outline' },
      ],
    },
    {
      id: 'docs',
      type: 'doctor_carousel',
      background: { kind: 'color', value: '#FFF8EF' },
      title: 'Doctors available this Diwali',
      items: [{ doctorId: 'd8' }, { doctorId: 'd1' }, { doctorId: 'd3' }, { doctorId: 'd5' }],
    },
    {
      id: 'quick',
      type: 'quick_actions',
      background: { kind: 'color', value: '#FFFFFF' },
      title: 'Quick actions',
      items: [
        { id: 'qa-rem', label: 'Reminders', icon: 'alarm-outline', action: 'reminders' },
        { id: 'qa-book', label: 'Book', icon: 'calendar-outline', action: 'book' },
        { id: 'qa-rx', label: 'Prescriptions', icon: 'document-text-outline', action: 'prescriptions' },
        { id: 'qa-fam', label: 'Family', icon: 'people-outline', action: 'family' },
      ],
    },
    {
      id: 'safety',
      type: 'offer_strip',
      background: { kind: 'color', value: '#FEF3C7' },
      title: '',
      items: [{ message: 'Burns helpline open 24×7 during Diwali: tap to call the clinic', icon: 'flame-outline' }],
    },
  ],
};
