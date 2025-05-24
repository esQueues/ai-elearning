import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box } from "@mui/material";

const Dashboard = () => {
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [courseImages, setCourseImages] = useState({}); 
    const [loading, setLoading] = useState(true);

    const defaultImage =
        "https://allea.org/wp-content/uploads/2019/06/shutterstock_520698799small.jpg";

    useEffect(() => {
    axios.get("/api/courses/my-courses", { withCredentials: true })
        .then((response) => {
            setCourses(response.data);

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

                setProfileImages(teacherImages); 
                setCourseImages(courseImages); 
            });

        })
        .catch((error) => console.error("Error fetching courses:", error))
        .finally(() => setLoading(false));
}, []);

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
                width: "90%", 
                maxWidth: 1200,
                margin: "20px auto", 
                borderRadius: "30px", 
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", 
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
                    borderRadius: "20px",
                }}
            />
        </Box>
        <h2 className="text-center fw-semibold mt-5 mb-5" style={{ color: "#333", fontSize: "28px" }}> Keep Learning </h2>

        <div className="d-flex flex-column align-items-center gap-4">
            {courses.map((course) => (
                <div key={course.id} className="w-100 d-flex align-items-stretch position-relative shadow-sm"
                    style={{
                        width: "90%",   
                        maxWidth: "1200px",  
                        border: "1px solid #ccc",  
                        borderRadius: "30px",  
                        transition: "0.3s ease",
                        backgroundColor: "white",
                        margin: "0 auto",
                        padding: "0",
                        marginBottom: "40px"
                    }}
                    onMouseOver={(e) => { 
                        e.currentTarget.style.backgroundColor = "#E8F5E9";  

                        const title = e.currentTarget.querySelector(".course-title");  
                        if (title) title.style.color = "#4CAF50";  

                        const btn = e.currentTarget.querySelector(".continue-btn");  
                        if (btn) {
                            btn.style.backgroundColor = "#4CAF50";  
                            btn.style.color = "#fff";  
                        }

                        const progressBar = e.currentTarget.querySelector(".progress");  
                        if (progressBar) {
                            progressBar.style.backgroundColor = "#fff";  
                        }
                    }}
                    onMouseOut={(e) => { 
                        e.currentTarget.style.backgroundColor = "white";  

                        const title = e.currentTarget.querySelector(".course-title");  
                        if (title) title.style.color = "#212529";  

                        const btn = e.currentTarget.querySelector(".continue-btn");  
                        if (btn) {
                            btn.style.backgroundColor = "transparent";  
                            btn.style.color = "#8BC34A";  
                        }

                        const progressBar = e.currentTarget.querySelector(".progress");  
                        if (progressBar) {
                            progressBar.style.backgroundColor = "#e9ecef";  
                        }
                    }}
                >

                    <div style={{ flex: "none", display: "flex", width: "40%", margin: "0", padding: "0" }}>  
                        <img src={courseImages[course.id] || defaultImage}  
                            alt="Course Banner"
                            className="shadow-sm"
                            style={{ 
                                width: "100%", 
                                height: "100%", 
                                objectFit: "cover", 
                                borderRadius: "30px", 
                                margin: "0", 
                                padding: "0", 
                                display: "block" 
                            }}  
                            onError={(e) => { e.target.src = defaultImage; }}
                        />
                    </div>

                    <div className="flex-grow-1 px-4 py-3">
                        <h5 className="fw-bold course-title">{course.title}</h5>  
                        <p className="text-muted small mb-2"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,  
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
                                src={profileImages[course.teacher.id] || defaultImage}  
                                alt="Teacher Avatar"
                                className="rounded-circle border"  
                                style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}  
                                onError={(e) => { e.target.src = defaultImage; }}
                            />
                            <p className="card-text text-dark mb-0">
                                {course.teacher?.firstname ?? "Unknown"} {course.teacher?.lastname ?? ""}
                            </p>
                        </div>

                        <div className="progress mt-3"
                            style={{
                                height: "12px", 
                                backgroundColor: "#E0E0E0", 
                                borderRadius: "10px", 
                                border: "2px solid #ccc", 
                                overflow: "hidden",
                                position: "relative",
                                transition: "0.3s ease" 
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = "#fff"; }} 
                            onMouseOut={(e) => { e.target.style.backgroundColor = "#E0E0E0"; }} 
                        >
                            <div className="progress-bar" role="progressbar"
                                style={{
                                    width: `${course.progress}%`, 
                                    backgroundColor: "#4CAF50",
                                    borderRadius: "10px"
                                }}
                                aria-valuenow={course.progress} aria-valuemin="0" aria-valuemax="100"
                            ></div>
                        </div>
                        <p className="text-center mt-1 small text-muted">
                            {course.progress.toFixed(2)}% completed
                        </p>

                    </div>

                    <Link to={`/courses/${course.id}`} className="text-decoration-none position-absolute"  
                        style={{ top: "16px", right: "16px" }}>
                        <button className="btn fw-bold rounded-pill px-4 py-2 continue-btn"
                            style={{
                                border: "2px solid #8BC34A",
                                color: "#8BC34A",
                                backgroundColor: "transparent",
                                transition: "0.3s ease"
                            }}
                        >
                            Continue
                        </button>
                    </Link>
                </div>
            ))}
        </div>

    </div>
);

};

export default Dashboard;