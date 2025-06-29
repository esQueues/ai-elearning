import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Box, Typography, Button } from '@mui/material';
import styled from '@mui/system/styled';

const RoundedContainer = styled(Box)({
  borderRadius: '30px',
  backgroundColor: '#f9f9f9',
  padding: '30px',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
});

const CourseImage = styled('img')({
  width: '100%',
  height: '380px',
  objectFit: 'cover',
  borderRadius: '20px',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
  '@media (max-width: 768px)': {
    height: '280px',
  },
});

const SeeMoreButton = styled(Button)({
  borderRadius: '30px',
  border: '1.5px solid #333',
  color: '#333',
  backgroundColor: 'white',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: '400',
  padding: '6px 14px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#333',
    color: '#fff',
  },
});

const AboutSection = styled(Box)({
  width: '100%',
  padding: '60px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AboutImage = styled('img')({
  width: '100%',
  maxWidth: '400px',
  borderRadius: '20px',
  objectFit: 'cover',
});

const AboutText = styled(Box)({
  width: '50%',
  textAlign: 'left',
});

const AboutTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '20px',
});

const AboutDescription = styled(Typography)({
  fontSize: '18px',
  fontWeight: '400',
  color: '#444',
});

const Home = () => {
  return (
      <Box sx={{ backgroundColor: '#F6F5FA', minHeight: 'auto' }}>
        <Navbar />

        <Box sx={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          padding: '20px 0',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{
              width: '80%',
              height: '250px',
              borderRadius: '30px',
              margin: "20px auto",
              overflow: 'hidden',
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
            }}>
              <img src="/home_first_container.png" alt="Home First Container"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Box>

          <Box sx={{ height: '80px' }} />

          <Box sx={{
            width: '80%',
            backgroundColor: '#E8E8F4',
            borderRadius: '30px',
            border: '1px solid #CDCBCB',
            padding: '30px',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
            margin: 'auto',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: '500', fontSize: '19px' }}>
                Top courses you may like:
              </Typography>
              <SeeMoreButton component={Link} to="/courses">
                See more →
              </SeeMoreButton>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Link to="/courses">
                  <CourseImage src="/home_top3.png" alt="Course 1" />
                </Link>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Link to="/courses">
                  <CourseImage src="/home_top1.png" alt="Course 2" />
                </Link>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Link to="/courses">
                  <CourseImage src="/home_top2.png" alt="Course 3" />
                </Link>
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 12, mb: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: '400' }}>ABOUT US</Typography>
          </Box>
        </Box>

        <Box sx={{
          width: '100%',
          backgroundColor: '#E8E8F4',
          display: 'flex',
          padding: '60px 0',
          justifyContent: 'center',
          marginBottom: '0 !important'
        }}>
          <Box sx={{
            width: '90%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' },
            alignItems: 'center',
            gap: { xs: '20px', md: '40px' },
            padding: { xs: '30px', md: '60px' },
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Box sx={{ flex: 1 }}>
              <img src="/home_aboutus.png" alt="About Us" style={{
                width: '80%',
                borderRadius: '20px',
                objectFit: 'cover',
              }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '20px', sm: '24px', md: '36px' } }}>
                Empower your learning with our AI-Powered education platform
              </Typography>

              <Typography variant="body1" sx={{ color: '#444', mb: 4 }}>
                Our platform helps students improve academic performance through interactive quizzes and instant AI-generated feedback.
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', alignSelf: 'flex-start', textAlign: 'left' }}>
                  OUR MISSION:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', alignSelf: 'flex-start' }}>
                  OUR VISION:
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', gridAutoFlow: 'row', alignItems: 'start', width: '100%' }}>
                <Typography variant="body1" sx={{ color: '#444', flex: 1, Width: '100%' }}>
                  To enhance supplementary education through personalized, AI-driven learning experiences with real-time quiz feedback for every student.
                </Typography>
                <Typography variant="body1" sx={{ color: '#444', flex: 1, Width: '100%' }}>
                  To become the leading online platform delivering adaptive, smart, and effective supplementary education for learners worldwide.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
  );
}

export default Home;