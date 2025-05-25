import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Lecture = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`/api/courses/modules/lectures/${id}`, { withCredentials: true })
            .then((response) => {
                console.log("Lecture data:", response.data); // ✅ Проверяем, передаётся ли quizId
                setLecture(response.data);
            })
            .catch((error) => {
                console.error("Error fetching lecture details:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!lecture) return <p className="text-center text-danger fs-5">Lecture not found.</p>;

    // Функция извлечения ID YouTube видео
    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getYouTubeVideoId(lecture.url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            {/* 🔹 Главный контейнер с границей и увеличенным размером */}
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
                {/* 🔹 Название лекции (по центру, внутри контейнера, сверху) */}
                <h2 className="text-center fw-semibold">{lecture.title}</h2>

                {/* 🔹 Видео (по центру контейнера) */}
                <div className="ratio ratio-16x9 w-100">
                    <iframe
                        src={embedUrl}
                        title={lecture.title}
                        allowFullScreen
                        className="rounded shadow-sm"
                    ></iframe>
                </div>

                {/* 🔹 Кнопки внутри контейнера, внизу слева и справа */}
                <div className="d-flex justify-content-between w-100 mt-3 px-3">
                    <button
                        className="btn btn-secondary rounded-pill px-4 py-2 d-flex align-items-center"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i> Back
                    </button>

                    {lecture.quizId !== undefined && lecture.quizId !== null && (
                        <button
                            className="btn text-white rounded-pill px-4 py-2 d-flex align-items-center"
                            style={{ backgroundColor: "#A6D9A4" }}
                            onClick={() => navigate(`/quiz/${lecture.quizId}`)} // ✅ Теперь кнопка ведёт на страницу квиза
                        >
                            Quiz <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lecture;
