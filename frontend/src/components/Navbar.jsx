import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../img/logo.png'; // Your logo

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check-session', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                    const userResponse = await fetch('/api/auth/user', {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUserType(userData.role);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                setIsAuthenticated(false);
                setUserType(null);
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const dashboardLink = userType === "TEACHER" ? "/teacher-dashboard"
        : userType === "ADMIN" ? "/admin-dashboard"
            : "/dashboard";

    const profileLink = userType === "TEACHER" ? "/teachers/profile" : "/student/profile";

    return (
        <nav className="navbar navbar-expand-lg bg-dark text-light px-3">
            <div className="container d-flex justify-content-between align-items-center">
                <Link className="navbar-brand mx-auto" to={dashboardLink}>
                    <img src={logo} alt="Logo" style={{ height: '40px' }} />
                </Link>

                <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav gap-4">
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/courses">Courses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/teachers">Teachers</Link>
                        </li>
                    </ul>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {isAuthenticated ? (
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown">
                                <i className="fas fa-user-circle fs-3"></i>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to={profileLink}>
                                        <i className="fas fa-user"></i> Profile
                                    </Link>
                                </li>

                                {userType === "STUDENT" && (
                                    <li>
                                        <Link className="dropdown-item" to="/completed-courses">
                                            <i className="fas fa-trophy text-warning"></i> Завершённые курсы
                                        </Link>
                                    </li>
                                )}
                                <li><hr className="dropdown-divider" /></li>

                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link className="btn btn-primary btn-sm ms-2" to="/">
                            <i className="fas fa-sign-in-alt"></i> Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;