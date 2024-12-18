import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections | Dev Connect",
  description:
    "Explore a personalized collection of your saved questions on Dev Connect. Join our community of over 1,000,000 developers and access your curated repository of valuable insights and solutions.",
};

export default async function CollectionPage({
  searchParams,
}: SearchParamsProps) {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  const result = await getSavedQuestions({
    clerkId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
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
            title="These's no saved questions to show"
            description="🌟 Ask a question, spark a conversation, and let your ideas inspire others! 💬🚀✨"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}
