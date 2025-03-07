import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const StudentProfilePage = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Using useNavigate instead of useHistory

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`/api/student/${id}`, { withCredentials: true });
                setStudent(response.data);
            } catch (error) {
                console.error("Error fetching student profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    const handleDeleteStudent = async () => {
        try {
            await axios.delete(`/api/student/${id}`, { withCredentials: true });
            navigate('/admin/students'); // Redirect to the admin students list after deletion
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>{student ? `${student.firstname} ${student.lastname}'s Profile` : "Profile"}</h1>
            {student ? (
                <div>
                    <div className="mb-4">
                        <h4>Student Information</h4>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>First Name:</strong> {student.firstname}</p>
                        <p><strong>Last Name:</strong> {student.lastname}</p>
                        <p><strong>Grade Level:</strong> {student.gradeLevel}</p>
                        <p><strong>School Info:</strong> {student.schoolInfo}</p>
                        <p><strong>Birthday:</strong> {student.birthday}</p>
                        <button
                            className="btn btn-danger"
                            onClick={handleDeleteStudent}
                        >
                            Delete Student
                        </button>
                    </div>

                    <div>
                        <h4>Enrolled Courses</h4>
                        {student.enrolledCourses.length > 0 ? (
                            <table className="table table-striped">
                                <thead className="table-dark">
                                <tr>
                                    <th>Course Title</th>
                                    <th>Teacher</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {student.enrolledCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>{course.teacher.firstname} {course.teacher.lastname}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No courses enrolled.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>Student not found.</p>
            )}
        </div>
    );
};

export default StudentProfilePage;
