import React from "react";
import { Container, Grid, Typography, Box, Divider, IconButton, Link } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: "#333", color: "#fff", py: 4, mt: 5 }}>
            <Container maxWidth="lg">
                {/* 🔹 Верхняя часть футера */}
                <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                    {/* 🔹 Название платформы слева */}
                    <Grid item xs={12} sm={6} textAlign="left">
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box component="img" src="/logo2.png" alt="OZAT Logo" sx={{ height: 40 }} />
                            <Typography variant="h5" fontWeight="bold">OZAT</Typography>
                        </Box>
                    </Grid>

                    {/* 🔹 Четыре ссылки справа */}
                    <Grid item xs={12} sm={6} textAlign="right">
                        <Box display="flex" justifyContent="flex-end" gap={6}>
                            <Link href="/home" sx={linkStyle}>Home</Link>
                            <Link href="/courses" sx={linkStyle}>Catalog</Link>
                            <Link href="/teachers" sx={linkStyle}>Teachers</Link>
                            <Link href="/contactus" sx={linkStyle}>Contact Us</Link>
                        </Box>
                    </Grid>
                </Grid>

                {/* 🔹 Горизонтальная линия */}
                <Divider sx={{ my: 3, backgroundColor: "#777" }} />

                {/* 🔹 Нижняя часть футера */}
                <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                    {/* 🔹 Авторские права слева */}
                    <Grid item xs={12} sm={6} textAlign="left">
                        <Typography variant="body2">© 2025 OZAT. All rights reserved.</Typography>
                    </Grid>

                    {/* 🔹 Соцсети справа */}
                    <Grid item xs={12} sm={6} textAlign="right">
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <IconButton sx={iconStyle}><Facebook /></IconButton>
                            <IconButton sx={iconStyle}><Twitter /></IconButton>
                            <IconButton sx={iconStyle}><Instagram /></IconButton>
                            <IconButton sx={iconStyle}><LinkedIn /></IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

const linkStyle = { color: "#fff", textDecoration: "none", fontSize: "14px" };
const iconStyle = { color: "#fff", "&:hover": { color: "#8BC34A" } };

export default Footer;
