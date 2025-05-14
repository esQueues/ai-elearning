import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";

const RegisterTeacher = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        repeatPassword: "",
        bio: "",
        documents: [],
        profilePhoto: null
    });
    const [errors, setErrors] = useState({});
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData(prev => {
            let newValue;
            if (name === "documents") {
                newValue = files ? Array.from(files) : [];
            } else {
                newValue = files ? files[0] : value;
            }

            const newFormData = {
                ...prev,
                [name]: newValue
            };

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

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.firstname) validationErrors.firstname = "First Name is required";
        if (!formData.lastname) validationErrors.lastname = "Last Name is required";
        if (!formData.email) validationErrors.email = "Email is required";
        if (!formData.email.includes("@")) validationErrors.email = "Email must contain @";
        if (!formData.password) validationErrors.password = "Password is required";
        if (formData.password.length < 6) validationErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.repeatPassword) {
            validationErrors.passwordMatch = "Password do not match";
        }
        if (!formData.bio) validationErrors.bio = "Biography is required";
        if (formData.documents.length === 0) validationErrors.documents = "At least one document is required";
        if (!formData.profilePhoto) validationErrors.profilePhoto = "Profile photo is required";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formDataToSend = new FormData();


        for (const key in formData) {
            if (key !== "documents" && formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        }

        // Добавляем каждый документ отдельно
        formData.documents.forEach((doc, index) => {
            formDataToSend.append(`documents`, doc);
        });

        try {
            const response = await fetch("/api/auth/register/teacher", {
                method: "POST",
                body: formDataToSend
            });

            if (response.ok) {
                alert("Teacher registered successfully!");
                navigate("/");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Teacher registration failed.");
            }
        } catch (err) {
            alert("Network error. Please try again.");
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
                            <h2 className="card-title text-center mb-1">Register as a Teacher</h2>
                            <p className="text-center mb-4">
                                Are you a student? <Link to="/register/student">Register here</Link>
                            </p>

                            <form onSubmit={handleSubmit} className="w-100">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
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

                                    <div className="col-md-6 mb-3">
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

                                <div className="row">
                                    <div className="col-md-6 mb-3">
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

                                    <div className="col-md-6 mb-3">
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
                                        {passwordMatchMessage && !errors.passwordMatch && (
                                            <div className="form-text text-success">{passwordMatchMessage}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Biography (Education & Awards) *</label>
                                    <textarea
                                        className={`form-control ${errors.bio ? "is-invalid" : ""}`}
                                        id="bio"
                                        name="bio"
                                        rows="4"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="documents" className="form-label">Document Upload (for verification) *</label>
                                    <input
                                        type="file"
                                        className={`form-control ${errors.documents ? "is-invalid" : ""}`}
                                        id="documents"
                                        name="documents"
                                        onChange={handleChange}
                                        multiple
                                    />
                                    {errors.documents && <div className="invalid-feedback">{errors.documents}</div>}
                                    {formData.documents.length > 0 && (
                                        <div className="form-text">
                                            Selected files: {formData.documents.map(doc => doc.name).join(', ')}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="profilePhoto" className="form-label">Profile Photo *</label>
                                    <input
                                        type="file"
                                        className={`form-control ${errors.profilePhoto ? "is-invalid" : ""}`}
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        onChange={handleChange}
                                    />
                                    {errors.profilePhoto && <div className="invalid-feedback">{errors.profilePhoto}</div>}
                                    {formData.profilePhoto && (
                                        <div className="form-text">Selected file: {formData.profilePhoto.name}</div>
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