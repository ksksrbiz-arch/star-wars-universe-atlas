import { Component, type ReactNode } from 'react';

/** Keep destination controls usable when WebGL or the lazy renderer fails. */
export default class MapBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { unavailable: boolean }> {
  state = { unavailable: false };

  static getDerivedStateFromError() { return { unavailable: true }; }

  componentDidCatch() { this.props.onUnavailable(); }

  render() {
    return this.state.unavailable
      ? <p role="status" style={{ padding: '64px 32px', color: '#d7e4e8' }}>The interactive map is unavailable. Choose a world with the world finder or destination list; jumps will arrive instantly.</p>
      : this.props.children;
  }
}
