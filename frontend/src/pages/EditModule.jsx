import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditModule = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [module, setModule] = useState({ title: "" });

    useEffect(() => {
        axios.get(`/api/courses/modules/${moduleId}`, { withCredentials: true })
            .then(response => setModule(response.data))
            .catch(error => console.error("Error fetching module:", error));
    }, [moduleId]);

    const handleChange = (e) => {
        setModule({ ...module, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/courses/modules/${moduleId}`, module, { withCredentials: true })
            .then(() => navigate(-1)) // Navigate back after updating
            .catch(error => console.error("Error updating module:", error));
    };

    return (
        <div className="container mt-4">
            <h2>Edit Module</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" name="title" value={module.title} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditModule;
