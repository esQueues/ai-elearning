import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { styled } from '@mui/system';
import logo from '../img/logo.png';

const NavbarContainer = styled(AppBar)(({ scrolled }) => ({
  backgroundColor: scrolled ? '#e0e0e0' : '#ffffff', 
  borderRadius: '0px', 
  padding: scrolled ? '5px 15px' : '10px 20px', 
  boxShadow: scrolled ? '0px 4px 12px rgba(0, 0, 0, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.15)', 
  position: 'fixed',
  top: '0px', 
  left: '0px', 
  right: '0px', 
  width: '100%', 
  zIndex: 1100,
  transition: 'all 0.3s ease-in-out',
}));

const LoginButton = styled(Button)({
  borderRadius: '50px',
  border: '2px solid #007bff',
  color: '#007bff',
  textTransform: 'none',
  padding: '5px 15px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#007bff',
    color: '#ffffff',
  },
});

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [student, setStudent] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        axios.get("/api/student/profile", { withCredentials: true })
            .then(response => {
                setStudent(response.data);
                setIsAuthenticated(true);
            })
            .catch(() => setIsAuthenticated(false));

        const handleScroll = () => {
            setScrolled(window.scrollY > 50); 
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await axios.put('/api/auth/logout', {}, { withCredentials: true });
        setIsAuthenticated(false);
        setStudent(null);
        navigate('/');
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const isActive = (path) => location.pathname === path;

    return (
        <NavbarContainer scrolled={scrolled}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo +  EDUPULSE */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/home')} sx={{ p: 0 }}>
                        <img src={logo} alt="Logo" style={{ height: '40px', cursor: 'pointer' }} />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        EDUPULSE
                    </Typography>
                </Box>

                {/* Links */}
                <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexGrow: 1 }}>
                    <Button component={Link} to="/home" variant="text" 
                        sx={{ fontWeight: isActive("/home") ? 'bold' : 'normal', color: isActive("/home") ? "#000" : "#555", textTransform: 'none' }}>
                        Home
                    </Button>
                    <Button component={Link} to="/courses" variant="text" 
                        sx={{ fontWeight: isActive("/courses") ? 'bold' : 'normal', color: isActive("/courses") ? "#000" : "#555", textTransform: 'none' }}>
                        Catalog
                    </Button>
                    <Button component={Link} to="/dashboard" variant="text" 
                        sx={{ fontWeight: isActive("/dashboard") ? 'bold' : 'normal', color: isActive("/dashboard") ? "#000" : "#555", textTransform: 'none' }}>
                        My Learning
                    </Button>
                    <Button component={Link} to="/teachers" variant="text" 
                        sx={{ fontWeight: isActive("/teachers") ? 'bold' : 'normal', color: isActive("/teachers") ? "#000" : "#555", textTransform: 'none' }}>
                        Teachers
                    </Button>
                </Box>

                {/* User Profile */}
                {isAuthenticated && student ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                            {student.firstname} {student.lastname}
                        </Typography>
                        <IconButton onClick={handleMenuOpen}>
                            <Avatar src={student.avatar || ''} sx={{ cursor: 'pointer' }} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem component={Link} to="/student/profile">Profile</MenuItem>
                            <MenuItem component={Link} to="/completed-courses">Completed Courses</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>Logout</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    /* Button Log In */
                    <LoginButton onClick={() => navigate('/')}>
                        Sign In
                    </LoginButton>
                )}
            </Toolbar>
        </NavbarContainer>
    );
};

export default Navbar;
