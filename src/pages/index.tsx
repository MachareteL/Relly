import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { FormEvent, useState } from "react";
import PostsList from "~/components/PostsList";
import { LifebuoyIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import avif from "public/docs-dark@30.1a9f8cbf.avif";
export default function Home() {
  const { status } = useSession({
    required: true,
  });
  const [content, setContent] = useState("");
  const ctx = api.useContext();

  const newPost = api.post.create.useMutation({
    onSuccess: () => {
      setContent("");
      ctx.post.invalidate();
    },
  });
  const user = api.user.getUser.useQuery();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    newPost.mutate({ content });
  }
  return (
    <>
      <div className="absolute -bottom-20 -left-10 -z-10 w-2/6 opacity-70 blur-md">
        <svg
          id="sw-js-blob-svg-2"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <defs>
            {" "}
            <linearGradient id="sw-gradient2" x1="0" x2="1" y1="1" y2="0">
              {" "}
              <stop
                id="stop3"
                stopColor="rgba(236, 72, 153, 1)"
                offset="0%"
              ></stop>{" "}
              <stop
                id="stop4"
                stopColor="rgba(168, 85, 247, 1)"
                offset="100%"
              ></stop>{" "}
            </linearGradient>{" "}
          </defs>{" "}
          <path
            fill="url(#sw-gradient2)"
            d="M21.1,-37.9C27,-33.1,31.3,-26.8,35.7,-20.2C40,-13.7,44.5,-6.8,44.1,-0.3C43.6,6.3,38.1,12.5,33.3,18.4C28.5,24.3,24.5,29.9,19.1,33.1C13.6,36.4,6.8,37.3,0.1,37.2C-6.7,37,-13.3,35.8,-20.3,33.5C-27.3,31.1,-34.6,27.7,-38.5,21.9C-42.3,16.1,-42.7,8.1,-42.6,0.1C-42.5,-8,-42,-15.9,-38.1,-21.7C-34.3,-27.5,-27.2,-31.2,-20.3,-35.4C-13.4,-39.7,-6.7,-44.5,0.4,-45.3C7.6,-46,15.2,-42.7,21.1,-37.9Z"
            width="100%"
            height="100%"
            transform="translate(50 50)"
            stroke-width="0"
            // style="transition: all 0.3s ease 0s;"
          ></path>{" "}
        </svg>
      </div>
      <div className="absolute -top-20 right-0 -z-20 w-3/4 grayscale">
        <Image src={avif} alt="backgroundElement" />
        {/* <svg
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
        </svg> */}
      </div>
      <div className="container m-auto min-h-screen gap-2 p-4 sm:grid sm:grid-cols-12">
        <div className="col-span-2 hidden bg-slate-500 sm:block"></div>
        <div className="sm:col-span-7">
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
                className="place-self-end rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white"
              >
                Post
              </button>
            </form>
          </div>
          <RecentPosts />
        </div>
        <div className="-z-20 hidden sm:col-span-3 sm:block">
          <div className="h-52 rounded-lg border border-white border-opacity-30 bg-[rgba(255,255,255,0.2)] p-4 backdrop-blur-xl">
            <h1 className="text-3xl font-bold">Balance</h1>
            <h1 className="flex items-center text-lg font-medium">
              <LifebuoyIcon className="h-6" />
              {user.data?.relliesAmmount} Rellies
            </h1>
          </div>
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
