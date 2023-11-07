import React, { useState } from "react";
import { title, subtitle } from "@/components/primitives";
import Feedback from "./Feedback";
import SingleChoiceOptions from "./SingleChoiceOptions";
import MultipleChoiceOptions from "./MultipleChoiceOptions";
import RatingOptions from "./RatingOptions";
import ImageChoiceOptions from "./ImageChoiceOptions";

function replaceNbsp(str: string) {
  return str.replace(/&nbsp;/g, " ");
}

const Question: React.FC<QuestionProps> = ({
  question,
  showFeedback,
  selectedOptionIds,
  handleOptionClick,
  handleContinueClick,
}) => {

  const renderOptions = () => {
    switch (question.type) {
      case "single-choice":
        return (
          <SingleChoiceOptions
            options={question.options}
            selectedOptionIds={selectedOptionIds || []}
            handleOptionClick={handleOptionClick}
          />
        );
      case "multiple-choice":
        return (
          <MultipleChoiceOptions
            options={question.options}
            feedback={question.feedback}
            selectedOptionIds={selectedOptionIds || []}
            handleOptionClick={handleOptionClick}
            handleContinueClick={handleContinueClick}
          />
        );
      case "rating":
        return (
          <>
            {showFeedback && (
              <Feedback
                text={getFeedbackText(question, selectedOptionIds)}
                displayMode="block"
              />
            )}
            <RatingOptions
              options={question.options}
              selectedOptionIds={selectedOptionIds || []}
              handleOptionClick={handleOptionClick}
              handleContinueClick={handleContinueClick}
            />
          </>
        );
      case "image-choice":
        return (
          <ImageChoiceOptions
            options={question.options}
            selectedOptionIds={selectedOptionIds || []}
            handleOptionClick={handleOptionClick}
          />
        );
      default:
        return null;
    }
  };

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

  return (
    <div className="max-w-sm"><div>{question.id}</div>
      {(showFeedback && question.type === "rating") || !showFeedback ? (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title({ size: "sm" })}>
              {replaceNbsp(question.question)}
            </h1>
            {question.description && (
              <h4 className={subtitle({ class: "mt-4" })}>
                {question.description}
              </h4>
            )}
          </div>
        </section>
      ) : null}
      {showFeedback && question.type !== "rating" && (
        <Feedback
          text={getFeedbackText(question, selectedOptionIds)}
          displayMode="screen"
        />
      )}
      {renderOptions()}
      {showFeedback && (
        <button className="continue-btn" onClick={handleContinueClick}>
          Continue
        </button>
      )}
    </div>
  );
};

export default Question;
