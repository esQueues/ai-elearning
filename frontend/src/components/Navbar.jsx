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
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/check-session', { withCredentials: true });

        if (response.status === 200) {
          const userResponse = await axios.get('/api/auth/user', { withCredentials: true });
          const userRole = userResponse.data.role;
          const profileEndpoint = userRole === 'TEACHER' ? '/api/teachers/profile' : '/api/student/profile';
          const profileResponse = await axios.get(profileEndpoint, { withCredentials: true });

          setRole(userRole);
          setUser(profileResponse.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setRole(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Removed location.pathname dependency to match old navbar

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout', { withCredentials: true }); // Changed to GET to match old navbar
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isActive = (path) => location.pathname === path;

  const dashboardLink = role === 'TEACHER' ? '/teacher-dashboard' : role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
  const profileLink = role === 'TEACHER' ? '/teachers/profile' : '/student/profile';

  if (loading) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 2 }}>
          <Typography>Loading...</Typography>
        </Box>
    );
  }

  return (
      <AppBar
          sx={{
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
          }}
      >
        <Toolbar sx={{ padding: 0, minHeight: '64px', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(dashboardLink)} sx={{ p: 0 }}>
              <img src="/logo.png" alt="Logo" style={{ height: '40px', cursor: 'pointer' }} />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              OZAT
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', alignItems: 'center', width: '100%', pr: 2 }}>
            {isAuthenticated && user && (
                <IconButton onClick={handleMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                    {user?.firstname} {user?.lastname}
                  </Typography>
                  <Avatar src={user?.avatar || '/default-avatar.png'} sx={{ cursor: 'pointer' }} />
                </IconButton>
            )}
            <IconButton onClick={() => setIsMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            <Button component={Link} to="/home" sx={{ fontWeight: isActive('/home') ? 'bold' : 'normal', color: isActive('/home') ? '#000' : '#555', textTransform: 'none' }}>
              Home
            </Button>
            <Button component={Link} to="/courses" sx={{ fontWeight: isActive('/courses') ? 'bold' : 'normal', color: isActive('/courses') ? '#000' : '#555', textTransform: 'none' }}>
              Catalog
            </Button>
            <Button component={Link} to={dashboardLink} sx={{ fontWeight: isActive(dashboardLink) ? 'bold' : 'normal', color: isActive(dashboardLink) ? '#000' : '#555', textTransform: 'none' }}>
              My Learning
            </Button>
            <Button component={Link} to="/teachers" sx={{ fontWeight: isActive('/teachers') ? 'bold' : 'normal', color: isActive('/teachers') ? '#000' : '#555', textTransform: 'none' }}>
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
              <ListItem sx={{ color: '#222' }} button component={Link} to="/home">
                Home
              </ListItem>
              <ListItem sx={{ color: '#222' }} button component={Link} to="/courses">
                Catalog
              </ListItem>
              <ListItem sx={{ color: '#222' }} button component={Link} to={dashboardLink}>
                My Learning
              </ListItem>
              <ListItem sx={{ color: '#222' }} button component={Link} to="/teachers">
                Teachers
              </ListItem>
              {isAuthenticated && user && (
                  <ListItem sx={{ color: '#222' }} button component={Link} to={profileLink}>
                    Profile
                  </ListItem>
              )}
            </List>
          </Drawer>

          {isAuthenticated && user ? (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ color: '#333', fontWeight: '500' }}>
                  {user.firstname} {user.lastname}
                </Typography>
                <IconButton onClick={handleMenuOpen}>
                  <Avatar src={user.avatar || '/default-avatar.png'} sx={{ cursor: 'pointer' }} />
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
                  <MenuItem component={Link} to={profileLink}>
                    Profile
                  </MenuItem>
                  {role === 'STUDENT' && (
                      <MenuItem component={Link} to="/completed-courses">
                        Completed Courses
                      </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
          ) : (
              <Button
                  onClick={() => navigate('/')}
                  sx={{
                    borderRadius: '50px',
                    border: '2px solid #007bff',
                    color: '#007bff',
                    textTransform: 'none',
                    padding: '5px 15px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { backgroundColor: '#007bff', color: '#ffffff' },
                  }}
              >
                Sign In
              </Button>
          )}
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;