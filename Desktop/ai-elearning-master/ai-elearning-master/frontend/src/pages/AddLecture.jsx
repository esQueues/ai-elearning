import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddLecture = () => {
    const { id } = useParams(); // moduleId from URL
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [urlError, setUrlError] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if (!e.target.value.trim()) {
            setError("Lecture title cannot be empty.");
        } else {
            setError(null);
        }
    };

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+[/#?]?.*$/;
        if (newUrl && !urlPattern.test(newUrl)) {
            setUrlError("Invalid URL format.");
        } else {
            setUrlError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Lecture title cannot be empty.");
            return;
        }
        if (!url.trim() || urlError) {
            setUrlError("Please enter a valid URL.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `/api/courses/modules/${id}/lectures`,
                { title, url },
                { withCredentials: true }
            );

            const courseId = response.data.courseId;
            navigate(`/courses/${courseId}/manage`);
        } catch (err) {
            console.error("Error adding lecture:", err);
            setError("Failed to add lecture. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        const match = url.match(
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        );
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Add Lecture</h1>
            {error && <p className="text-danger text-center">{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="mb-3">
                    <label className="form-label">Lecture Title</label>
                    <input
                        type="text"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter lecture title"
                        required
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>

                {/* URL Input */}
                <div className="mb-3">
                    <label className="form-label">Lecture URL</label>
                    <input
                        type="url"
                        className={`form-control ${urlError ? "is-invalid" : ""}`}
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="Enter lecture URL"
                        required
                    />
                    {urlError && <div className="invalid-feedback">{urlError}</div>}
                </div>

                {url && !urlError && (
                    <div className="mb-3">
                        <label className="form-label">Preview</label>
                        <div className="border p-2 bg-light">
                            {getYouTubeEmbedUrl(url) ? (
                                // Embed YouTube Video
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={getYouTubeEmbedUrl(url)}
                                    title="YouTube Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Lecture"}
                </button>
            </form>
        </div>
    );
};

export default AddLecture;
