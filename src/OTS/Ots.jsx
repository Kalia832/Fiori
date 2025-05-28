import React, { useState, useEffect } from "react";
import rawQuestionsData from "../assets/deepseek_json_20250528_a6c5db.json";

const shuffleArray = (arr) =>
  arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

const Ots = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Shuffle questions once on mount
  useEffect(() => {
    document.title = "SAP FIORI";
    const shuffledQuestions = shuffleArray(rawQuestionsData.questions);
    setQuestions(shuffledQuestions);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const correctCount = currentQuestion?.correctAnswers.length || 0;

  // Shuffle options when question changes
  useEffect(() => {
    if (currentQuestion) {
      const options = currentQuestion.options.map((text, index) => ({
        index,
        text,
      }));
      setShuffledOptions(shuffleArray(options));
      setSelectedOptions([]);
      setIsSubmitted(false);
    }
  }, [currentQuestionIndex, questions]);

  const handleOptionToggle = (index) => {
    if (isSubmitted) return;
    if (selectedOptions.includes(index)) {
      setSelectedOptions((prev) => prev.filter((i) => i !== index));
    } else if (selectedOptions.length < correctCount) {
      setSelectedOptions((prev) => [...prev, index]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const sortedCorrect = [...currentQuestion.correctAnswers].sort().join(",");
    const sortedSelected = [...selectedOptions].sort().join(",");
    if (sortedCorrect === sortedSelected) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz completed! Final score: ${score}/${questions.length}`);
    }
  };

  const getOptionClass = (optionIndex) => {
    if (!isSubmitted) return "border";

    const isCorrect = currentQuestion.correctAnswers.includes(optionIndex);
    const isSelected = selectedOptions.includes(optionIndex);

    if (isCorrect) return "border border-success bg-primary text-light";
    if (isSelected && !isCorrect)
      return "border border-danger bg-secondary text-light";

    return "border";
  };

  if (questions.length === 0)
    return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-4">
      <h3 className="text-center mb-4">
        Score: {score}/{questions.length}
      </h3>

      <div className="card shadow">
        <div className="card-header">
          <strong>Question {currentQuestionIndex + 1}:</strong>{" "}
          {currentQuestion.question}
          <p className="text-muted mb-3">
            <em>{currentQuestion.note}</em>
          </p>
        </div>

        <div className="card-body">
          {shuffledOptions.map(({ index, text }) => (
            <div
              key={index}
              className={`form-check mb-2 p-2 rounded ${getOptionClass(index)}`}
              style={{ cursor: isSubmitted ? "default" : "pointer" }}
              onClick={() => handleOptionToggle(index)}
            >
              <input
                type="checkbox"
                className="form-check-input m-2"
                checked={selectedOptions.includes(index)}
                disabled={isSubmitted}
                readOnly
              />
              <label className="form-check-label ms-2">{text}</label>
            </div>
          ))}
        </div>

        <div className="card-footer d-flex justify-content-between">
          {!isSubmitted ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={selectedOptions.length !== correctCount}
            >
              Submit
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handleNext}>
              Next
            </button>
          )}
        </div>

        {isSubmitted &&
          selectedOptions.some(
            (i) => !currentQuestion.correctAnswers.includes(i)
          ) && (
            <div className="alert alert-info m-3">
              <strong>Correct Answer(s):</strong>
              <ul className="mb-0">
                {currentQuestion.correctAnswers.map((idx) => (
                  <li key={idx}>{currentQuestion.options[idx]}</li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};

export default Ots;
