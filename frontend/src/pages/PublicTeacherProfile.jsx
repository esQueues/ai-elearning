import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PublicTeacherProfile = () => {
    const { teacherId } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [courseImages, setCourseImages] = useState({});
    const [loading, setLoading] = useState(true);

    const defaultTeacherImage =
        "https://img.freepik.com/premium-vector/girl-holding-pencil-picture-girl-holding-book_1013341-447639.jpg?semt=ais_hybrid";
    const defaultCourseImage =
        "https://img.freepik.com/free-vector/student-with-laptop-studying-online-course_74855-5293.jpg";

    useEffect(() => {
        // Fetch teacher profile
        axios
            .get(`/api/teachers/${teacherId}`, { withCredentials: true })
            .then((response) => {
                setTeacher(response.data);
                // Fetch course images
                if (response.data.createdCourses && response.data.createdCourses.length > 0) {
                    const imagePromises = response.data.createdCourses.map((course) =>
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
                                url: defaultCourseImage,
                            }))
                    );
                    Promise.all(imagePromises).then((imageResults) => {
                        const images = imageResults.reduce((acc, { id, url }) => {
                            acc[id] = url;
                            return acc;
                        }, {});
                        setCourseImages(images);
                    });
                }
            })
            .catch((error) => console.error("Error fetching teacher profile:", error));

        // Fetch teacher profile image
        axios
            .get(`/api/teachers/profile/image/${teacherId}`, {
                withCredentials: true,
                responseType: "blob",
            })
            .then((response) => {
                const imageUrl = URL.createObjectURL(response.data);
                setProfileImage(imageUrl);
            })
            .catch((error) => {
                console.error("Error fetching profile image:", error);
                setProfileImage(defaultTeacherImage);
            })
            .finally(() => setLoading(false));
    }, [teacherId]);

    // Cleanup image URLs
    useEffect(() => {
        return () => {
            if (profileImage && profileImage !== defaultTeacherImage) {
                URL.revokeObjectURL(profileImage);
            }
            Object.values(courseImages).forEach((url) => {
                if (url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [profileImage, courseImages]);

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!teacher) return <p className="text-center text-danger fs-5">Teacher not found.</p>;

    return (
        <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="card shadow-lg mb-4 p-4" style={{ borderRadius: "12px" }}>
                <div className="card-body d-flex align-items-center">
                    <img
                        src={profileImage || defaultTeacherImage}
                        alt="Teacher"
                        className="rounded-circle border p-2"
                        width="120"
                        height="120"
                    />
                    <div className="ms-4 w-100">
                        <h1 className="card-title fw-bold text-primary">
                            {teacher.firstname} {teacher.lastname}
                        </h1>
                        <p className="text-muted fs-5">{teacher.email}</p>
                        <div className="p-3 bg-light border rounded" style={{ maxWidth: "600px" }}>
                            <h5 className="fw-bold mb-2 text-secondary">About</h5>
                            <p className="fs-5 text-dark">{teacher.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-lg mb-4 p-4" style={{ borderRadius: "12px" }}>
                <div className="card-body">
                    <h2 className="card-title fw-bold text-secondary mb-4">
                        Courses Created by {teacher.firstname} {teacher.lastname}
                    </h2>
                    {teacher.createdCourses && teacher.createdCourses.length > 0 ? (
                        <div className="row g-4">
                            {teacher.createdCourses.map((course) => (
                                <div key={course.id} className="col-md-6">
                                    <Link to={`/courses/${course.id}`} className="text-decoration-none">
                                        <div className="card h-100 shadow-sm border-0">
                                            <img
                                                src={courseImages[course.id] || defaultCourseImage}
                                                alt="Course"
                                                className="card-img-top"
                                                style={{ height: "180px", objectFit: "cover" }}
                                                onError={(e) => {
                                                    e.target.src = defaultCourseImage;
                                                }}
                                            />
                                            <div className="card-header bg-secondary text-white">
                                                <h5 className="card-title fw-bold mb-0">
                                                    {course.title}
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <p className="card-text text-muted">
                                                    {course.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No courses available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicTeacherProfile;