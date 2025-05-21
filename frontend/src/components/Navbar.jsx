import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, IconButton, Button, Drawer, List, ListItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../img/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <AppBar sx={{
      backgroundColor: scrolled ? '#fbfbfb' : '#ffffff',
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
      marginBottom: '0',
    }}>
      <Toolbar sx={{ padding: 0, minHeight: '64px', justifyContent: 'space-between' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/home')} sx={{ p: 0 }}>
            <img src={logo} alt="Logo" style={{ height: '40px', cursor: 'pointer' }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            EDUPULSE
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', alignItems: 'center', width: '100%', pr: 2 }}>
        {isAuthenticated && student && (
            <IconButton onClick={handleMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                {student?.firstname} {student?.lastname}
            </Typography>
            <Avatar src={student?.avatar || '/default-avatar.png'} sx={{ cursor: 'pointer' }} />
            </IconButton>
        )}

        <IconButton onClick={() => setIsMobileMenuOpen(true)}>
            <MenuIcon />
        </IconButton>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
          <Button component={Link} to="/home" sx={{ fontWeight: isActive("/home") ? 'bold' : 'normal', color: isActive("/home") ? "#000" : "#555", textTransform: 'none' }}>
            Home
          </Button>
          <Button component={Link} to="/courses" sx={{ fontWeight: isActive("/courses") ? 'bold' : 'normal', color: isActive("/courses") ? "#000" : "#555", textTransform: 'none' }}>
            Catalog
          </Button>
          <Button component={Link} to="/dashboard" sx={{ fontWeight: isActive("/dashboard") ? 'bold' : 'normal', color: isActive("/dashboard") ? "#000" : "#555", textTransform: 'none' }}>
            My Learning
          </Button>
          <Button component={Link} to="/teachers" sx={{ fontWeight: isActive("/teachers") ? 'bold' : 'normal', color: isActive("/teachers") ? "#000" : "#555", textTransform: 'none' }}>
            Teachers
          </Button>
        </Box>

        <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sx={{
            '& .MuiPaper-root': {
            borderRadius: '20px 0px 0px 20px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
            width: '280px',
            padding: '16px',
            animation: 'slideIn 0.3s ease-in-out',
            },
        }}
        >
        <List sx={{ width: 250 }}>
            <ListItem sx={{ color: '#222' }} button component={Link} to="/home">Home</ListItem>
            <ListItem sx={{ color: '#222' }} button component={Link} to="/courses">Catalog</ListItem>
            <ListItem sx={{ color: '#222' }} button component={Link} to="/dashboard">My Learning</ListItem>
            <ListItem sx={{ color: '#222' }} button component={Link} to="/teachers">Teachers</ListItem>
        </List>

        </Drawer>

        {isAuthenticated && student ? (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
              {student.firstname} {student.lastname}
            </Typography>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={student.avatar || ''} sx={{ cursor: 'pointer' }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                    '& .MuiPaper-root': {
                    borderRadius: '12px',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                    padding: '8px',
                    animation: 'fadeIn 0.3s ease-in-out',
                    },
                }}
                >
              <MenuItem component={Link} to="/student/profile">Profile</MenuItem>
              <MenuItem component={Link} to="/completed-courses">Completed Courses</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button onClick={() => navigate('/')} sx={{
            borderRadius: '50px',
            border: '2px solid #007bff',
            color: '#007bff',
            textTransform: 'none',
            padding: '5px 15px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease-in-out',
            '&:hover': { backgroundColor: '#007bff', color: '#ffffff' },
          }}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
