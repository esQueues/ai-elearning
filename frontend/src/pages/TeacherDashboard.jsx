import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Spinner, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch courses from the backend
    const fetchCourses = async () => {
        try {
            const response = await axios.get('/api/teachers/courses', { withCredentials: true });
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError('Failed to fetch courses');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="mb-4 text-center">Teacher Dashboard</h1>
            <div className="text-center mb-4">
                <Link to="/courses/create">
                    <Button variant="success">+ Create Course</Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading courses...</p>
                </div>
            ) : error ? (
                <div className="text-center text-danger">
                    <p>{error}</p>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Course Title</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>
                                <Link to={`/courses/${course.id}`}>{course.title}</Link>
                            </td>
                            <td>
                                <Link to={`/courses/${course.id}/manage`}>
                                    <Button variant="info">Manage</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default TeacherDashboard;