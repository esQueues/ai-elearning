import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5">
                    <div className="alert alert-danger">
                        Something went wrong. Please refresh the page.
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Find the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error("Root element not found");
} else {
    // ✅ Create root once & render App inside ErrorBoundary
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <ErrorBoundary>
            {/* You can remove React.StrictMode for debugging */}
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </ErrorBoundary>
    );
}

// Optional: Log performance metrics
reportWebVitals();
