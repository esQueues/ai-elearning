import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
    const [setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/student/profile", { withCredentials: true })
            .then((response) => setStudent(response.data))
            .catch((error) => console.error("Error fetching student profile:", error));

        axios.get("/api/courses/my-courses", { withCredentials: true })
            .then((response) => {
                console.log("Courses response:", response.data);
                setCourses(response.data);
            })
            .catch((error) => console.error("Error fetching courses:", error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center fs-4 fw-semibold mt-4">Loading...</p>;

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 fw-bold">My Courses</h1>

            {courses.length === 0 ? (
                <div className="text-center">
                    <p className="text-muted">You haven't enrolled in any courses yet.</p>
                    <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                </div>
            ) : (
                <div className="row g-4 justify-content-center">
                    {courses.map((course) => (
                        <div key={course.id} className="col-lg-4 col-md-6 col-sm-12">
                            <Link to={`/courses/${course.id}`} className="text-decoration-none">
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="position-relative">
                                        {/* Course Image */}
                                        <img
                                            src={course.imageUrl || "https://allea.org/wp-content/uploads/2019/06/shutterstock_520698799small.jpg"}
                                            alt="Course Banner"
                                            className="card-img-top"
                                            style={{ height: "150px", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title text-dark fw-bold">{course.title}</h5>
                                        <p className="card-text text-muted mb-2">
                                            <i className="fas fa-user"></i> Teacher: {course.teacher?.firstname ?? "Unknown"} {course.teacher?.lastname ?? ""}
                                        </p>

                                        {/* Прогресс */}
                                        <div className="progress mt-3" style={{ height: "10px" }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${course.progress}%` }}
                                                aria-valuenow={course.progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                            </div>
                                        </div>
                                        <p className="text-center mt-1 small text-muted">{course.progress.toFixed(2)}% completed</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
