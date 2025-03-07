import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddCourse = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !description.trim()) {
            setError("Title and description cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/courses", { title, description }, { withCredentials: true });

            // Передаем флаг courseAdded в state
            navigate("/teacher-dashboard",
                { state: { courseAdded: true } });
        } catch (err) {
            setError("Error creating course. Please try again.");
            console.error("Error creating course:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Create a New Course</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Course Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Course Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Course"}
                </button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/teacher-dashboard")}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddCourse;
