import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Component, ReactNode } from 'react';
import SoundHub from '../../src/pages/SoundHub';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#050505', color: '#E0B100', fontFamily: 'monospace', padding: '40px', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '16px' }}>SOUND HUB — RENDER ERROR</h1>
          <pre style={{ color: '#F3F3F0', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/soundhub-app">
        <Routes>
          <Route path="/" element={<SoundHub />} />
          <Route path="/:slug" element={<SoundHub />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
