import React from "react";

const RatingOptions: React.FC<RatingOptionsProps> = ({
  options,
  selectedOptionIds,
  handleOptionClick,
}) => {

  return (
    <>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleOptionClick(option.id)}
          className={(selectedOptionIds || []).includes(option.id) ? "selected" : ""}
        >
          {option.text}
        </button>
      ))}
    </>
  );
};

export default RatingOptions;
