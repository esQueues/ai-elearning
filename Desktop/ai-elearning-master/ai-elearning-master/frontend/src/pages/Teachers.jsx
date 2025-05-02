import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/teachers")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setTeachers(response.data);
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
            <h1 className="text-center mb-4 fw-bold">Teachers</h1>
            <div className="row g-4 justify-content-center">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="col-lg-4 col-md-6 col-sm-12">
                        <Link to={`/teachers/public/${teacher.id}`} className="text-decoration-none">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="position-relative text-center p-3">
                                    {/* Teacher Image */}
                                    <img
                                        src="https://img.freepik.com/premium-vector/girl-holding-pencil-picture-girl-holding-book_1013341-447639.jpg?semt=ais_hybrid"
                                        alt="Teacher"
                                        className="rounded-circle"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="card-title text-dark fw-bold">{teacher.firstname} {teacher.lastname}</h5>
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
