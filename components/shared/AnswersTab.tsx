import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";
import NoResult from "./NoResult";
import Pagination from "./Pagination";

interface AnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

const AnswersTab = async ({
  userId,
  clerkId,
  searchParams,
}: AnswersTabProps) => {
  const { answers, totalAnswers, isNextAnswer } = await getUserAnswers({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <>
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {totalAnswers > 0 ? (
          answers.map((answer) => (
            <AnswerCard
              key={answer._id.toString()}
              clerkId={clerkId}
              _id={answer._id.toString()}
              question={answer.question}
              author={answer.author}
              upvotes={answer.upvotes.length}
              createdAt={answer.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="These's no answers to show"
            description="🌟 Ask a question, spark a conversation, and let your ideas inspire others! 💬🚀✨"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNextAnswer}
        />
      </div>
    </>
  );
};

export default AnswersTab;
