import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import NoResult from "./NoResult";
import Pagination from "./Pagination";

interface QuestionsTabProps extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

const QuestionsTab = async ({
  userId,
  clerkId,
  searchParams,
}: QuestionsTabProps) => {
  const { questions, totalQuestions, isNextQuestion } = await getUserQuestions({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {totalQuestions > 0 ? (
        questions.map((question: any) => (
          <QuestionCard
            key={question._id.toString()}
            clerkId={clerkId}
            tags={question.tags}
            title={question.title}
            author={question.author}
            upvotes={question.upvotes.length}
            answers={question.answers}
            views={question.views}
            _id={question._id.toString()}
            createdAt={question.createdAt}
          />
        ))
      ) : (
        <NoResult
          title="These's no top questions to show"
          description="🌟 Ask a question, spark a conversation, and let your ideas inspire others! 💬🚀✨"
          link="/ask-question"
          linkTitle="Ask a Question"
        />
      )}
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={isNextQuestion}
      />
    </div>
  );
};

export default QuestionsTab;
