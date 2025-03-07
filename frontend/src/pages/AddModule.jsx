import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddModule = () => {
    const { id } = useParams(); // Course ID
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if (!e.target.value.trim()) {
            setError("Module title cannot be empty.");
        } else {
            setError(""); // Clear error if title is valid
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Module title cannot be empty.");
            return;
        }

        try {
            await axios.post(
                `/api/courses/${id}/modules`,
                { title },
                { withCredentials: true }
            );
            navigate(`/courses/${id}/manage`);
        } catch (err) {
            setError("Error adding module. Please try again.");
            console.error("Error adding module:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="fw-bold">Add Module</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Module Title</label>
                    <input
                        type="text"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={!title.trim()}>Add Module</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(`/courses/${id}/manage`)}>Cancel</button>
            </form>
        </div>
    );
};

export default AddModule;
