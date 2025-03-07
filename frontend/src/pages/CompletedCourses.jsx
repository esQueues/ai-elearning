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
                setError("Ошибка загрузки завершённых курсов");
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-4">Загрузка...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">🏆 Завершённые курсы</h1>
            {courses.length === 0 ? (
                <p className="text-center">У вас пока нет завершённых курсов.</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {courses.map(course => (
                        <div key={course.id} className="col">
                            <div className="card h-100 shadow-sm border-primary">
                                <div className="card-body position-relative">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text text-muted">{course.description}</p>

                                    {/* Бейдж с процентом */}
                                    <span className={`badge ${course.progress === 100 ? "bg-warning text-dark" : "bg-primary"} position-absolute top-0 start-50 translate-middle`}>
                                        {course.progress === 100 ? "🏅 100% Оценка" : `${course.progress}% Оценка`}
                                    </span>

                                    <a href={`/courses/${course.id}`} className="btn btn-outline-primary w-100 mt-3">Перейти к курсу</a>
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
