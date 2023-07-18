import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import PostsList from "~/components/PostsList";

export default function Home() {
  const { status } = useSession();
  const [content, setContent] = useState("");
  const ctx = api.useContext();

  const newPost = api.post.create.useMutation({
    onSuccess: () => {
      setContent("");
      ctx.post.invalidate();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    newPost.mutate({ content });
  }

  if (status == "unauthenticated") useRouter().push("/signup");

  return (
    <>
      <div className="absolute -z-20 hidden">
        <svg width="608" height="535" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
              <stop stopColor="#60A5FA" stopOpacity="0" offset="0%" />
              <stop stopColor="#F472B6" offset="100%" />
            </linearGradient>
            <filter
              x="-37.5%"
              y="-37.5%"
              width="175%"
              height="175%"
              filterUnits="objectBoundingBox"
              id="b"
            >
              <feGaussianBlur stdDeviation="50" in="SourceGraphic" />
            </filter>
          </defs>
          <circle
            filter="url(#b)"
            cx="304"
            cy="223"
            r="200"
            fill="url(#a)"
            fillRule="evenodd"
            fillOpacity=".32"
          />
        </svg>
      </div>
      <div className="absolute -left-36 -top-96 w-3/4 -z-20 blur-md">
        <svg
          id="sw-js-blob-svg"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <defs>
            {" "}
            <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
              {" "}
              <stop
                id="stop1"
                stopColor="rgba(0, 0, 0, 1)"
                offset="0%"
              ></stop>{" "}
              <stop
                id="stop2"
                stopColor="rgba(47.308, 18.32, 190.183, 1)"
                offset="100%"
              ></stop>{" "}
            </linearGradient>{" "}
          </defs>{" "}
          <path
            fill="url(#sw-gradient)"
            d="M13.3,-7.3C15.8,-3.4,15.3,2.6,12.6,10.5C9.9,18.4,5,28.2,-0.1,28.3C-5.2,28.4,-10.5,18.7,-15,9.8C-19.6,0.8,-23.5,-7.5,-20.9,-11.6C-18.3,-15.6,-9.1,-15.4,-1.9,-14.3C5.4,-13.2,10.8,-11.3,13.3,-7.3Z"
            width="100%"
            height="100%"
            transform="translate(50 50)"
            stroke-width="0"
            // style="transition: all 0.3s ease 0s;"
            stroke="url(#sw-gradient)"
          ></path>{" "}
        </svg>
      </div>
      <div className="container m-auto min-h-screen gap-2 p-4 sm:grid sm:grid-cols-12">
        <div className="col-span-2 bg-slate-500"></div>
        <div className="col-span-7">
          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-2">
              <textarea
                name="content"
                className="flex-grow resize-none overflow-hidden rounded-lg bg-gray-500 p-4 text-base outline-0 ring-1 placeholder:text-slate-200 focus:ring-white"
                placeholder="Hello World! :D"
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
              <button
                type="submit"
                className="place-self-end rounded-lg bg-fuchsia-500 px-4 py-2 text-white"
              >
                Post
              </button>
            </form>
          </div>
          <RecentPosts />
        </div>
        <div className="col-span-3">
          <div className="relative h-52 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"></div>
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
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <PostsList
      posts={data?.pages.flatMap((page) => page.posts)}
      isError={isError}
      isLoading={isLoading}
      hasMore={hasNextPage ?? false}
      fetchNewPosts={fetchNextPage}
    />
  );
}
