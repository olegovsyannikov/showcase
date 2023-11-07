import React from "react";

interface FeedbackProps {
  text: string;
  displayMode: "block" | "screen";
}

const Feedback: React.FC<FeedbackProps> = ({ text, displayMode }) => {
  if (displayMode === "block") {
    return <div className="feedback-block">{text}</div>;
  } else if (displayMode === "screen") {
    return (
      <div className="feedback-screen">
        <div className="feedback-content">{text}</div>
      </div>
    );
  }
  return null;
};

export default Feedback;
