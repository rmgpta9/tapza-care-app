import { render, screen } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { SectionConfig } from '@/config/types';
import { SectionRenderer } from '@/features/home';
import { buildTheme } from '@/theme/buildTheme';
import { ThemeContext } from '@/theme/ThemeProvider';

const scrollY = { value: 0 } as SharedValue<number>;

// Renders one section with a default light theme (no config needed).
async function renderSection(section: SectionConfig) {
  await render(
    <ThemeContext.Provider value={buildTheme(null, 'light')}>
      <SectionRenderer section={section} scrollY={scrollY} selectedCategory={null} onSelectCategory={() => {}} />
    </ThemeContext.Provider>,
  );
}

const offerStrip: SectionConfig = {
  id: 'offer',
  type: 'offer_strip',
  background: { kind: 'color', value: '#FFF4DE' },
  title: '',
  items: [{ message: 'Free BP check this week', icon: 'heart-outline' }],
};

describe('SectionRenderer', () => {
  it('renders an offer strip with its message', async () => {
    await renderSection(offerStrip);
    expect(screen.getByText('Free BP check this week')).toBeTruthy();
  });

  it('renders nothing for an unknown section type, without crashing', async () => {
    await renderSection({ ...offerStrip, id: 'stories', type: 'video_stories' });
    expect(screen.toJSON()).toBeNull();
  });

  it('renders nothing when a known section has no usable items', async () => {
    await renderSection({ ...offerStrip, items: [{ wrong: 'shape' }] });
    expect(screen.queryByText('Free BP check this week')).toBeNull();
  });
});
