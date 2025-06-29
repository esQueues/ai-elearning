import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuizProfile = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastAttempt, setLastAttempt] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [generatingFeedback, setGeneratingFeedback] = useState(false);
    const [courseId, setCourseId] = useState(null); // New state for course ID

    useEffect(() => {
        axios.get(`/api/modules/quizzes/${quizId}`, { withCredentials: true })
            .then((response) => {
                setQuiz(response.data);
                // Fetch module data to get course ID
                if (response.data.moduleId) {
                    return axios.get(`/api/courses/modules/${response.data.moduleId}`, { withCredentials: true });
                }
                return null;
            })
            .then((moduleResponse) => {
                if (moduleResponse && moduleResponse.data.courseId) {
                    setCourseId(moduleResponse.data.courseId);
                }
            })
            .catch((error) => console.error("Error fetching quiz or module:", error))
            .finally(() => setLoading(false));
    }, [quizId]);

    useEffect(() => {
        axios.get(`/api/modules/quizzes/${quizId}/attempt`, { withCredentials: true })
            .then((response) => {
                setLastAttempt(response.data);
                if (response.data?.attemptId) {
                    return axios.get(`/api/quiz/feedback/${response.data.attemptId}`, { withCredentials: true });
                }
                return null;
            })
            .then((feedbackResponse) => {
                if (feedbackResponse) {
                    setFeedback(feedbackResponse.data);
                }
            })
            .catch((error) => console.error("Error fetching attempt or feedback:", error));
    }, [quizId]);

    const handleGenerateFeedback = () => {
        if (!lastAttempt) return;
        setGeneratingFeedback(true);

        axios.post(`/api/quiz/feedback/${lastAttempt.attemptId}`, {}, { withCredentials: true })
            .then((response) => setFeedback(response.data))
            .catch((error) => console.error("Error generating feedback:", error))
            .finally(() => setGeneratingFeedback(false));
    };

    const handleStartOrRestartQuiz = () => {
        if (!quiz) return;

        const message = `This quiz will consist of ${quiz.questionCount} questions also requires a passing score of ${quiz.passingScore}%. You have ${quiz.durationInMinutes} minute(s) to complete it. Are you ready to start?`;
        if (window.confirm(message)) {
            navigate(`/quiz/${quizId}`);
        }
    };

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!quiz) return <p className="text-center text-danger fs-5">Quiz not found.</p>;

    const scoreData = lastAttempt ? {
        labels: ["Score", "Remaining"],
        datasets: [{
            data: [lastAttempt.score, 100 - lastAttempt.score],
            backgroundColor: ["#36A2EB", "#E0E0E0"],
            hoverBackgroundColor: ["#36A2EB", "#E0E0E0"]
        }]
    } : null;

    const formatFeedback = (text) => {
        if (!text) return "";

        return text
            .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>")
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/\b\*(\S.*?\S)\*\b/g, "<i>$1</i>")
            .replace(/^\*\s(?!✅|❌)(.*)/gm, "• $1")
            .replace(/^\n{2,}/g, "<br /><br />")
            .replace(/\n/g, "<br />");
    };

    return (
        <div className="container mt-5">
            <h1 className="fw-bold">{quiz.title}</h1>
            <hr />
            <button
                type="button"
                className="btn btn-outline-secondary rounded-pill"
                style={{ padding: "0.25rem 1rem", fontSize: "0.875rem" }} // Adjusted for size
                onClick={() => navigate(`/courses/${courseId || 6}`)} // Fallback to 6 if courseId is null
            >
                Back to Course
            </button>

            {/* Attempt Status Indicator */}
            {lastAttempt ? (
                <div className={`alert text-center ${lastAttempt.passed ? 'alert-success' : 'alert-danger'}`}>
                    <h5>Attempt Status</h5>
                    <p><strong>Attempt Made:</strong> Yes</p>
                    <div style={{ width: "200px", margin: "auto" }}>
                        <Doughnut data={scoreData} />
                    </div>
                    <p className="mt-2"><strong>Score:</strong> {lastAttempt.score.toFixed(2)} / 100</p>
                    <p className={`fw-bold mt-2 ${lastAttempt.passed ? 'text-success' : 'text-danger'}`}>
                        {lastAttempt.passed ? "Passed ✅" : "Not Passed ❌ Try Again"}
                    </p>
                </div>
            ) : (
                <div className="alert alert-warning text-center">
                    <h5>Attempt Status</h5>
                    <p><strong>Attempt Made:</strong> No</p>
                    <p className="mt-2">You have not yet attempted this quiz.</p>
                    <button
                        className="btn btn-primary mt-2"
                        onClick={handleStartOrRestartQuiz} // Use the new handler
                    >
                        Start Quiz
                    </button>
                </div>
            )}

            {feedback ? (
                <div className="card mt-3 rounded-4 shadow-sm transition-all"
                     style={{ overflow: "hidden", transition: "0.3s ease-in-out" }}
                >
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <button
                            className="btn btn-link text-decoration-none fw-bold d-flex align-items-center"
                            onClick={() => setShowFeedback(!showFeedback)}
                            style={{ fontSize: "18px", color: "#0d6efd" }}
                        >
                            <i className={`bi ${showFeedback ? "bi-chevron-up" : "bi-chevron-down"} me-2`}></i>
                            {showFeedback ? "Hide Feedback" : "Show Feedback"}
                        </button>
                    </div>

                    {showFeedback && (
                        <motion.div
                            className="card-body bg-light p-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p dangerouslySetInnerHTML={{ __html: formatFeedback(feedback) }} />
                        </motion.div>
                    )}
                </div>
            ) : lastAttempt && (
                <div className="text-center mt-3">
                    {generatingFeedback ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            style={{ display: "inline-block" }}
                        >
                            <Spinner animation="border" variant="primary" />
                        </motion.div>
                    ) : (
                        <button
                            className="btn btn-success fs-5 rounded-pill"
                            onClick={handleGenerateFeedback}
                            disabled={generatingFeedback}
                        >
                            Generate AI Feedback
                        </button>
                    )}
                </div>
            )}

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary btn-lg mb-5 rounded-pill"
                    onClick={handleStartOrRestartQuiz} // Use the new handler
                >
                    Restart Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizProfile;