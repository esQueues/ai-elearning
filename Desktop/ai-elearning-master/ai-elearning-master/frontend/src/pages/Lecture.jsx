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

    // Function to extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getYouTubeVideoId(lecture.url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title fw-bold">{lecture.title}</h2>
                    {videoId ? (
                        <div className="ratio ratio-16x9 mt-3">
                            <iframe
                                src={embedUrl}
                                title={lecture.title}
                                allowFullScreen
                                className="rounded shadow-sm"
                            ></iframe>
                        </div>
                    ) : (
                        <p className="text-danger">Invalid video link</p>
                    )}
                    <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Артқа</button>
                </div>
            </div>
        </div>
    );
};

export default Lecture;
