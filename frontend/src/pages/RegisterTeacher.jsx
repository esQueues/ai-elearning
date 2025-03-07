import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterTeacher = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [bio, setBio] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/auth/register/teacher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, firstname, lastname, bio }),
        });

        if (response.ok) {
            alert("Teacher registered successfully!");
            navigate("/");
        } else {
            alert("Teacher registration failed.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register as Teacher</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} required />
                <button type="submit">Register as Teacher</button>
            </form>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", marginTop: "50px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" }
};

export default RegisterTeacher;
