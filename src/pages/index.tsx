import { useSession } from "next-auth/react";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const session = useSession()
  function handleSubmit(){
    prisma
  }
  return (
    <>
      <div className="container m-auto min-h-screen gap-2 p-4 sm:grid sm:grid-cols-12">
        <div className="col-span-2 h-4/6 bg-slate-500"></div>
        <div className="col-span-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              name="content"
              className="flex-grow resize-none overflow-hidden rounded-lg p-4 text-base"
              placeholder="Hello World! :D"
            />
            <button className="place-self-end rounded-xl bg-pink-500 px-5 py-2 text-white">
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
