import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type FormEvent, useState, Fragment } from "react";
import PostsList from "~/components/PostsList";
import { LifebuoyIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import avif from "public/docs-dark@30.1a9f8cbf.avif";
import type { NextPage } from "next";
import TrendingPostsList from "~/components/TrendingPostsList";
import { Dialog, Transition } from "@headlessui/react";

const Home: NextPage = ({}) => {
  const { data } = useSession({
    required: true,
  });
  console.log(data);

  const [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  const [content, setContent] = useState("");
  const ctx = api.useContext();
  const newPost = api.post.create.useMutation({
    onSuccess: async () => {
      setContent("");
      await ctx.post.invalidate();
      await ctx.user.invalidate();
    },
  });
  const user = api.user.getUser.useQuery();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    newPost.mutate({ content: content.replace(/\n{3,}/g, "\n\n").trim() });
  }

  return (
    <>
      <div className="absolute -left-32 -top-20 -z-10 w-3/6 rotate-45 opacity-80 blur-md">
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
            strokeWidth="0"
            // style="transition: all 0.3s ease 0s;"
            stroke="url(#sw-gradient)"
          ></path>{" "}
        </svg>
      </div>
      <div className="absolute -top-10 right-0 -z-20 w-3/4">
        <Image src={avif} alt="backgroundElement" />
      </div>
      <div className="min-h-screen gap-4 p-4 lg:container md:grid md:grid-cols-12 lg:m-auto">
        <div className="md:col-span-8">
          <div className="flex items-center rounded-lg border border-white border-opacity-60 bg-white bg-opacity-20 p-4 sm:hidden">
            <LifebuoyIcon className="h-6" />
            {user.data?.relliesAmmount} Rellies
          </div>
          <div className="mb-4 rounded-lg border border-white border-opacity-60 bg-white bg-opacity-20 p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                name="content"
                className="flex-grow resize-none overflow-hidden rounded-lg bg-white bg-opacity-20 p-4 text-base outline-0 ring-1 placeholder:text-slate-200 focus:ring-white"
                placeholder="Hello World! :D"
                onKeyDown={(e) => {
                  if (e.key == "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                onChange={(e) => setContent(e.target.value)}
                maxLength={256}
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
          {/* trending */}
          <RecentPosts />
        </div>
        <div className="-z-10 hidden md:col-span-4 md:block md:space-y-4">
          <div className="rounded-lg border border-white border-opacity-70 bg-white bg-opacity-20 p-4 backdrop-blur-xl">
            <h1 className="text-3xl font-bold">Balance</h1>
            <h1 className="flex items-center text-lg font-medium">
              <LifebuoyIcon className="h-6" />
              {user.data?.relliesAmmount} Rellies
            </h1>
          </div>
          <div className="flex h-full flex-col">
            <span className="text-end italic">
              Last 48h most Rellyful posts
            </span>
            <RecentTopPosts />
          </div>
        </div>
      </div>
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Welcome to relly!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        To interact with others people&lsquo;s posts you will need
                        rellys. <br />
                        You will earn rellys every 5 minutes and everytime
                        someone else relly to your post or follow you. <br />
                        Read further in the <i>ABOUT</i> page, you find it on the menu.
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </>
  );
};

export default Home;

function RecentPosts() {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.post.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  // console.log(data?.pages[0]?.posts[0]?.likeCount);

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
function RecentTopPosts() {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.post.getTrending.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  // console.log(data?.pages[0]?.posts[0]?.likeCount);

  return (
    <TrendingPostsList
      posts={data?.pages.flatMap((page) => page.posts)}
      isError={isError}
      isLoading={isLoading}
      hasMore={hasNextPage ?? false}
      fetchNewPosts={fetchNextPage}
    />
  );
}
