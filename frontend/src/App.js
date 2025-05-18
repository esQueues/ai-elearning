import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

const App = () => (
    <BrowserRouter>
        <div className="app-container">
            <div className="navbar-spacer" />
            <AppRoutes />
        </div>
    </BrowserRouter>
);

export default App;