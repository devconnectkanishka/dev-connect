import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionByTagId, getTagById } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const tag = await getTagById({ tagId: params.id });

  return {
    title: `Posts by tag '${tag.name}' — DevConnect`,
    description: tag.description || `Questions tagged with ${tag.name}`,
  };
}

const TagDetailPage = async ({ params: { id }, searchParams }: URLProps) => {
  const { tagTitle, questions, isNext } = await getQuestionByTagId({
    tagId: id,
    searchQuery: searchParams.q,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tags/${id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {questions.length > 0 ? (
          questions.map((question: any) => (
            <QuestionCard
              key={question._id.toString()}
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
            title="These's no Tag questions to show"
            description="🌟 Ask a question, spark a conversation, and let your ideas inspire others! 💬🚀✨"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default TagDetailPage;
