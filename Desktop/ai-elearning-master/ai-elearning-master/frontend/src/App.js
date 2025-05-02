import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { BrowserRouter as Router, Route } from 'react-router-dom'


const Home = () => <h1>Home</h1>

const App = () => {
    return (
        <BrowserRouter>
            <div className="app-container">
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
};

export default App;