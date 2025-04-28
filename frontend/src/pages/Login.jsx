import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Typography, CssBaseline, Box, Alert, Paper, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../img/logo.png"; // Your logo

const theme = createTheme();

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
            alert("Login successful!");
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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Paper elevation={6} sx={{ width: "95%", maxWidth: "750px", padding: 5 }}>
                    <Grid container>
                        {/* Left Side - Logo */}
                        <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={logo} alt="Logo" style={{ width: "80%", maxWidth: "250px" }} />
                        </Grid>

                        {/* Right Side - Login Form */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography component="h1" variant="h5">
                                    Sign In
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
                                    {error && <Alert severity="error">{error}</Alert>}
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                        Sign In
                                    </Button>
                                    <Typography variant="body2" align="center">
                                        Don't have an account? <Link to="/register/student">Register here</Link>
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

export default Login;
