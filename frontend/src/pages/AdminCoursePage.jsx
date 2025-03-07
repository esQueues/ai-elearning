import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Spinner, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AdminCoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all courses (public and private) from the backend
    const fetchCourses = async () => {
        try {
            const response = await axios.get('/api/courses/all', { withCredentials: true });
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setLoading( false);
        }
    };

    const approveCourse = async (id) => {
        try {
            await axios.patch(`/api/courses/${id}/approve`, {}, { withCredentials: true });
            fetchCourses(); // Refresh course list
        } catch (error) {
            console.error("Error approving course:", error);
        }
    };

    const disallowCourse = async (id) => {
        try {
            await axios.patch(`/api/courses/${id}/disallow`, {}, { withCredentials: true });
            fetchCourses(); // Refresh course list
        } catch (error) {
            console.error("Error making course private:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="mb-4 text-center">Admin Course Management</h1>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading courses...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Course Title</th>
                        <th>Teacher</th>
                        <th>Public</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>
                                <Link to={`/courses/${course.id}`}>{course.title}</Link>
                            </td>
                            <td>{course.teacher.firstname} {course.teacher.lastname}</td>
                            <td>{course.public ? 'Public' : 'Private'}</td>
                            <td>
                                {course.public ? (
                                    <Button variant="warning" onClick={() => disallowCourse(course.id)}>
                                        Make Private
                                    </Button>
                                ) : (
                                    <Button variant="success" onClick={() => approveCourse(course.id)}>
                                        Approve Course
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default AdminCoursePage;
