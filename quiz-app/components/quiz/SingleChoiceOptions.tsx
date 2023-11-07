import React from "react";
import { Button } from "@nextui-org/react";

const SingleChoiceOptions: React.FC<SingleChoiceOptionsProps> = ({
  options,
  selectedOptionIds,
  handleOptionClick,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default SingleChoiceOptions;
