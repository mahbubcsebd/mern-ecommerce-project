import { useGetFaqQuery } from "@/rtk/features/api/apiSlice";
import { useParams } from "react-router";

const FaqDetailsPage = () => {
  const { faqId } = useParams();

  const { data: faq, isLoading, isError, error } = useGetFaqQuery(faqId);
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (!isLoading && isError) {
    content = <p>{error}</p>;
  }

  if (!isLoading && !isError && faq.data._id) {
    content = (
      <div>
        <p>Question: {faq.data.question}</p>
        <p>Answer: {faq.data.answer}</p>
      </div>
    );
  }

  return content;
};

export default FaqDetailsPage;
