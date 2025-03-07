import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditLecture = () => {
    const { lectureId } = useParams();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState(null); // Start with null to handle loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/courses/modules/lectures/${lectureId}`, { withCredentials: true })
            .then(response => {
                setLecture(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching lecture:", error);
                setLoading(false);
            });
    }, [lectureId]);

    const handleChange = (e) => {
        setLecture({ ...lecture, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/courses/modules/lectures/${lectureId}`, lecture, { withCredentials: true })
            .then(() => navigate(-1)) // Navigate back after updating
            .catch(error => console.error("Error updating lecture:", error));
    };

    if (loading) return <p className="text-center mt-4">Loading...</p>;
    if (!lecture) return <p className="text-center text-danger">Lecture not found.</p>;

    return (
        <div className="container mt-4">
            <h2>Edit Lecture</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={lecture.title || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                        className="form-control"
                        name="content"
                        value={lecture.url || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditLecture;
