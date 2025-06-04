import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: "",
        passingScore: "",
        durationInMinutes: "",
        questionCount: "", // New field for questionCount
        questions: []
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/modules/quizzes/${quizId}`, { withCredentials: true })
            .then(response => {
                setQuiz({
                    ...response.data,
                    passingScore: response.data.passingScore ? String(response.data.passingScore) : "",
                    durationInMinutes: response.data.durationInMinutes ? String(response.data.durationInMinutes) : "",
                    questionCount: response.data.questionCount ? String(response.data.questionCount) : "" // Initialize questionCount
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
            if (value === "" || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 100)) {
                setQuiz({ ...quiz, passingScore: value });
            }
        } else if (name === "durationInMinutes") {
            if (value === "" || (/^\d+$/.test(value) && Number(value) >= 1)) {
                setQuiz({ ...quiz, durationInMinutes: value });
            }
        } else if (name === "questionCount") {
            if (value === "" || (/^\d+$/.test(value) && Number(value) >= 1)) {
                setQuiz({ ...quiz, questionCount: value });
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

    const handleAddQuestion = () => {
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                { questionText: "", answers: [{ answerText: "", correct: false }] }
            ]
        });
    };

    const handleAddAnswer = (qIndex) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[qIndex].answers.push({ answerText: "", correct: false });
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleRemoveAnswer = (qIndex, aIndex) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
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

        // Validate questionCount
        const qCount = Number(quiz.questionCount);
        if (!quiz.questionCount || qCount < 1) {
            setError("Number of questions to select must be at least 1.");
            return;
        }

        // Validate that questionCount does not exceed available questions
        if (qCount > quiz.questions.length) {
            setError("Number of questions to select cannot exceed the total number of questions.");
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
            let hasCorrectAnswer = false;
            for (let j = 0; j < quiz.questions[i].answers.length; j++) {
                if (!quiz.questions[i].answers[j].answerText.trim()) {
                    setError(`Answer ${j + 1} in Question ${i + 1} cannot be empty.`);
                    return;
                }
                if (quiz.questions[i].answers[j].correct) {
                    hasCorrectAnswer = true;
                }
            }
            if (!hasCorrectAnswer) {
                setError(`Question ${i + 1} must have at least one correct answer.`);
                return;
            }
        }

        // Convert fields to numbers for API
        const updatedQuiz = {
            ...quiz,
            passingScore: Number(quiz.passingScore),
            durationInMinutes: Number(quiz.durationInMinutes),
            questionCount: Number(quiz.questionCount)
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
                <div className="mb-3">
                    <label htmlFor="questionCount" className="form-label">Number of Questions to Select</label>
                    <input
                        type="number"
                        id="questionCount"
                        className="form-control"
                        name="questionCount"
                        value={quiz.questionCount}
                        onChange={handleChange}
                        placeholder="Enter number of questions for quiz attempt"
                        min="1"
                        step="1"
                        required
                    />
                </div>
                <h4>Questions</h4>
                {quiz.questions.map((question, qIndex) => (
                    <div key={question.id || qIndex} className="card mb-3 p-3">
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
                            <div key={answer.id || aIndex} className="input-group mb-2">
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
                                <button
                                    type="button"
                                    className="btn btn-danger ms-2"
                                    onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary mt-2"
                            onClick={() => handleAddAnswer(qIndex)}
                        >
                            Add Answer
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger mt-2"
                            onClick={() => handleRemoveQuestion(qIndex)}
                        >
                            Remove Question
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={handleAddQuestion}
                >
                    Add Question
                </button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditQuiz;