import type { SharedValue } from 'react-native-reanimated';
import type { SectionConfig } from '@/config/types';

// Every section component gets the same props, so the renderer can treat them alike.
export interface SectionProps {
  section: SectionConfig;
  scrollY: SharedValue<number>; // how far the home screen has scrolled (for parallax)
  selectedCategory: string | null; // chip picked in category_chips (filters service_grid)
  onSelectCategory: (categoryId: string | null) => void;
}
