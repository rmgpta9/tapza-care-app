import { Component, type ReactNode } from 'react';

interface Props {
  sectionId: string;
  children: ReactNode;
}

// If one section crashes while rendering (e.g. bad data from the config), hide
// just that section instead of crashing the whole home screen.
// React only supports this with a class component.
export class SectionErrorBoundary extends Component<Props, { hasError: boolean }> {
  override state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.warn(`Section "${this.props.sectionId}" failed to render and was hidden:`, error.message);
  }

  override render() {
    return this.state.hasError ? null : this.props.children;
  }
}
