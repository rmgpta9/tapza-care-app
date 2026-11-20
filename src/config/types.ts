// The shape of GET /config, as given in the assignment.

export type ScreenId = 'home' | 'bookings' | 'prescriptions' | 'profile';

export interface ThemePalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export interface FestivalInfo {
  name: string;
  greeting: string;
  bannerImageUrl: string;
}

export interface ThemeConfig extends ThemePalette {
  festival?: FestivalInfo; // only on festival days
  dark?: ThemePalette; // optional dark-mode colours
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string; // an Ionicons name, e.g. "home-outline"
  screen: ScreenId;
}

export interface SectionBackground {
  kind: 'color' | 'gradient' | 'image';
  // color: "#FFFFFF", gradient: "#FFFFFF,#EEEEEE", image: "https://..."
  value: string;
}

export interface SectionConfig {
  id: string;
  type: string;
  background: SectionBackground;
  title: string;
  items: unknown[]; // each section type checks its own items
  columns?: number; // for service_grid
}

export interface LayoutConfig {
  version: number;
  theme: ThemeConfig;
  tabs: TabConfig[];
  sections: SectionConfig[];
}
