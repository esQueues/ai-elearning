import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";

const Dashboard = () => {
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [courseImages, setCourseImages] = useState({});
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Message sent successfully!");
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    const baseContainerSx = {
        width: "90%",
        maxWidth: 1200,
        margin: "20px auto",
        borderRadius: "30px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
        overflow: "hidden",
    };

    const contactSectionContainerSx = {
        ...baseContainerSx,
        marginTop: "40px",
        padding: "50px", 
        borderRadius: "20px",
        border: "1px solid #ccc",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        gap: "40px",
        flexWrap: "wrap",
        backgroundColor: "#fff",
    };

    const contactDetailTextSx = {
        color: "#444",
        lineHeight: 1.5,
        fontWeight: 'bold',
    };

    return (
        <div>
            {/* First Container: Dashboard Image */}
            <Box sx={baseContainerSx}>
                <Box
                    component="img"
                    src="/dashboard.png"
                    alt="Dashboard Banner"
                    sx={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "20px",
                    }}
                />
            </Box>

            {/* Second Container: Contact Us Section */}
            <Box sx={contactSectionContainerSx}>
                {/* Left side: Description & Contact Info */}
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 300px' } }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        mb={3} 
                        sx={{
                            fontWeight: "600",
                            color: "#333",
                            fontSize: { xs: "2rem", sm: "2.5rem" }
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        variant="body1"
                        paragraph
                        mb={3} // Equivalent to marginBottom: '24px'
                        sx={{ color: "#555" }}
                    >
                        We’d love to hear from you! If you have any questions, suggestions, or need support, feel
                        free to reach out to us using the details below or by filling out the contact form.
                    </Typography>
                    <Stack spacing={0.5} sx={{mt:2}}> {/* Use Stack for email/phone with small spacing */}
                        <Typography variant="body2" sx={contactDetailTextSx}>
                            <span style={{ marginRight: "10px" }}>📧</span> Email: support_ozat@gmail.com
                        </Typography>
                        <Typography variant="body2" sx={contactDetailTextSx}>
                            <span style={{ marginRight: "10px" }}>📞</span> Phone: +7 (777) 777 77 77
                        </Typography>
                    </Stack>
                </Box>

                {/* Right side: Contact Form */}
                <Box
                    component="form"
                    onSubmit={handleFormSubmit}
                    sx={{
                        flex: { xs: '1 1 100%', sm: '1.5 1 350px' },
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        variant="outlined"
                        size="medium"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        variant="outlined"
                        size="medium"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                    />
                    <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleFormChange}
                        required
                        variant="outlined"
                        size="medium"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        multiline
                        rows={6}
                        required
                        variant="outlined"
                        size="medium"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: "#e0e0e0",
                            color: "#333",
                            "&:hover": {
                                backgroundColor: "#d0d0d0",
                            },
                            alignSelf: "flex-start",
                            px: 3,
                            py: 1.5,
                            borderRadius: "8px",
                            boxShadow: "none"
                        }}
                    >
                        Send Message
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default Dashboard;