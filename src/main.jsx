import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Netflix App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#141414',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#E50914', fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
            NETFLIX
          </h1>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>
            Something went wrong while loading the page.
          </h2>
          <p style={{ color: '#888', maxWidth: '500px', marginBottom: '24px' }}>
            {this.state.error?.message || "Please refresh the page to restart the session."}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('netflix_my_list');
              window.location.reload();
            }}
            style={{
              backgroundColor: '#E50914',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Netflix
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
