    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import { Link } from "react-router-dom";

    const TeachersManagement = () => {
        const [teachers, setTeachers] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchTeachers = async () => {
                try {
                    const response = await axios.get("/api/teachers", { withCredentials: true });
                    setTeachers(response.data);
                } catch (error) {
                    console.error("Error fetching teachers:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTeachers();
        }, []);

        const handleDelete = async (teacherId) => {
            try {
                await axios.delete(`/api/teachers/${teacherId}`, { withCredentials: true });
                setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
            } catch (error) {
                console.error("Error deleting teacher:", error);
            }
        };

        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <div className="container">
                <h1>Manage Teachers</h1>
                {teachers.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td>{teacher.id}</td>
                                    <td>{teacher.firstname}</td>
                                    <td>{teacher.lastname}</td>
                                    <td>{teacher.email}</td>
                                    <td>
                                        <Link to={`/admin/teachers/${teacher.id}`} className="btn btn-info me-2">
                                            View Profile
                                        </Link>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(teacher.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-muted">No teachers.</p>
                )}
            </div>
        );
    };

    export default TeachersManagement;