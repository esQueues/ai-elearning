import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../img/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterTeacher = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        repeatPassword: "",
        bio: "",
    });
    const [errors, setErrors] = useState({});
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const newFormData = { ...prev, [name]: value };

            // Password match validation
            if (name === "password" || name === "repeatPassword") {
                if (newFormData.password && newFormData.repeatPassword) {
                    if (newFormData.password !== newFormData.repeatPassword) {
                        setPasswordMatchMessage("Passwords do not match");
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            passwordMatch: "Passwords do not match",
                        }));
                    } else {
                        setPasswordMatchMessage("Passwords match");
                        setErrors((prevErrors) => ({ ...prevErrors, passwordMatch: "" }));
                    }
                } else {
                    setPasswordMatchMessage("");
                    setErrors((prevErrors) => ({ ...prevErrors, passwordMatch: "" }));
                }
            }

            // Email validation
            if (name === "email") {
                if (value && !/\S+@\S+\.\S+/.test(value)) {
                    setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
                } else {
                    setErrors((prev) => ({ ...prev, email: "" }));
                }
            }

            // Password length validation
            if (name === "password") {
                if (value && value.length < 6) {
                    setErrors((prev) => ({
                        ...prev,
                        password: "Password must be at least 6 characters",
                    }));
                } else {
                    setErrors((prev) => ({ ...prev, password: "" }));
                }
            }

            return newFormData;
        });
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.firstname) validationErrors.firstname = "First name is required";
        if (!formData.lastname) validationErrors.lastname = "Last name is required";
        if (!formData.email) validationErrors.email = "Email is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
            validationErrors.email = "Invalid email format";
        if (!formData.password) validationErrors.password = "Password is required";
        if (formData.password && formData.password.length < 6)
            validationErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.repeatPassword)
            validationErrors.passwordMatch = "Passwords do not match";
        if (!formData.bio) validationErrors.bio = "Biography is required";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            bio: formData.bio,
        };

        try {
            await axios.post("/api/auth/register/teacher", payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            alert("Teacher registered successfully!");
            navigate("/");
        } catch (err) {
            if (err.response?.data?.message) {
                alert(err.response.data.message);
                setErrors((prev) => ({ ...prev, server: err.response.data.message }));
            } else {
                alert("Network error. Please try again.");
                setErrors((prev) => ({ ...prev, server: "Network error. Please try again." }));
            }
        }
    };

    return (
        <div className="container-fluid min-vh-80 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg" style={{ width: "95%", maxWidth: "750px", padding: "2rem" }}>
                <div className="row g-0">
                    {/* Left Side - Logo */}
                    <div className="col-md-5 d-flex align-items-center justify-content-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="img-fluid"
                            style={{ width: "80%", maxWidth: "250px" }}
                        />
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="col-md-7">
                        <div className="card-body d-flex flex-column align-items-center">
                            <h2 className="card-title text-center mb-1">Register as a Teacher</h2>
                            <p className="text-center mb-4">
                                Are you a student? <Link to="/register/student">Register here</Link>
                            </p>

                            {errors.server && (
                                <div className="alert alert-danger w-100">{errors.server}</div>
                            )}

                            <form onSubmit={handleSubmit} className="w-100">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstname" className="form-label">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.firstname ? "is-invalid" : ""
                                            }`}
                                            id="firstname"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                        />
                                        {errors.firstname && (
                                            <div className="invalid-feedback">{errors.firstname}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastname" className="form-label">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.lastname ? "is-invalid" : ""
                                            }`}
                                            id="lastname"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                        />
                                        {errors.lastname && (
                                            <div className="invalid-feedback">{errors.lastname}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${
                                                errors.password ? "is-invalid" : ""
                                            }`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">{errors.password}</div>
                                        )}
                                        {formData.password &&
                                            formData.password.length < 6 &&
                                            !errors.password && (
                                                <div className="form-text text-warning">
                                                    Password must be at least 6 characters
                                                </div>
                                            )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="repeatPassword" className="form-label">
                                            Repeat Password *
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${
                                                errors.passwordMatch ? "is-invalid" : ""
                                            }`}
                                            id="repeatPassword"
                                            name="repeatPassword"
                                            value={formData.repeatPassword}
                                            onChange={handleChange}
                                        />
                                        {errors.passwordMatch && (
                                            <div className="invalid-feedback">
                                                {errors.passwordMatch}
                                            </div>
                                        )}
                                        {passwordMatchMessage && !errors.passwordMatch && (
                                            <div className="form-text text-success">
                                                {passwordMatchMessage}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">
                                        Biography (Education & Awards) *
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.bio ? "is-invalid" : ""}`}
                                        id="bio"
                                        name="bio"
                                        rows="4"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors.bio && (
                                        <div className="invalid-feedback">{errors.bio}</div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mt-3">
                                    Register as a Teacher
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterTeacher;