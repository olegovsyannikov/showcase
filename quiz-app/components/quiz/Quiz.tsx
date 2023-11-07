import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import Question from "./Question";

interface QuizProps {
  questions: Question[];
  initialProgress: number; // This can be fetched from Firebase to resume a user's progress
  onQuizComplete: (answers: Record<string, string | string[] | number>) => void; // Callback for when the quiz is completed
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  initialProgress,
  onQuizComplete,
}) => {
  const [flow, setFlow] = useState<Flow>({ screens: [], currentScreenIndex: 0 });
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(initialProgress);
  const [quizResponses, setQuizResponses] = useState<Record<string, string[]>>(
    {}
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>([]);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
      const startFlow = () => { // CHANGES: startFlow function
        const initialScreen: QuizScreen = { type: "question", questionId: questions[0].id };
        setFlow({ screens: [initialScreen], currentScreenIndex: 0 });
      };
  
      startFlow(); // CHANGES: Initialize the flow when the component mounts
  }, [questions]);

  useEffect(() => {
    // Update currentSelectedIds based on the current question's responses
    const currentResponses = quizResponses[currentQuestion.id];
    if (currentResponses) {
      setCurrentSelectedIds(currentResponses);
    } else {
      setCurrentSelectedIds([]); // Reset if there are no responses for the current question
    }

  }, [currentQuestion.id, currentQuestionIndex, quizResponses]);

  function getFeedbackText(
    question: Question,
    selectedOptionIds?: string[]
  ): string {
    switch (question.type) {
      case "single-choice":
      case "rating":
      case "image-choice":
        const selectedOption = question.options.find(
          (option) => (selectedOptionIds || []).includes(option.id)
        );
        return selectedOption?.feedback || "";

      case "multiple-choice":
        const selectedCount = (selectedOptionIds as string[]).length;
        const feedbackItem = question.feedback.find(
          (feedback) =>
            selectedCount >= feedback.range[0] &&
            selectedCount <= feedback.range[1]
        );
        return feedbackItem?.text || "";

      default:
        return "";
    }
  }

  const proceedInFlow = () => { // CHANGES: proceedInFlow function
    const currentScreen = flow.screens[flow.currentScreenIndex];
    let newScreens = [...flow.screens];

    if (currentScreen.type === "question") {
      const question = questions.find(q => q.id === currentScreen.questionId);
      if (question) {
        const feedback = getFeedbackText(question, currentSelectedIds)
        if (feedback) {
          newScreens.push({ type: "feedback", feedbackText: feedback });
        }
        
        // Check if the next question screen already exists in the flow
        const nextQuestionId = questions[flow.currentScreenIndex + 1]?.id;
        const isNextQuestionScreenAdded = flow.screens.some(screen => 
            screen.type === "question" && screen.questionId === nextQuestionId
        );

        // Only add the next question screen if it hasn't been added yet
        if (!isNextQuestionScreenAdded && flow.currentScreenIndex < questions.length - 1) {
            newScreens.push({ type: "question", questionId: nextQuestionId, feedbackText: feedback });
        }
      }
    }

    setFlow({ screens: newScreens, currentScreenIndex: flow.currentScreenIndex + 1 });
  };

  const goToNextScreen = (flow: Flow): Flow => {
    if (flow.currentScreenIndex < flow.screens.length - 1) {
      flow.currentScreenIndex++;
    }
    return flow;
  };
  
  const goToPreviousScreen = (flow: Flow): Flow => {
    if (flow.currentScreenIndex > 0) {
      flow.currentScreenIndex--;
    }
    return flow;
  };
  
  const handleBackClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
    goToPreviousScreen(flow);
  };

  const handleForwardClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    goToNextScreen(flow);
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestionId = questions[currentQuestionIndex]?.id;
    return !!quizResponses[currentQuestionId];
  };
  
  const handleOptionClick = (optionId: string) => {
    let updatedSelectedIds: string[] = [];

    if (currentQuestion.type === "multiple-choice") {
      if (currentSelectedIds.includes(optionId)) {
        updatedSelectedIds = currentSelectedIds.filter((id) => id !== optionId);
      } else {
        updatedSelectedIds = [...currentSelectedIds, optionId];
      }
    } else {
      updatedSelectedIds = [optionId];
    }

    setQuizResponses({
      ...quizResponses,
      [currentQuestion.id]: updatedSelectedIds,
    });

    // Check for feedback and proceed accordingly
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.id === optionId
    );
    if (
      selectedOption &&
      "feedback" in selectedOption &&
      selectedOption.feedback
    ) {
      setShowFeedback(true);
    } else if (currentQuestion.type !== "multiple-choice") {
      proceedToNextQuestion();
    }

    proceedInFlow();
  };

  const proceedToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCurrentSelectedIds([]); // Reset for the next question
      setShowFeedback(false);
    } else {
      onQuizComplete(quizResponses);
    }
  };

  const handleContinueClick = () => {
    proceedToNextQuestion();
    proceedInFlow(); 
  };

  console.log(flow);

  const isBackButtonDisabled = currentQuestionIndex == 0;
  const isForwardbuttonDisabled = !(isCurrentQuestionAnswered() && currentQuestionIndex < questions.length - 1);

  return (
    <>
      <div className="flex justify-center">
        <Progress
          label={currentQuestion.progressLabel}
          size="sm"
          value={currentQuestionIndex}
          maxValue={questions.length}
          color="warning"
          formatOptions={{ style: "percent" }}
          showValueLabel={true}
          className="max-w-md mb-4"
        />
      </div>
        <div className="flex justify-center">
          <div className="flex max-w-md gap-2">
            <Button
              disabled={isBackButtonDisabled}
              onClick={handleBackClick}
              size="sm"
              variant={isBackButtonDisabled ? "flat" : "bordered"}
              className="border"
            >
              Back
            </Button>
            <Button
              disabled={isForwardbuttonDisabled}
              onClick={handleForwardClick}
              size="sm"
              variant={isForwardbuttonDisabled ? "flat" : "bordered"}
              className="border"
            >
              Forward
            </Button>
          </div>
        </div>
      <div className="flex justify-center">
        <AnimatePresence>
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ display: "none" }}
            transition={{ duration: 0.5 }}
          >
            <Question
              question={currentQuestion}
              showFeedback={showFeedback}
              selectedOptionIds={currentSelectedIds}
              handleOptionClick={handleOptionClick}
              handleContinueClick={handleContinueClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Quiz;
