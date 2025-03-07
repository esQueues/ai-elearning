import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get("/api/quiz/feedback/all", { withCredentials: true })
            .then(response => {
                const sortedFeedbacks = response.data.sort((a, b) => new Date(b.attemptTime) - new Date(a.attemptTime));
                setFeedbacks(sortedFeedbacks);
            })
            .catch(error => {
                console.error("Error fetching feedbacks", error);
            });
    }, []);

    const [openFeedbackId, setOpenFeedbackId] = useState(null);

    const toggleFeedback = (id) => {
        if (openFeedbackId === id) {
            setOpenFeedbackId(null);
        } else {
            setOpenFeedbackId(id);
        }
    };

    const deleteFeedback = (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            axios.delete(`/api/quiz/feedback/${id}`, { withCredentials: true })
                .then(() => {
                    setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
                })
                .catch(error => {
                    console.error("Error deleting feedback", error);
                });
        }
    };

    return (
        <div className="container">
            <h1>Manage Feedbacks</h1>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Course Title</th>
                    <th>Quiz Title</th>
                    <th>Attempt Time</th>
                    <th>Show Feedback</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {feedbacks.map((feedback) => (
                    <tr key={feedback.id}>
                        <td>{feedback.id}</td>
                        <td>{`${feedback.studentFirstname} ${feedback.studentLastname}`}</td>
                        <td>{feedback.courseTitle}</td>
                        <td>{feedback.quizTitle || "N/A"}</td>
                        <td>{feedback.attemptTime}</td>
                        <td>
                            <button
                                className="btn btn-info"
                                onClick={() => toggleFeedback(feedback.id)}
                            >
                                {openFeedbackId === feedback.id ? "Hide Feedback" : "Show Feedback"}
                            </button>
                        </td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={() => deleteFeedback(feedback.id)}
                            >
                                Delete
                            </button>
                        </td>
                        {openFeedbackId === feedback.id && (
                            <tr>
                                <td colSpan="7">{feedback.feedbackText}</td>
                            </tr>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminFeedbacks;
