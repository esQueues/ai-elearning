import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";

const RegisterStudent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");
    const [schoolInfo, setSchoolInfo] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, firstname, lastname, birthDate, gradeLevel, schoolInfo }),
        });

        if (response.ok) {
            alert("Student registered successfully!");
            navigate("/");
        } else {
            alert("Student registration failed.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                <input type="number" placeholder="Grade Level" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} required />
                <input type="text" placeholder="School Info" value={schoolInfo} onChange={(e) => setSchoolInfo(e.target.value)} required />
                <button type="submit">Register as Student</button>
            </form>
            <p>Are you teacher? <Link to="/register/teacher">Register here</Link></p>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", marginTop: "50px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" }
};

export default RegisterStudent;
