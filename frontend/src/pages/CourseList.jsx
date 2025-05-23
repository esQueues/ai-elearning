import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const defaultImage =
        "https://sea-ac-ae.s3.me-south-1.amazonaws.com/wp-content/uploads/2024/06/19142849/Cover%402x.png";

    // Utility to get CSRF token from cookies
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        fetchCourses(debouncedQuery);
    }, [debouncedQuery]);

    const fetchCourses = (query) => {
        setLoading(true);
        axios
            .get(`/api/courses/all?query=${query}`, { withCredentials: true })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setCourses(response.data);
                    // Fetch profile images for each course
                    const imagePromises = response.data.map((course) =>
                        axios
                            .get(`/api/courses/profile/image/${course.id}`, {
                                withCredentials: true,
                                responseType: "blob",
                            })
                            .then((imageResponse) => ({
                                id: course.id,
                                url: URL.createObjectURL(imageResponse.data),
                            }))
                            .catch(() => ({
                                id: course.id,
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
                    setCourses([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setCourses([]);
            })
            .finally(() => setLoading(false));
    };

    // Clean up blob URLs
    useEffect(() => {
        return () => {
            Object.values(profileImages).forEach((url) => {
                if (url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [profileImages]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDownloadCertificate = async (courseId) => {
        try {
            const response = await axios.get(`/api/courses/certificate/${courseId}`, {
                withCredentials: true,
                responseType: "blob",
                headers: {
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
                },
            });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `certificate_${courseId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading certificate:", error);
            alert(error.response?.data?.error || "Failed to download certificate");
        }
    };

    if (loading) {
        return <div className="text-center fs-4 fw-semibold mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 fw-bold text-primary">📚 Explore Courses</h1>

            {/* Search Bar */}
            <div className="d-flex justify-content-center mb-4">
                <div className="input-group w-50 shadow-lg rounded">
                    <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button
                        className="btn btn-primary fw-bold"
                        onClick={() => fetchCourses(searchQuery)}
                    >
                        🔍 Search
                    </button>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center">
                    <p className="text-muted">No courses available at the moment.</p>
                </div>
            ) : (
                <div className="row g-4 justify-content-center">
                    {courses.map((course) => (
                        <div key={course.id} className="col-lg-4 col-md-6 col-sm-12">
                            <div
                                className="card h-100 shadow-sm border-0"
                                style={{ position: "relative", overflow: "hidden" }}
                            >
                                <div
                                    style={{ position: "relative" }}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.querySelector(".overlay").style.opacity = 1)
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.querySelector(".overlay").style.opacity = 0)
                                    }
                                >
                                    <img
                                        src={profileImages[course.id] || defaultImage}
                                        alt="Course Banner"
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                        onError={(e) => {
                                            e.target.src = defaultImage;
                                        }}
                                    />
                                    <div
                                        className="overlay d-flex align-items-center justify-content-center"
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                            width: "100%",
                                            height: "100%",
                                            transition: "opacity 0.5s ease",
                                            opacity: 0,
                                        }}
                                    >
                                        <h5 className="text-light fw-bold">{course.title}</h5>
                                    </div>
                                </div>

                                <div className="card-body text-center">
                                    <h5 className="card-title text-dark fw-bold">{course.title}</h5>
                                    <p className="card-text text-muted mb-2">
                                        <i className="fas fa-user"></i> Teacher:{" "}
                                        {course.teacher?.firstname ?? "Unknown"}{" "}
                                        {course.teacher?.lastname ?? ""}
                                    </p>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Link to={`/courses/${course.id}`} className="btn btn-outline-primary fw-bold">
                                            View Course
                                        </Link>
                                        {course.completed && (
                                            <button
                                                className="btn btn-success fw-bold"
                                                onClick={() => handleDownloadCertificate(course.id)}
                                            >
                                                Download Certificate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;