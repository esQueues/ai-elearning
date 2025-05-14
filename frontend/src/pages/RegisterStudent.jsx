import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";

const RegisterStudent = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        birthDate: "",
        gradeLevel: "",
        schoolInfo: "",
        email: "",
        password: "",
        repeatPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newFormData = { ...prev, [name]: value };

            if (name === "repeatPassword" || name === "password") {
                if (newFormData.password && newFormData.repeatPassword) {
                    if (newFormData.password !== newFormData.repeatPassword) {
                        setPasswordMatchMessage("Password do not match");
                        setErrors(prevErrors => ({ ...prevErrors, passwordMatch: "Password do not match" }));
                    } else {
                        setPasswordMatchMessage("Password match");
                        setErrors(prevErrors => ({ ...prevErrors, passwordMatch: "" }));
                    }
                } else {
                    setPasswordMatchMessage("");
                    setErrors(prevErrors => ({ ...prevErrors, passwordMatch: "" }));
                }
            }

            return newFormData;
        });

        if (name === "gradeLevel") {
            if (value && (isNaN(value) || value < 0 || value > 12)) {
                setErrors(prev => ({ ...prev, gradeLevel: "Please enter your grade from 1-12" }));
            } else {
                setErrors(prev => ({ ...prev, gradeLevel: "" }));
            }
        }

        if (name === "email" && value && !value.includes("@")) {
            setErrors(prev => ({ ...prev, email: "Email must contain @" }));
        } else if (name === "email") {
            setErrors(prev => ({ ...prev, email: "" }));
        }

        if (name === "password") {
            if (value && value.length < 6) {
                setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
            } else {
                setErrors(prev => ({ ...prev, password: "" }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const validationErrors = {};

        if (!formData.firstname) validationErrors.firstname = "First Name is required";
        if (!formData.lastname) validationErrors.lastname = "Last Name is required";
        if (!formData.birthDate) validationErrors.birthDate = "Birth Date is required";
        if (!formData.gradeLevel) validationErrors.gradeLevel = "Grade Level is required";
        if (isNaN(formData.gradeLevel) || formData.gradeLevel < 1 || formData.gradeLevel > 12) {
            validationErrors.gradeLevel = "Please enter your grade from 1-12";
        }
        if (!formData.schoolInfo) validationErrors.schoolInfo = "School Info is required";
        if (!formData.email) validationErrors.email = "Email is required";
        if (!formData.email.includes("@")) validationErrors.email = "Email must contain @";
        if (!formData.password) validationErrors.password = "Password is required";
        if (formData.password.length < 6) validationErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.repeatPassword) {
            validationErrors.passwordMatch = "Password do not match";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                firstname: formData.firstname,
                lastname: formData.lastname,
                birthDate: formData.birthDate,
                gradeLevel: formData.gradeLevel,
                schoolInfo: formData.schoolInfo
            }),
        });

        if (response.ok) {
            alert("Student registered successfully!");
            navigate("/");
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Student registration failed.");
        }
    };

    return (
        <div className="container-fluid min-vh-80 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg" style={{ width: "95%", maxWidth: "750px", padding: "2rem" }}>
                <div className="row g-0">
                    {/* Левая часть - Логотип */}
                    <div className="col-md-5 d-flex align-items-center justify-content-center">
                        <img src={logo} alt="Logo" className="img-fluid" style={{ width: "80%", maxWidth: "250px" }} />
                    </div>

                    {/* Правая часть - Форма регистрации */}
                    <div className="col-md-7">
                        <div className="card-body d-flex flex-column align-items-center">
                            <h2 className="card-title text-center mb-1">Register as a Student</h2>
                            <p className="text-center mb-4">
                                Are you a teacher? <Link to="/register/teacher">Register here</Link>
                            </p>

                            <form onSubmit={handleSubmit} className="w-100">
                                <div className="mb-3">
                                    <label htmlFor="firstname" className="form-label">First Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                                        id="firstname"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                    />
                                    {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lastname" className="form-label">Last Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                                        id="lastname"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                    />
                                    {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="birthDate" className="form-label">Birth Date *</label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.birthDate ? "is-invalid" : ""}`}
                                        id="birthDate"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                    />
                                    {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="gradeLevel" className="form-label">Grade Level (1-12) *</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.gradeLevel ? "is-invalid" : ""}`}
                                        id="gradeLevel"
                                        name="gradeLevel"
                                        min="0"
                                        max="12"
                                        value={formData.gradeLevel}
                                        onChange={handleChange}
                                    />
                                    {errors.gradeLevel && <div className="invalid-feedback">{errors.gradeLevel}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="schoolInfo" className="form-label">School Info *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.schoolInfo ? "is-invalid" : ""}`}
                                        id="schoolInfo"
                                        name="schoolInfo"
                                        value={formData.schoolInfo}
                                        onChange={handleChange}
                                    />
                                    {errors.schoolInfo && <div className="invalid-feedback">{errors.schoolInfo}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password *</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    {formData.password && formData.password.length < 6 && !errors.password && (
                                        <div className="form-text text-warning">Password must be at least 6 characters</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="repeatPassword" className="form-label">Repeat Password *</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.passwordMatch ? "is-invalid" : ""}`}
                                        id="repeatPassword"
                                        name="repeatPassword"
                                        value={formData.repeatPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.passwordMatch && <div className="invalid-feedback">{errors.passwordMatch}</div>}
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mt-3">
                                    Register as a Student
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudent;