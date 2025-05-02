import React from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Typography } from "@mui/material";

const Footer = () => {
    return (
        <footer style={{ background: "#212121", color: "#fff", padding: "20px 0", marginTop: "40px" }}>
            <Container maxWidth="lg">
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={4} textAlign="center">
                        <Typography variant="h6">E-learning</Typography>
                        <Typography variant="body2">Enhancing education with AI-powered feedback</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} textAlign="center">
                        <Typography variant="h6">Quick Links</Typography>
                        <Link to="/about" style={linkStyle}>About</Link> |
                        <Link to="/courses" style={linkStyle}>Courses</Link> |
                        <Link to="/contact" style={linkStyle}>Contact</Link>
                    </Grid>
                    <Grid item xs={12} sm={4} textAlign="center">
                        <Typography variant="h6">Follow Us</Typography>
                        <Typography variant="body2">
                            <a href="#" style={linkStyle}>Facebook</a> |
                            <a href="#" style={linkStyle}>Twitter</a> |
                            <a href="#" style={linkStyle}>LinkedIn</a>
                        </Typography>
                    </Grid>
                </Grid>
                <Typography variant="body2" textAlign="center" style={{ marginTop: "10px" }}>
                    © {new Date().getFullYear()} Diploma. All rights reserved.
                </Typography>
            </Container>
        </footer>
    );
};

const linkStyle = { color: "#fff", textDecoration: "none", margin: "0 5px" };

export default Footer;
