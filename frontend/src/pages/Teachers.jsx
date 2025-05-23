import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultImage =
        "https://img.freepik.com/premium-vector/girl-holding-pencil-picture-girl-holding-book_1013341-447639.jpg?semt=ais_hybrid";

    useEffect(() => {
        // Fetch teachers list
        axios
            .get("/api/teachers", { withCredentials: true })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setTeachers(response.data);
                    // Fetch profile images for each teacher
                    const imagePromises = response.data.map((teacher) =>
                        axios
                            .get(`/api/teachers/profile/image/${teacher.id}`, {
                                withCredentials: true,
                                responseType: "blob",
                            })
                            .then((imageResponse) => ({
                                id: teacher.id,
                                url: URL.createObjectURL(imageResponse.data),
                            }))
                            .catch(() => ({
                                id: teacher.id,
                                url: defaultImage,
                            }))
                    );
                    Promise.all(imagePromises).then((imageResults) => {
                        const images = imageResults.reduce((acc, { id, url }) => {
                            acc[id] = url;
                            return acc;
                        }, {});
                        setProfileImages(images);
                    });
                } else {
                    console.error("Invalid data format:", response.data);
                    setTeachers([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching teachers:", error);
                setError("Failed to fetch teachers");
            })
            .finally(() => setLoading(false));
    }, []);

    // Clean up blob URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            Object.values(profileImages).forEach((url) => {
                if (url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [profileImages]);

    if (loading) {
        return <div className="text-center fs-4 fw-semibold mt-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger mt-4">{error}</div>;
    }

    if (teachers.length === 0) {
        return <div className="text-center mt-4">No teachers available.</div>;
    }

    return (
        <div className="container mt-4">
            <Box
                sx={{
                    width: "90%", // Отступы слева и справа
                    maxWidth: 1200,
                    margin: "20px auto", // Центрирование и отступ сверху/снизу
                    borderRadius: "30px", // Округленные края
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Легкая тень
                    overflow: "hidden",
                }}
            >
                <Box
                    component="img"
                    src="/dashboard.png" // Замени на нужную картинку
                    alt="Teachers Banner"
                    sx={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "20px", // Округление краев
                    }}
                />
            </Box>

            <h1 className="text-center mb-4 fw-bold">Teachers</h1>
            <div className="row g-4 justify-content-center">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="col-lg-4 col-md-6 col-sm-12">
                        <Link to={`/teachers/public/${teacher.id}`} className="text-decoration-none">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="position-relative text-center p-3">
                                    {/* Teacher Image */}
                                    <img
                                        src={profileImages[teacher.id] || defaultImage}
                                        alt={`${teacher.firstname} ${teacher.lastname}`}
                                        className="rounded-circle"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                        onError={(e) => {
                                            e.target.src = defaultImage;
                                        }}
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="card-title text-dark fw-bold">
                                        {teacher.firstname} {teacher.lastname}
                                    </h5>
                                    <p className="card-text text-muted mb-2">
                                        <i className="fas fa-envelope"></i> {teacher.email}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Teachers;