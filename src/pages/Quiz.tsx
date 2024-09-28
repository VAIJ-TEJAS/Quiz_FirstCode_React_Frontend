import { useState } from "react";

const Quiz = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [buttonStates, setButtonStates] = useState({});
  const [isAnswering, setIsAnswering] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(new Set()); // Track selected options

  const currentQuestion = quiz[currentQuestionIndex];
  const totalQuestions = quiz.length;
  const correctAnswers = new Set(currentQuestion.correct_option);
  const requiredSelections = correctAnswers.size; // Required number of selections

  // Handle button click
  const handleSelect = (option) => {
    if (isAnswering) return; // Prevent clicking while answering

    // Update selected options
    const updatedSelections = new Set(selectedOptions);
    if (updatedSelections.has(option)) {
      updatedSelections.delete(option); // Deselect if already selected
    } else {
      updatedSelections.add(option); // Add to selected options
    }
    
    setSelectedOptions(updatedSelections);

    // Set the button state for immediate feedback
    setButtonStates((prevState) => ({
      ...prevState,
      [option]: correctAnswers.has(option) ? "correct" : "wrong",
    }));

    // If the number of selected options equals required selections, show the result
    if (updatedSelections.size === requiredSelections) {
      setIsAnswering(true);
      
      const isCorrect = [...updatedSelections].every(option => correctAnswers.has(option));
      // Show result message
      setTimeout(() => {
        if (isCorrect) {
          handleNext(); // Move to next question if correct
        } else {
          resetQuestion(); // Reload question if incorrect
        }
      }, 1200);
    }
  };

  // Reset for the current question
  const resetQuestion = () => {
    setSelectedOptions(new Set()); // Reset selected options
    setButtonStates({});
    setIsAnswering(false);
  };

  // Handle navigating to the next question
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestion();
    }
  };

  // Handle navigating to the previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetQuestion();
    }
  };

  return (
    <div style={styles.container} >
      <div style={styles.quizBox} >
        {/* Display the current question */}
        <div key={currentQuestionIndex}>
          {currentQuestion.image_url && (
            <div style={styles.imageContainer}>
              <img
                src={currentQuestion.image_url}
                alt={`Image for question ${currentQuestion.question}`}
              />
            </div>
          )}

          <h3>{currentQuestion.question}</h3>

          {/* Render buttons for options in two columns */}
          <div style={styles.buttonContainer}>
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                style={{
                  backgroundColor:
                    buttonStates[option] === "correct"
                      ? "green"
                      : buttonStates[option] === "wrong"
                      ? "red"
                      : "lightblue", // Highlight selected options
                  cursor: isAnswering ? "not-allowed" : "pointer",
                }}
                disabled={isAnswering} // Disable buttons while answering
              >
                {option}
              </button>
            ))}
          </div>

          {/* Display result message */}
          {isAnswering && (
            <h4 style={styles.resultMessage}>
              {Array.from(selectedOptions).every(option => correctAnswers.has(option)) 
                ? "Correct!" 
                : "Wrong!"}
            </h4>
          )}
        </div>

        {/* Previous and Next buttons */}
        <div style={styles.navigationContainer}>
          <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>
            {'<'}
          </button>
          <h4 style={styles.questionNumber}>
            {currentQuestionIndex + 1}/{totalQuestions}
          </h4>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS styles for centering
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",  
  },
  quizBox: {
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    textAlign: "center",
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // Two columns
    gap: "10px",
    marginTop: "20px",
  },
  navigationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  questionNumber: {
    margin: "0 15px",
  },
  resultMessage: {
    marginTop: "15px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default Quiz;
