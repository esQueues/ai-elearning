import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            alert("Login successful!");

            if (data.userRole === "TEACHER") {
                navigate("/teacher-dashboard");
            } else if (data.userRole === "ADMIN") {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
        } else {
            alert("Invalid email or password.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register/student">Register here</Link></p>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", marginTop: "50px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" }
};

export default Login;