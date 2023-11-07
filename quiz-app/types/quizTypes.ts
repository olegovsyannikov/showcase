/*
  Option types
*/
interface BaseOption {
  id: string;
  text: string;
}

interface SingleChoiceOption extends BaseOption {
  icon: string;
  feedback: string;
}

interface MultipleChoiceOption extends BaseOption {
  icon: string;
}

interface RatingOption extends BaseOption {
  text: "";
  value: number;
  emoji: string;
  feedback: string;
}

interface ImageChoiceOption extends BaseOption {
  image: string;
  feedback: string;
}

/*
  Question types
*/
interface BaseQuestion {
  id: string;
  type: "single-choice" | "multiple-choice" | "rating" | "image-choice";
  question: string;
  description?: string;
  progressLabel: string;
}

interface SingleChoiceQuestion extends BaseQuestion {
  type: "single-choice";
  options: SingleChoiceOption[];
}

interface MultipleChoiceFeedback {
  range: [number, number];
  text: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: MultipleChoiceOption[];
  feedback: MultipleChoiceFeedback[];
}

interface RatingQuestion extends BaseQuestion {
  type: "rating";
  options: RatingOption[];
}

interface ImageChoiceQuestion extends BaseQuestion {
  type: "image-choice";
  options: ImageChoiceOption[];
}

type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | RatingQuestion
  | ImageChoiceQuestion;

/*
  Question properties
*/
interface QuestionProps {
  question: Question;
  showFeedback?: boolean;
  selectedOptionIds?: string[]
  feedback?: string;
  handleOptionClick: (optionId: string) => void;
  handleContinueClick: () => void;
}

/*
  Option properties
*/
interface BaseOptionsProps {
  selectedOptionIds?: string[];
  handleOptionClick: (optionId: string) => void;
}

interface SingleChoiceOptionsProps extends BaseOptionsProps {
  options: SingleChoiceOption[];
}

interface MultipleChoiceOptionsProps extends BaseOptionsProps {
  options: MultipleChoiceOption[];
  feedback: MultipleChoiceFeedback[];
  handleContinueClick: () => void;
}

interface RatingOptionsProps extends BaseOptionsProps {
  options: RatingOption[];
  handleContinueClick: () => void;
}

interface ImageChoiceOptionsProps extends BaseOptionsProps {
  options: ImageChoiceOption[];
}

type OptionsProps =
  | SingleChoiceOptionsProps
  | MultipleChoiceOptionsProps
  | RatingOptionsProps
  | ImageChoiceOptionsProps;

/*
  Screens flow
*/
type ScreenType = "question" | "feedback";

interface QuizScreen {
  type: ScreenType;
  questionId?: string; // Only present if type is "question"
  feedbackText?: string; // Only present if type is "feedback"
}

interface Flow {
  screens: QuizScreen[];
  currentScreenIndex: number;
}
