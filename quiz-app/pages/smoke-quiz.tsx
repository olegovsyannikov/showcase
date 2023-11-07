import DefaultLayout from "@/layouts/default";
import smokeQuizData from "../data/smokeQuizData.json";
import Quiz from "@/components/quiz/Quiz";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Quiz
        questions={smokeQuizData as Question[]}
        initialProgress={0}
        onQuizComplete={() => {}}
      />
    </DefaultLayout>
  );
}
