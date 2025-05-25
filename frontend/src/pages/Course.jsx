import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Course = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [courseImages, setCourseImages] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [teacherImage, setTeacherImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(null);

    const defaultCourseImage =
        "https://sea-ac-ae.s3.me-south-1.amazonaws.com/wp-content/uploads/2024/06/19142849/Cover%402x.png";
    const defaultTeacherImage =
        "https://img.freepik.com/premium-vector/girl-holding-pencil-picture-girl-holding-book_1013341-447639.jpg?semt=ais_hybrid";

        useEffect(() => {
            axios.get(`/api/courses/${id}`, { withCredentials: true })
                .then((response) => {
                    setCourse(response.data);
                    setEnrolled(response.data.enrolled);

                    if (response.data.teacher?.id) {
                        axios.get(`/api/teachers/profile/image/${response.data.teacher.id}`, {
                            withCredentials: true,
                            responseType: "blob",
                        })
                        .then((imageResponse) => {
                            setTeacherImage(URL.createObjectURL(imageResponse.data));
                        })
                        .catch(() => {
                            setTeacherImage(defaultTeacherImage);
                        });
                    } else {
                        setTeacherImage(defaultTeacherImage);
                    }
                })
                .catch(() => {
                    setTeacherImage(defaultTeacherImage);
                });

            const courseImagePromise = axios.get(`/api/courses/profile/image/${id}`, {
                withCredentials: true,
                responseType: "blob",
            })
            .then((imageResponse) => ({
                id,
                url: URL.createObjectURL(imageResponse.data),
            }))
            .catch(() => ({
                id,
                url: defaultCourseImage,
            }));

            Promise.resolve(courseImagePromise).then((courseImg) => {
                setCourseImages((prevImages) => ({
                    ...prevImages,
                    [id]: courseImg.url,
                }));
            }).finally(() => setLoading(false));  
        }, [id]);

        useEffect(() => {
            return () => {
                Object.values(courseImages).forEach((url) => {
                    if (url.startsWith("blob:")) {
                        URL.revokeObjectURL(url);
                    }
                });

                if (teacherImage && teacherImage.startsWith("blob:")) {
                    URL.revokeObjectURL(teacherImage);
                }
            };
        }, [courseImages, teacherImage]);




        if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
        if (!course) return <p className="text-center text-danger fs-5">Course not found.</p>;

        const handleEnroll = () => {
            axios.post(`/api/courses/${id}/enroll`, {}, { withCredentials: true })
                .then(() => setEnrolled(true))
                .catch((error) => console.error("Error enrolling in course:", error));
        };


    return (
        <div className="container mt-5 mb-3">
            <div className="d-flex align-items-center shadow-sm"
                style={{
                    width: "90%",
                    maxWidth: "1200px",
                    border: "1px solid #ccc",
                    borderRadius: "30px",
                    padding: "20px",
                    backgroundColor: "white",
                    margin: "0 auto",
                        padding: "0",
                    transition: "0.3s ease"
                }}
            >
                 <div style={{ flex: "1", display: "flex", borderRadius: "30px", overflow: "hidden", padding: "0", margin: "0" }}>  
                    <img src={courseImages[id] || defaultCourseImage}  
                        alt="Course Banner"
                        className="shadow-sm"
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "30px", margin: "0", padding: "0", display: "block"}}  
                        onError={(e) => { e.target.src = defaultCourseImage; }}
                    />
                </div>

                <div className="flex-grow-1 px-4">
                    <h2 className="fw-bold">{course.title}</h2>  
                    <p className="text-secondary"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%"
                        }}
                    >
                        {course.description}
                    </p>

                    <div className="d-flex align-items-center">
                        <img  
                            src={teacherImage || defaultTeacherImage}  
                            alt="Teacher Avatar"
                            className="rounded-circle border"  
                            style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "12px" }}  
                            onError={(e) => { e.target.src = defaultTeacherImage; }}
                        />
                        <p className="text-dark fw-semibold mb-0">
                            {course.teacher?.firstname} {course.teacher?.lastname}
                        </p>
                    </div>
                </div>
            </div>


            {enrolled !== null && !enrolled && (
                <div className="text-center my-4">
                    <button
                        className="btn btn-success btn-lg px-5 py-2 rounded-pill"
                        onClick={handleEnroll}
                    >
                        ✅ Enroll in Course
                    </button>
                </div>
            )}

            <div className="accordion shadow-sm rounded-4 p-3"
                        id="courseAccordion"
                        style={{
                            width: "90%",
                            maxWidth: "1200px",
                            border: "1px solid #ccc",
                            borderRadius: "30px",
                            backgroundColor: "#E6F4EA",
                            margin: "40px auto",
                            transition: "0.3s ease"
                        }}
                    >
                {course.modules.length === 0 ? (
                    <p className="text-center text-muted">No modules available.</p>
                ) : course.modules.map((module, index) => {
                            const previousPassed =
                                index === 0 ||
                                course.modules[index - 1].quizzes.every((quiz) => quiz.passed);
                            const allQuizzesPassed = module.quizzes.every((quiz) => quiz.passed);
                            const isLocked = !enrolled || (!previousPassed && !allQuizzesPassed);

                            return (
                             <div
                                key={module.id}
                                className="accordion-item shadow-sm rounded-4 bg-light border border-light p-3"
                                style={{ borderRadius: "20px", marginBottom: "10px" }} 
                            >

                                    <h2 className="accordion-header" id={`heading${index}`}>
                                        <button
                                            className={`accordion-button fw-bold d-flex align-items-center justify-content-between border-secondary ${
                                                isLocked ? "disabled text-muted" : "bg-white text-dark"
                                            }`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                            aria-expanded={!isLocked}
                                            aria-controls={`collapse${index}`}
                                            disabled={isLocked}
                                            style={{ fontSize: "18px", fontWeight: "bold", borderRadius: "20px" }}
                                        >
                                    
                                            <span className="d-flex align-items-center">
                                                {isLocked ? (
                                                    <span className="fw-bold text-secondary me-3" style={{ fontSize: "22px" }}>
                                                        🔒
                                                    </span>
                                                ) : module.progress === 100 ? (
                                                    <span className="fw-bold text-success me-3" style={{ fontSize: "22px" }}>
                                                        ✅
                                                    </span>
                                                ) : (
                                                    <span className="fw-bold text-success me-3" style={{ fontSize: "16px" }}>
                                                        {Math.round(module.progress)}%
                                                    </span>
                                                )}
                                            </span>

                                            <span className="border-end border-secondary" style={{ height: "22px", marginRight: "10px" }}></span>

                                            <span className="d-flex align-items-center">
                                                <span
                                                    className={`fw-bold fs-5 ${isLocked ? "text-secondary" : "text-success"}`} 
                                                >
                                                    Module {index + 1}:
                                                </span>
                                                &nbsp; {module.title}
                                            </span>
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className={`accordion-collapse collapse ${isLocked ? "d-none" : ""}`}
                                        aria-labelledby={`heading${index}`}
                                        data-bs-parent="#courseAccordion"
                                    >
                                        <div className="accordion-body border border-light rounded-4 p-3">
                                            {module.lectures.length > 0 && (
                                                <div className="mb-3 rounded-4">
                                                    <h5 className="fw-bold text-dark d-flex align-items-center">
                                                        <i className="bi bi-play-circle-fill me-2"></i> 
                                                        Lectures
                                                    </h5>
                                                    <ul className="list-group">
                                                        {module.lectures.map((lecture) => (
                                                            <li key={lecture.id}
                                                                className="list-group-item rounded-4 border border-secondary"
                                                                style={{
                                                                    transition: "0.3s ease",
                                                                    backgroundColor: "#FFFFFF", 
                                                                }}
                                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#E6F4EA"} 
                                                                onMouseLeave={(e) => e.target.style.backgroundColor = "#FFFFFF"} 
                                                            >
                                                                <Link to={`/lectures/${lecture.id}`} className="text-decoration-none text-dark">
                                                                    {lecture.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {module.quizzes.length > 0 && (
                                                <div className ="mb-3 rounded-4">
                                                    <h5 className="fw-bold text-dark d-flex align-items-center">
                                                        <i className="bi bi-clipboard2-check-fill me-2"></i> 
                                                        Quizzes
                                                    </h5>
                                                    <ul className="list-group">
                                                        {module.quizzes.map((quiz) => (
                                                            <li key={quiz.id}
                                                                className="list-group-item rounded-4 border border-secondary"
                                                                style={{
                                                                    transition: "0.3s ease",
                                                                    backgroundColor: "#FFFFFF", 
                                                                }}
                                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#E6F4EA"} 
                                                                onMouseLeave={(e) => e.target.style.backgroundColor = "#FFFFFF"} 
                                                            >
                                                                <Link to={`/quiz/${quiz.id}/profile`} className="text-decoration-none text-dark">
                                                                    {quiz.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {module.lectures.length === 0 && module.quizzes.length === 0 && (
                                                <p className="text-muted">No lectures or quizzes available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>     
            </div>
    );
};

export default Course;