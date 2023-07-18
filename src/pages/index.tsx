import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";
import PostsList from "~/components/PostsList";

export default function Home() {
  const { status } = useSession();
  const [content, setContent] = useState("");

  const newPost = api.post.create.useMutation({
    onSuccess: () => {
      setContent("");
      Swal.fire("ok");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    newPost.mutate({ content });
  }

  if (status == "unauthenticated") useRouter().push("/signup");

  return (
    <>
      <div className="container m-auto min-h-screen gap-2 p-4 sm:grid sm:grid-cols-12">
        <div className="col-span-2 h-4/6 bg-slate-500"></div>
        <div className="col-span-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              name="content"
              className="flex-grow resize-none overflow-hidden rounded-lg p-4 text-base text-black"
              placeholder="Hello World! :D"
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="submit"
              className="place-self-end rounded-xl bg-pink-500 px-5 py-2 text-white"
            >
              Post
            </button>
          </form>
          <RecentPosts />
        </div>
      </div>
    </>
  );
}

function RecentPosts() {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.post.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => {
          lastPage.nextCursor;
        },
      }
    );

  return (
    <PostsList
      posts={data?.pages.flatMap((page) => page.posts)}
      isError={isError}
      isLoading={isLoading}
      hasMore={hasNextPage!}
      fetchNewPosts={fetchNextPage}
    />
  );
}
