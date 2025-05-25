import React, { useEffect, useState } from "react";
import axios from "axios";

const CompletedCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/courses/my-courses/completed", { withCredentials: true })
            .then(response => {
                setCourses(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error loading completed courses");
                setLoading(false);
            });
    }, []);

    const downloadCertificate = (course) => {
        axios.get(`/api/courses/certificate?courseId=${course.id}`, { responseType: "blob", withCredentials: true })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `certificate_${course.id}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(() => {
                setError("Error generating the certificate");
            });
    };

    if (loading) return <p className="text-center mt-4">Loading...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">🏆 Completed courses</h1>
            {courses.length === 0 ? (
                <p className="text-center">You don't have any completed courses yet.</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {courses.map(course => (
                        <div key={course.id} className="col">
                            {/* 🔹 Контейнер курса (обновлен стиль) */}
                            <div className="card h-100 shadow-sm rounded-4"
                                style={{
                                    border: "1px solid #ccc",  // ✅ Тонкая светло-серая граница
                                    borderRadius: "20px",  // ✅ Мягкие углы
                                    transition: "0.3s ease",
                                    backgroundColor: "white"
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#E8F5E9"; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
                            >
                                <div className="card-body position-relative">
                                    <h5 className="card-title fw-bold text-center">{course.title}</h5>
                                    <p className="card-text text-muted">{course.description}</p>

                                    {/* 🔹 Бейдж с процентом */}
                                    <span className={`badge ${course.progress === 100 ? "bg-warning text-dark" : "bg-primary"} position-absolute top-0 start-50 translate-middle`}>
                                        {course.progress === 100 ? "🏅 100% score" : `${course.progress}% Оценка`}
                                    </span>

                                    {/* 🔹 Кнопки (обновлен стиль) */}
                                    <a href={`/courses/${course.id}`} className="btn w-100 mt-3 rounded-pill"
                                       style={{ border: "2px solid #8BC34A", color: "#8BC34A", backgroundColor: "transparent", transition: "0.3s ease" }}>
                                        Go to the course
                                    </a>
                                    {course.progress === 100 && (
                                        <button
                                            className="btn w-100 mt-2 rounded-pill text-white"
                                            style={{ backgroundColor: "#8BC34A", transition: "0.3s ease" }}
                                            onClick={() => downloadCertificate(course)}
                                        >
                                            Download the certificate
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedCoursesPage;