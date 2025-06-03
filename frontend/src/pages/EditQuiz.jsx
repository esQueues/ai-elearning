import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: "",
        passingScore: "", // Initialize with empty string for UI
        durationInMinutes: "", // New field for duration
        questions: []
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/modules/quizzes/${quizId}`, { withCredentials: true })
            .then(response => {
                // Ensure passingScore and durationInMinutes are set as strings for input compatibility
                setQuiz({
                    ...response.data,
                    passingScore: response.data.passingScore ? String(response.data.passingScore) : "",
                    durationInMinutes: response.data.durationInMinutes ? String(response.data.durationInMinutes) : ""
                });
            })
            .catch(error => {
                console.error("Error fetching quiz:", error);
                setError("Failed to fetch quiz data.");
            });
    }, [quizId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "passingScore") {
            // Allow empty input or valid numbers (1-100)
            if (value === "" || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 100)) {
                setQuiz({ ...quiz, passingScore: value });
            }
        } else if (name === "durationInMinutes") {
            // Allow empty input or valid positive integers
            if (value === "" || (/^\d+$/.test(value) && Number(value) >= 1)) {
                setQuiz({ ...quiz, durationInMinutes: value });
            }
        } else {
            setQuiz({ ...quiz, [name]: value });
        }
    };

    const handleQuestionChange = (index, e) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[index][e.target.name] = e.target.value;
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleAnswerChange = (qIndex, aIndex, e) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[qIndex].answers[aIndex][e.target.name] = e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Validate title
        if (!quiz.title.trim()) {
            setError("Quiz title cannot be empty.");
            return;
        }

        // Validate passingScore
        const score = Number(quiz.passingScore);
        if (!quiz.passingScore || score < 1 || score > 100) {
            setError("Passing score must be between 1 and 100.");
            return;
        }

        // Validate durationInMinutes
        const duration = Number(quiz.durationInMinutes);
        if (!quiz.durationInMinutes || duration < 1) {
            setError("Duration must be at least 1 minute.");
            return;
        }

        // Validate questions
        if (quiz.questions.length === 0) {
            setError("Quiz must have at least one question.");
            return;
        }
        for (let i = 0; i < quiz.questions.length; i++) {
            if (!quiz.questions[i].questionText.trim()) {
                setError(`Question ${i + 1} cannot be empty.`);
                return;
            }
            if (!quiz.questions[i].answers || quiz.questions[i].answers.length === 0) {
                setError(`Question ${i + 1} must have at least one answer.`);
                return;
            }
            for (let j = 0; j < quiz.questions[i].answers.length; j++) {
                if (!quiz.questions[i].answers[j].answerText.trim()) {
                    setError(`Answer ${j + 1} in Question ${i + 1} cannot be empty.`);
                    return;
                }
            }
        }

        // Convert passingScore and durationInMinutes to numbers for API
        const updatedQuiz = {
            ...quiz,
            passingScore: Number(quiz.passingScore),
            durationInMinutes: Number(quiz.durationInMinutes)
        };

        axios.put(`/api/modules/quizzes/${quizId}`, updatedQuiz, { withCredentials: true })
            .then(() => navigate(-1))
            .catch(error => {
                console.error("Error updating quiz:", error);
                setError("Failed to update quiz. Please try again.");
            });
    };

    return (
        <div className="container mt-4">
            <h2>Edit Quiz</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={quiz.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="passingScore" className="form-label">Passing Score (%)</label>
                    <input
                        type="number"
                        id="passingScore"
                        className="form-control"
                        name="passingScore"
                        value={quiz.passingScore}
                        onChange={handleChange}
                        placeholder="Enter passing score (1-100)"
                        min="1"
                        max="100"
                        step="1"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="durationInMinutes" className="form-label">Duration (Minutes)</label>
                    <input
                        type="number"
                        id="durationInMinutes"
                        className="form-control"
                        name="durationInMinutes"
                        value={quiz.durationInMinutes}
                        onChange={handleChange}
                        placeholder="Enter duration in minutes"
                        min="1"
                        step="1"
                        required
                    />
                </div>
                <h4>Questions</h4>
                {quiz.questions.map((question, qIndex) => (
                    <div key={question.id} className="card mb-3 p-3">
                        <div className="mb-2">
                            <label className="form-label">Question Text</label>
                            <input
                                type="text"
                                className="form-control"
                                name="questionText"
                                value={question.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                                required
                            />
                        </div>
                        <h5>Answers</h5>
                        {question.answers.map((answer, aIndex) => (
                            <div key={answer.id} className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="answerText"
                                    value={answer.answerText}
                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                                    required
                                />
                                <div className="input-group-text">
                                    <input
                                        type="checkbox"
                                        name="correct"
                                        checked={answer.correct}
                                        onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                                    />
                                    <label className="ms-2">Correct</label>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditQuiz;