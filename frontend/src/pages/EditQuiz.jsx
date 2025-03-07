import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: "",
        questions: []
    });

    useEffect(() => {
        axios.get(`/api/modules/quizzes/${quizId}`, { withCredentials: true })
            .then(response => setQuiz(response.data))
            .catch(error => console.error("Error fetching quiz:", error));
    }, [quizId]);

    const handleChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.value });
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
        axios.put(`/api/modules/quizzes/${quizId}`, quiz, { withCredentials: true })
            .then(() => navigate(-1))
            .catch(error => console.error("Error updating quiz:", error));
    };

    return (
        <div className="container mt-4">
            <h2>Edit Quiz</h2>
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
