import React from "react";

const ImageChoiceOptions: React.FC<ImageChoiceOptionsProps> = ({
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
        >
          {option.text}
        </button>
      ))}
    </>
  );
};

export default ImageChoiceOptions;
