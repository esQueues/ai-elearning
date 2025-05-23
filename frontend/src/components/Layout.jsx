import { Link, Outlet } from "react-router-dom";
import Footer from "../components/Footer"; // Добавляем Footer
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Layout = ({ student }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold fs-4" to="/dashboard">
                        My Learning
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/courses">
                                    Courses
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/teachers">
                                    Teachers
                                </Link>
                            </li>
                            {student && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/student/profile">
                                        Profile
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Контентная часть, растягивающаяся на всю доступную высоту */}
            <div className="container flex-grow-1 mt-4">
                <Outlet />
            </div>

            {/* Футер внизу страницы */}
            <Footer />
        </div>
    );
};

export default Layout;
