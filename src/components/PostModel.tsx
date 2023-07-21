import Link from "next/link";
import React from "react";
import { ProfileImage } from "./ProfileImage";
import { TrashIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import RellyButton from "./RellyButton";

export default function PostModel({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByUser,
  createdByCurrentUser,
}: Posts) {
  const addRelly = api.post.relly.useMutation({
    onSuccess: async () => {
      await ctx.post.getAll.invalidate();
    },
  });
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await ctx.post.getAll.invalidate();
    },
  });
  const ctx = api.useContext();

  function handleRelly(id: string, ammount: number) {
    addRelly.mutate({ id, ammount });
  }

  function handleDelete(id: string) {
    deletePost.mutate({ id });
  }

  return (
    <li className="flex gap-4 rounded-lg bg-[rgba(100,116,139,0.5)] px-4 pb-2 pt-4 backdrop-blur-3xl">
      <Link href={`/profile/${user.id}`} className="h-fit">
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col gap-1">
        <div className="flex justify-between gap-1">
          <Link href={`/profile/${user.id}`} className="font-bold">
            {user.name}
          </Link>
          {createdByCurrentUser && (
            <button onClick={() => handleDelete(id)}>
              <TrashIcon className="h-5 w-5 cursor-pointer" />
            </button>
          )}
        </div>
        <p className="flex-grow whitespace-pre-wrap break-all">{content}</p>
        <div className="flex justify-between text-center">
          {/* <button
            onClick={() => handleRelly(id, 1)}
            disabled={addRelly.isLoading}
            className="flex items-center space-x-1 rounded-lg text-indigo-400 hover:text-slate-300"
          >
            <p>{likeCount}</p>
          </button> */}
          <RellyButton
            handleRelly={handleRelly}
            id={id}
            likedByUser={likedByUser}
            className=""
          />
          <span className="text-fray-500 self-end text-xs">
            -{createdAt.toDateString()}
          </span>
        </div>
      </div>
    </li>
  );
}
