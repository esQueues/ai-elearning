import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            if (data.userRole === "TEACHER") {
                navigate("/teacher-dashboard");
            } else if (data.userRole === "ADMIN") {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="col-md-8 col-lg-6">
                <div className="card shadow">
                    <div className="row g-0">
                        {/* Left Side - Logo */}
                        <div className="col-md-5 d-flex align-items-center justify-content-center p-4">
                            <img src={logo} alt="EDUPULSE Logo" className="img-fluid" style={{ maxWidth: "200px" }} />
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="col-md-7">
                            <div className="card-body p-5">
                                <h2 className="card-title text-center mb-4">Sign In</h2>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">Password *</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
                                        SIGN IN
                                    </button>
                                    <p className="text-center mt-3">
                                        Don't have an account? <Link to="/register/student">Register here</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;