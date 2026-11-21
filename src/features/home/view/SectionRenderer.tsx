import type { ComponentType } from 'react';
import { View } from 'react-native';
import { SectionBackground, SectionErrorBoundary } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { CategoryChips } from './sections/CategoryChips';
import { DoctorCarousel } from './sections/DoctorCarousel';
import { HeroBanner } from './sections/HeroBanner';
import { OfferStrip } from './sections/OfferStrip';
import { QuickActions } from './sections/QuickActions';
import { ServiceGrid } from './sections/ServiceGrid';
import type { SectionProps } from './sections/types';

// Which component draws each section `type` from the config.
// To support a new section type, build its component and add one line here.
const SECTION_COMPONENTS: Record<string, ComponentType<SectionProps>> = {
  hero_banner: HeroBanner,
  category_chips: CategoryChips,
  quick_actions: QuickActions,
  service_grid: ServiceGrid,
  doctor_carousel: DoctorCarousel,
  offer_strip: OfferStrip,
};

// Thin bands like the offer strip get less padding than full sections.
const THIN_SECTIONS = ['offer_strip', 'hero_banner'];

export function SectionRenderer(props: SectionProps) {
  const { spacing } = useTheme();
  const SectionComponent = SECTION_COMPONENTS[props.section.type];

  // Unknown type (e.g. added in a newer app version): show nothing.
  if (!SectionComponent) return null;

  const padding = THIN_SECTIONS.includes(props.section.type) ? 0 : spacing.lg;

  return (
    <SectionErrorBoundary sectionId={props.section.id}>
      <SectionBackground background={props.section.background}>
        <View style={{ paddingVertical: padding }}>
          <SectionComponent {...props} />
        </View>
      </SectionBackground>
    </SectionErrorBoundary>
  );
}
