import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

const App = () => {
    return (
        <BrowserRouter>
            <div className="app-container">
                {/* Spacer */}
                <div style={{ height: "100px" }}></div>
                
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
};

export default App;
