import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizTaker = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/modules/quizzes/${quizId}`, { withCredentials: true })
            .then((response) => {
                setQuiz(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching quiz:", err);
                setError("Failed to load quiz.");
                setLoading(false);
            });
    }, [quizId]);

    const handleSelectAnswer = (questionId, answerId) => {
        setAnswers({ ...answers, [questionId]: answerId });
    };

    const handleSubmit = () => {
        const submissionData = Object.entries(answers).map(([questionId, answerId]) => ({
            questionId: Number(questionId),
            answerId: answerId,
        }));

        axios.post(`/api/modules/quizzes/${quizId}/submit`, submissionData, { withCredentials: true })
            .then((response) => setResult(response.data))
            .catch((error) => console.error("Error submitting quiz:", error));
    };

    if (loading) return <p className="text-center">Loading quiz...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;
    if (!quiz) return <p className="text-danger text-center">No quiz found.</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">{quiz.title}</h2>

            {result ? (
                <div className="alert alert-success text-center rounded-4">
                    <h2>🎉 Quiz Completed!</h2>
                    <p><strong>Score:</strong> {result.score} / 100</p>
                    <button className="btn btn-success btn-lg px-4" onClick={() => navigate(`/quiz/${quizId}/profile`)}>
                        Go to Quiz Profile
                    </button>
                </div>
            ) : (
                <form>
                    {quiz.questions.map((question, index) => (
                        <div key={question.id} className="card p-3 mb-3 shadow-sm">
                            <h5 className="fw-bold">{index + 1}. {question.questionText}</h5>
                            {question.answers.map((answer) => (
                                <div key={answer.id} className="form-check">
                                    <input
                                        type="radio"
                                        id={`q${question.id}-a${answer.id}`}
                                        name={`question-${question.id}`}
                                        className="form-check-input"
                                        value={answer.id}
                                        checked={answers[question.id] === answer.id}
                                        onChange={() => handleSelectAnswer(question.id, answer.id)}
                                    />
                                    <label htmlFor={`q${question.id}-a${answer.id}`} className="form-check-label">
                                        {answer.answerText}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="text-center">
                        <button type="button" className="btn btn-success btn-lg px-4" onClick={handleSubmit}>
                            Submit Quiz
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default QuizTaker;
