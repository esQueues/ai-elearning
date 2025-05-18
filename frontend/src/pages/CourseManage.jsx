import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CourseManage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const defaultImage =
        "https://img.freepik.com/free-vector/student-with-laptop-studying-online-course_74855-5293.jpg";

    useEffect(() => {
        // Fetch course details
        axios
            .get(`/api/courses/${id}`, { withCredentials: true })
            .then((response) => {
                setCourse(response.data);
                setEditedTitle(response.data.title);
                setEditedDescription(response.data.description);
            })
            .catch((error) => console.error("Error fetching course:", error));

        // Fetch course profile image
        axios
            .get(`/api/courses/profile/image/${id}`, {
                withCredentials: true,
                responseType: "blob",
            })
            .then((imageResponse) => {
                const imageUrl = URL.createObjectURL(imageResponse.data);
                setProfileImage(imageUrl);
            })
            .catch((error) => {
                console.error("Error fetching course image:", error);
                setProfileImage(defaultImage);
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        // Fetch enrolled students
        axios
            .get(`/api/courses/${id}/students`, { withCredentials: true })
            .then((response) => setStudents(response.data))
            .catch((error) => console.error("Error fetching students:", error));
    }, [id]);

    // Clean up blob URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (profileImage && profileImage.startsWith("blob:")) {
                URL.revokeObjectURL(profileImage);
            }
        };
    }, [profileImage]);

    const handleDeleteCourse = () => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            axios
                .delete(`/api/courses/${id}`, { withCredentials: true })
                .then(() => navigate("/teacher-dashboard"))
                .catch((error) => console.error("Error deleting course:", error));
        }
    };

    const handleDeleteModule = (moduleId) => {
        axios
            .delete(`/api/courses/modules/${moduleId}`, { withCredentials: true })
            .then(() =>
                setCourse((prev) => ({
                    ...prev,
                    modules: prev.modules.filter((m) => m.id !== moduleId),
                }))
            )
            .catch((error) => console.error("Error deleting module:", error));
    };

    const handleDeleteLecture = (lectureId, moduleId) => {
        axios
            .delete(`/api/courses/modules/lecture/${lectureId}`, { withCredentials: true })
            .then(() =>
                setCourse((prev) => ({
                    ...prev,
                    modules: prev.modules.map((module) =>
                        module.id === moduleId
                            ? { ...module, lectures: module.lectures.filter((l) => l.id !== lectureId) }
                            : module
                    ),
                }))
            )
            .catch((error) => console.error("Error deleting lecture:", error));
    };

    const handleDeleteQuiz = (quizId, moduleId) => {
        axios
            .delete(`/api/modules/quizzes/${quizId}`, { withCredentials: true })
            .then(() =>
                setCourse((prev) => ({
                    ...prev,
                    modules: prev.modules.map((module) =>
                        module.id === moduleId
                            ? { ...module, quizzes: module.quizzes.filter((q) => q.id !== quizId) }
                            : module
                    ),
                }))
            )
            .catch((error) => console.error("Error deleting quiz:", error));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveCourse = () => {
        axios
            .put(
                `/api/courses/${id}`,
                { title: editedTitle, description: editedDescription },
                { withCredentials: true }
            )
            .then(() => {
                setCourse((prev) => ({ ...prev, title: editedTitle, description: editedDescription }));
                setIsEditing(false);
            })
            .catch((error) => console.error("Error updating course:", error));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleImageUpload = () => {
        if (!selectedFile) {
            alert("Please select an image file");
            return;
        }

        setImageUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        axios
            .post(`/api/courses/upload-image?id=${id}`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                // Fetch the updated image
                return axios.get(`/api/courses/profile/image/${id}`, {
                    withCredentials: true,
                    responseType: "blob",
                });
            })
            .then((imageResponse) => {
                const newImageUrl = URL.createObjectURL(imageResponse.data);
                setProfileImage(newImageUrl);
                setSelectedFile(null);
                alert("Course image uploaded successfully");
            })
            .catch((error) => {
                console.error("Error uploading course image:", error);
                alert(error.response?.data || "Error uploading course image");
            })
            .finally(() => setImageUploading(false));
    };

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!course) return <p className="text-center text-danger fs-5">Course not found.</p>;

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <img
                        src={profileImage || defaultImage}
                        alt={course.title}
                        className="rounded border me-3"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        onError={(e) => {
                            e.target.src = defaultImage;
                        }}
                    />
                    <div>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <textarea
                                    className="form-control mb-2"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                />
                                <button className="btn btn-success me-2" onClick={handleSaveCourse}>
                                    Save
                                </button>
                                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <h1 className="fw-bold">{course.title}</h1>
                                <p
                                    className={`fw-bold ${
                                        course.public ? "text-success" : "text-warning"
                                    }`}
                                >
                                    Status: {course.public ? "Published" : "Under Review"}
                                </p>
                                <p className="text-muted">{course.description}</p>
                                <button className="btn btn-warning" onClick={handleEditClick}>
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-3">
                    <input
                        type="file"
                        className="form-control mb-2"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button
                        className="btn btn-info"
                        onClick={handleImageUpload}
                        disabled={imageUploading}
                    >
                        {imageUploading ? "Uploading..." : "Upload Course Image"}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <Link to={`/courses/${id}/add-module`} className="btn btn-primary me-2">
                    Add Module
                </Link>
                <button className="btn btn-danger" onClick={handleDeleteCourse}>
                    Delete Course
                </button>
            </div>

            {course.modules.length === 0 ? (
                <p className="text-muted">No modules available.</p>
            ) : (
                <div className="accordion" id="courseAccordion">
                    {course.modules.map((module, index) => (
                        <div className="accordion-item" key={module.id}>
                            <h2 className="accordion-header" id={`heading${index}`}>
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${index}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${index}`}
                                >
                                    {module.title}
                                </button>
                            </h2>
                            <div
                                id={`collapse${index}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${index}`}
                                data-bs-parent="#courseAccordion"
                            >
                                <div className="accordion-body">
                                    <div className="d-flex justify-content-end mb-2">
                                        <Link
                                            to={`/modules/${module.id}/edit`}
                                            className="btn btn-sm btn-warning me-2"
                                        >
                                            Edit Module
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteModule(module.id)}
                                        >
                                            Delete Module
                                        </button>
                                    </div>
                                    <h5>Lectures</h5>
                                    {module.lectures.length > 0 ? (
                                        <ul className="list-group mb-3">
                                            {module.lectures.map((lecture) => (
                                                <li
                                                    key={lecture.id}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    {lecture.title}
                                                    <div>
                                                        <Link
                                                            to={`/lectures/${lecture.id}/edit`}
                                                            className="btn btn-sm btn-warning me-2"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() =>
                                                                handleDeleteLecture(lecture.id, module.id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted">No lectures available.</p>
                                    )}

                                    <h5>Quizzes</h5>
                                    {module.quizzes.length > 0 ? (
                                        <ul className="list-group mb-3">
                                            {module.quizzes.map((quiz) => (
                                                <li
                                                    key={quiz.id}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    {quiz.title}
                                                    <div>
                                                        <Link
                                                            to={`/quizzes/${quiz.id}/edit`}
                                                            className="btn btn-sm btn-warning me-2"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteQuiz(quiz.id, module.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted">No quizzes available.</p>
                                    )}

                                    <Link
                                        to={`/modules/${module.id}/add-lecture`}
                                        className="btn btn-success btn-sm me-2"
                                    >
                                        Add Lecture
                                    </Link>
                                    <Link
                                        to={`/modules/${module.id}/add-quiz`}
                                        className="btn btn-info btn-sm"
                                    >
                                        Add Quiz
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="mt-4">Enrolled Students</h2>
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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-muted">No students enrolled.</p>
            )}

            <div className="text-center mt-5">
                <Link to={`/courses/${id}`} className="btn btn-outline-primary">
                    Back to Course
                </Link>
            </div>
        </div>
    );
};

export default CourseManage;