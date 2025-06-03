import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Lecture = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState(null);

    useEffect(() => {
        axios
            .get(`/api/courses/modules/lectures/${id}`, { withCredentials: true })
            .then((response) => {
                setLecture(response.data);

                // Fetch module data using moduleId from lecture
                return axios.get(`/api/courses/modules/${response.data.moduleId}`, { withCredentials: true });
            })
            .then((response) => {
                console.log("Module data:", response.data);
                setModule(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleQuizClick = (quiz) => {
        // Check if there’s a last attempt
        axios.get(`/api/modules/quizzes/${quiz.id}/attempt`, { withCredentials: true })
            .then((response) => {
                if (response.data?.attemptId) {
                    // If an attempt exists, go to quiz profile
                    navigate(`/quiz/${quiz.id}/profile`);
                } else if (quiz.passed) {
                    // If no attempt but passed (edge case), go to profile
                    navigate(`/quiz/${quiz.id}/profile`);
                } else {
                    // If no attempt and not passed, show alert
                    const message = `This quiz requires a passing score of ${quiz.passingScore}%. You have ${quiz.durationInMinutes} minute(s) to complete it. Are you ready to start?`;
                    if (window.confirm(message)) {
                        navigate(`/quiz/${quiz.id}`);
                    }
                }
            })
            .catch((error) => {
                console.error("Error checking attempt:", error);
                // Fallback to alert if attempt check fails
                const message = `This quiz requires a passing score of ${quiz.passingScore}%. You have ${quiz.durationInMinutes} minute(s) to complete it. Are you ready to start?`;
                if (window.confirm(message)) {
                    navigate(`/quiz/${quiz.id}`);
                }
            });
    };

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!lecture) return <p className="text-center text-danger fs-5">Lecture not found.</p>;

    // Function to extract YouTube video ID
    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getYouTubeVideoId(lecture.url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            {/* Main container with border and increased size */}
            <div className="shadow-sm rounded-4 border border-light d-flex flex-column align-items-center justify-content-between"
                 style={{
                     width: "85%",
                     maxWidth: "1050px",
                     height: "90%",
                     backgroundColor: "#E6F4EA",
                     padding: "15px 50px",
                     marginBottom: "40px"
                 }}
            >
                {/* Lecture title (centered, inside container, at the top) */}
                <h2 className="text-center fw-semibold">{lecture.title}</h2>

                {/* Video (centered in container) */}
                <div className="ratio ratio-16x9 w-100">
                    <iframe
                        src={embedUrl}
                        title={lecture.title}
                        allowFullScreen
                        className="rounded shadow-sm"
                    ></iframe>
                </div>

                {/* Buttons inside container, at the bottom left and right */}
                <div className="d-flex justify-content-between w-100 mt-3 px-3">
                    <button
                        className="btn btn-secondary rounded-pill px-4 py-2 d-flex align-items-center"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i> Back
                    </button>

                    {module?.quizzes && module.quizzes.length > 0 && (
                        <button
                            className="btn text-white rounded-pill px-4 py-2 d-flex align-items-center"
                            style={{ backgroundColor: "#8BC34A" }}
                            onClick={() => handleQuizClick(module.quizzes[0])}
                        >
                            Quiz {module.quizzes[0].passed && <span className="ms-2">✅</span>}
                            <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lecture;