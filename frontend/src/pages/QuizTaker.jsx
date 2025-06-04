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
    const [timeLeft, setTimeLeft] = useState(null);
    const [timerExpired, setTimerExpired] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [durationSeconds, setDurationSeconds] = useState(0);

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        axios.get(`/api/modules/quizzes/${quizId}`, { withCredentials: true })
            .then((response) => {
                const shuffledQuiz = {
                    ...response.data,
                    questions: response.data.questions.map((question) => ({
                        ...question,
                        answers: shuffleArray([...question.answers]),
                    })),
                };
                setQuiz(shuffledQuiz);
                if (response.data.durationInMinutes) {
                    setTimeLeft(response.data.durationInMinutes * 60);
                    setStartTime(Date.now());
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching quiz:", err);
                setError("Failed to load quiz.");
                setLoading(false);
            });
    }, [quizId]);

    useEffect(() => {
        if (timeLeft === null || result || timerExpired) return;

        if (timeLeft <= 0) {
            setTimerExpired(true);
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
            setDurationSeconds(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, result, timerExpired, startTime]);

    const handleSelectAnswer = (questionId, answerId) => {
        if (timerExpired || result) return;
        setAnswers({ ...answers, [questionId]: answerId });
    };

    const handleSubmit = () => {
        if (result) return;

        const submissionData = {
            attemptAnswers: Object.entries(answers).map(([questionId, answerId]) => ({
                questionId: Number(questionId),
                answerId: Number(answerId),
            })),
            duration: durationSeconds
        };

        axios.post(`/api/modules/quizzes/${quizId}/submit`, submissionData, { withCredentials: true })
            .then((response) => {
                setResult(response.data);
                setTimerExpired(true);
            })
            .catch((error) => {
                console.error("Error submitting quiz:", error);
                setError("Failed to submit quiz. Please try again.");
            });
    };

    const formatTime = (seconds) => {
        if (seconds === null) return "Loading...";
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    if (loading) return <p className="text-center">Loading quiz...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;
    if (!quiz) return <p className="text-danger text-center">No quiz found.</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">{quiz.title}</h2>

            {!result && (
                <div className="text-center mb-4">
                    <h4>Time Remaining: {formatTime(timeLeft)}</h4>
                    {timerExpired && !result && (
                        <p className="text-danger">Time's up! Submitting your answers...</p>
                    )}
                </div>
            )}

            {result ? (
                <div className="alert alert-success text-center rounded-4">
                    <h2>🎉 Quiz Completed!</h2>
                    <p><strong>Score:</strong> {result.score} / 100</p>
                    <p><strong>Time Taken:</strong> {formatTime(durationSeconds)}</p>
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
                                        disabled={timerExpired || result}
                                    />
                                    <label htmlFor={`q${question.id}-a${answer.id}`} className="form-check-label">
                                        {answer.answerText}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="text-center">
                        <button
                            type="button"
                            className="btn btn-success btn-lg px-4"
                            onClick={handleSubmit}
                            disabled={timerExpired || result}
                        >
                            Submit Quiz
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default QuizTaker;