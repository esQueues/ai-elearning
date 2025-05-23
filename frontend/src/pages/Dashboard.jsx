import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box } from "@mui/material";

const Dashboard = () => {
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [courseImages, setCourseImages] = useState({}); // Добавляем состояние для картинок курсов
    const [loading, setLoading] = useState(true);

    const defaultImage =
        "https://allea.org/wp-content/uploads/2019/06/shutterstock_520698799small.jpg";

    useEffect(() => {
    axios.get("/api/courses/my-courses", { withCredentials: true })
        .then((response) => {
            setCourses(response.data);

            // Запрос на аватарку преподавателя и картинку курса
            const imagePromises = response.data.map((course) => {
                const teacherImagePromise = axios.get(`/api/teachers/profile/image/${course.teacher.id}`, {
                    withCredentials: true,
                    responseType: "blob",
                })
                .then((imageResponse) => ({
                    id: course.teacher.id,
                    url: URL.createObjectURL(imageResponse.data),
                }))
                .catch(() => ({
                    id: course.teacher.id,
                    url: defaultImage,
                }));

                const courseImagePromise = axios.get(`/api/courses/profile/image/${course.id}`, {
                    withCredentials: true,
                    responseType: "blob",
                })
                .then((imageResponse) => ({
                    id: course.id,
                    url: URL.createObjectURL(imageResponse.data),
                }))
                .catch(() => ({
                    id: course.id,
                    url: defaultImage,
                }));

                return Promise.all([teacherImagePromise, courseImagePromise]);
            });

            Promise.all(imagePromises).then((imageResults) => {
                const teacherImages = {};
                const courseImages = {};

                imageResults.forEach(([teacherImg, courseImg]) => {
                    teacherImages[teacherImg.id] = teacherImg.url;
                    courseImages[courseImg.id] = courseImg.url;
                });

                setProfileImages(teacherImages); // Аватарки преподавателей
                setCourseImages(courseImages); // Картинки курсов
            });

        })
        .catch((error) => console.error("Error fetching courses:", error))
        .finally(() => setLoading(false));
}, []);

    // Clean up blob URLs
    useEffect(() => {
    return () => {
        [...Object.values(profileImages), ...Object.values(courseImages)].forEach((url) => {
            if (url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
            }
        });
    };
    }, [profileImages, courseImages]);


    if (loading) return <p className="text-center fs-4 fw-semibold mt-4">Loading...</p>;

    return (
        <div>
            <Box
                sx={{
                    width: "90%", // Отступы слева и справа
                    maxWidth: 1200,
                    margin: "20px auto", // Центрирование и отступ сверху/снизу
                    borderRadius: "30px", // Округленные края
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Легкая тень
                    overflow: "hidden",
                }}
            >
                <Box
                    component="img"
                    src="/dashboard.png"
                    alt="Dashboard Banner"
                    sx={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "20px", // Округление краев
                    }}
                />
            </Box>

            <h1 className="text-center mb-4 fw-bold">My Courses</h1>

            {courses.length === 0 ? (
                <div className="text-center">
                    <p className="text-muted">You haven't enrolled in any courses yet.</p>
                    <Link to="/courses" className="btn btn-primary">
                        Browse Courses
                    </Link>
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
                                            src={courseImages[course.id] || defaultImage}
                                            alt="Course Banner"
                                            className="card-img-top"
                                            style={{ height: "150px", objectFit: "cover" }}
                                            onError={(e) => {
                                                e.target.src = defaultImage;
                                            }}
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title text-dark fw-bold">
                                            {course.title}
                                        </h5>
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={profileImages[course.teacher.id] || defaultImage} 
                                                alt="Teacher Avatar"
                                                className="rounded-circle border"
                                                style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
                                                onError={(e) => { e.target.src = defaultImage; }}
                                            />
                                            <p className="card-text text-muted mb-2">
                                                {course.teacher?.firstname ?? "Unknown"} {course.teacher?.lastname ?? ""}
                                            </p>
                                        </div>

                                        {/* Progress */}
                                        <div className="progress mt-3" style={{ height: "10px" }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${course.progress}%` }}
                                                aria-valuenow={course.progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                        <p className="text-center mt-1 small text-muted">
                                            {course.progress.toFixed(2)}% completed
                                        </p>
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