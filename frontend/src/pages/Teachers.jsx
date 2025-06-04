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
                    width: "90%", 
                    maxWidth: 1200,
                    margin: "20px auto", 
                    borderRadius: "30px",  
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",  
                    overflow: "hidden",
                    border: "1px solid #ccc" /* ✅ Тонкая серо-светлая граница */
                }}
            >
                <Box
                    component="img"
                    src="/dashboard.png"
                    alt="Teachers Banner"
                    sx={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "20px",  
                    }}
                />
            </Box>

            <h2 className="text-center fw-semibold mt-5 mb-5" style={{ color: "#333", fontSize: "28px" }}> Teachers </h2>

            <div className="row g-4 justify-content-center mb-4">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="col-lg-4 col-md-6 col-sm-12">
                        <Link to={`/teachers/public/${teacher.id}`} className="text-decoration-none">
                            <div className="card h-100 shadow-sm rounded-4"
                                style={{
                                    border: "1px solid #ccc",  
                                    borderRadius: "20px",  
                                    transition: "0.3s ease",
                                    backgroundColor: "white"
                                }}
                                onMouseOver={(e) => { 
                                    e.currentTarget.style.backgroundColor = "#E8F5E9";  

                                    const name = e.currentTarget.querySelector(".teacher-name");  
                                    if (name) name.style.color = "#4CAF50";  

                                    const btn = e.currentTarget.querySelector(".view-profile-btn");  
                                    if (btn) {
                                        btn.style.backgroundColor = "#4CAF50";  
                                        btn.style.color = "#fff";  
                                    }
                                }}
                                onMouseOut={(e) => { 
                                    e.currentTarget.style.backgroundColor = "white";  

                                    const name = e.currentTarget.querySelector(".teacher-name");  
                                    if (name) name.style.color = "#212529";  

                                    const btn = e.currentTarget.querySelector(".view-profile-btn");  
                                    if (btn) {
                                        btn.style.backgroundColor = "transparent";  
                                        btn.style.color = "#8BC34A";  
                                    }
                                }}
                            >
                                <div className="position-relative text-center p-3">
                                    <img
                                        src={profileImages[teacher.id] || defaultImage}
                                        alt={`${teacher.firstname} ${teacher.lastname}`}
                                        className="rounded-circle border shadow-sm"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                        onError={(e) => { e.target.src = defaultImage; }}
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="card-title fw-bold teacher-name">{teacher.firstname} {teacher.lastname}</h5>
                                    <p className="card-text text-muted mb-2"><i className="fas fa-envelope"></i> {teacher.email}</p>

                                    {/* 🔹 Кнопка "View Profile" */}
                                    <div className="text-center mt-3">
                                        <Link to={`/teachers/public/${teacher.id}`} className="text-decoration-none">
                                            <button className="btn fw-bold rounded-pill px-4 py-2 view-profile-btn"
                                                style={{
                                                    border: "2px solid #8BC34A",
                                                    color: "#8BC34A",
                                                    backgroundColor: "transparent",
                                                    transition: "0.3s ease"
                                                }}
                                            >
                                                View Profile
                                            </button>
                                        </Link>
                                    </div>
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