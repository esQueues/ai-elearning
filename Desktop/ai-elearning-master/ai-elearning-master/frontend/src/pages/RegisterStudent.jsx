import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Paper, Box, CssBaseline, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../img/logo.png"; // Your logo

const theme = createTheme();

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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Paper elevation={6} sx={{ width: "95%", maxWidth: "750px", padding: 5 }}>
                    <Grid container>
                        {/* Left Side - Logo */}
                        <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={logo} alt="Logo" style={{ width: "80%", maxWidth: "250px" }} />
                        </Grid>

                        {/* Right Side - Registration Form */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography component="h1" variant="h5">
                                    Register as Student
                                </Typography>
                                <Box component="form" onSubmit={handleRegister} sx={{ mt: 2, width: "100%" }}>
                                    <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <TextField label="Password" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <TextField label="First Name" type="text" fullWidth required value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                    <TextField label="Last Name" type="text" fullWidth required value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                    <TextField label="Birth Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                                    <TextField label="Grade Level" type="number" fullWidth required value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
                                    <TextField label="School Info" type="text" fullWidth required value={schoolInfo} onChange={(e) => setSchoolInfo(e.target.value)} />
                                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                        Register as Student
                                    </Button>
                                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                        Are you a teacher? <Link to="/register/teacher">Register here</Link>
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default RegisterStudent;
