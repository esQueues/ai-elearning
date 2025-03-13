import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([
        { questionText: "", answers: [{ answerText: "", correct: false }] }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: "", answers: [{ answerText: "", correct: false }] }]);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (qIndex, aIndex, value, correct) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers[aIndex] = { answerText: value, correct };
        setQuestions(newQuestions);
    };

    const handleAddAnswer = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers.push({ answerText: "", correct: false });
        setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleRemoveAnswer = (qIndex, aIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        setError(null);

        if (!title.trim()) {
            setError("Quiz title cannot be empty.");
            return;
        }

        if (questions.length === 0) {
            setError("Quiz must have at least one question.");
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].questionText.trim()) {
                setError(`Question ${i + 1} cannot be empty.`);
                return;
            }
            if (questions[i].answers.length === 0) {
                setError(`Question ${i + 1} must have at least one answer.`);
                return;
            }
            for (let j = 0; j < questions[i].answers.length; j++) {
                if (!questions[i].answers[j].answerText.trim()) {
                    setError(`Answer ${j + 1} in Question ${i + 1} cannot be empty.`);
                    return;
                }
            }
        }

        setLoading(true);

        const quiz = { title, questions };

        axios
            .post(`/api/modules/${id}/quizzes`, quiz, { withCredentials: true })
            .then((response) => {
                const courseId = response.data.courseId; // Extract courseId from response
                navigate(`/courses/${courseId}/manage`); // Redirect to course manage page
            })
            .catch((err) => {
                console.error("Error creating quiz:", err);
                setError("Failed to create quiz. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Create Quiz</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quiz Title"
                className="form-control mb-3"
            />
            {questions.map((question, qIndex) => (
                <div key={qIndex} className="card p-3 mb-3">
                    <h5>Question {qIndex + 1}</h5>
                    <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        placeholder="Question Text"
                        className="form-control"
                    />
                    {question.answers.map((answer, aIndex) => (
                        <div key={aIndex} className="d-flex align-items-center gap-2 mt-2">
                            <input
                                type="text"
                                value={answer.answerText}
                                onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value, answer.correct)}
                                placeholder="Answer Text"
                                className="form-control"
                            />
                            <input
                                type="checkbox"
                                checked={answer.correct}
                                onChange={(e) => handleAnswerChange(qIndex, aIndex, answer.answerText, e.target.checked)}
                                className="form-check-input"
                            />
                            <button className="btn btn-danger" onClick={() => handleRemoveAnswer(qIndex, aIndex)}>Remove</button>
                        </div>
                    ))}
                    <button className="btn btn-secondary mt-2" onClick={() => handleAddAnswer(qIndex)}>Add Answer</button>
                    <button className="btn btn-danger mt-2" onClick={() => handleRemoveQuestion(qIndex)}>Remove Question</button>
                </div>
            ))}
            <button className="btn btn-primary mt-3" onClick={handleAddQuestion}>Add Question</button>
            <button className="btn btn-success mt-3" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Quiz"}
            </button>
        </div>
    );
};

export default AddQuiz;
