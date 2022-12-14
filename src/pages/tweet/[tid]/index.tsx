import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import {
  CreateComment,
  TweetCard,
  Trends,
  CommentCard,
} from "components/index";
import { FPost } from "lib/types";
import Loader from "components/Loader";
import { useAuthState } from "context/auth.context";

const index = () => {
  const { user } = useAuthState();

  const router = useRouter();
  const { push } = useRouter();
  const { tid } = router.query;
  const { data, error } = useSWR<FPost>(tid ? `/api/posts/${tid}` : null);

  if (error) {
    return <h3>Opps Error!!!</h3>;
  }
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <Head>
        <title>{data?.content}</title>
      </Head>
      <div className="col-span-8 md:col-span-5">
        {/* Comment */}
        {!data ? (
          <Loader />
        ) : (
          <>
            <TweetCard tweet={data} />
            {user ? (
              <CreateComment tid={tid?.toString()} />
            ) : (
              <div className="p-3 text-center">
                {" "}
                <p>Sign in to talk to the world 😉</p>
                <button
                  onClick={() => push("/auth")}
                  className="p-1 my-3 bg-blue-600 border border-blue-600"
                >
                  Sign up / Sign in
                </button>
              </div>
            )}
            <div className="pl-14">
              {data.comments?.map((comment) => (
                <CommentCard key={comment._id} data={comment} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="hidden col-span-8 space-y-4 md:col-span-3 md:block">
        <Trends />
      </div>
    </div>
  );
};

export default index;
