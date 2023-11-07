import React, { useState } from "react";
import { Button } from "@nextui-org/react";

const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({
  options,
  selectedOptionIds,
  handleOptionClick,
  handleContinueClick
}) => {

  return (
    <>
      {options.map((option) => (
        <Button
          color={
            (selectedOptionIds || []).includes(option.id)
              ? "success"
              : "default"
          }
          variant={
            (selectedOptionIds || []).includes(option.id) ? "solid" : "bordered"
          }
          size="lg"
          key={option.id}
          onClick={() => handleOptionClick(option.id)}
          className="w-full mb-4"
        >
          {option.text}
        </Button>
      ))}
      <Button
        disabled={(selectedOptionIds || []).length === 0 ? true : false}
        variant={(selectedOptionIds || []).length === 0 ? "flat" : "solid"}
        color="primary"
        size="lg"
        onClick={handleContinueClick}
        className="w-full mb-10"
      >
        Continue
      </Button>
    </>
  );
};

export default MultipleChoiceOptions;
