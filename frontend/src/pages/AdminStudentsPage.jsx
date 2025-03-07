import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("/api/student/all", { withCredentials: true });
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Handle delete student
    const handleDelete = async (studentId) => {
        try {
            await axios.delete(`/api/student/${studentId}`, { withCredentials: true });
            // Update the students list after deletion
            setStudents(students.filter(student => student.id !== studentId));
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    // Render loading or students list
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>Manage Students</h1>
            {students.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>School Info</th>
                            <th>Grade</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.email}</td>
                                <td>{student.firstname}</td>
                                <td>{student.lastname}</td>
                                <td>{student.schoolInfo}</td>
                                <td>{student.gradeLevel}</td>
                                <td>
                                    <Link to={`/admin/students/${student.id}`} className="btn btn-info me-2">
                                        View Profile
                                    </Link>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(student.id)}
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
                <p className="text-muted">No students.</p>
            )}
        </div>
    );
};

export default AdminStudentsPage;
