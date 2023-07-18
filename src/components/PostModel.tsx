import Link from "next/link";
import React from "react";
import { ProfileImage } from "./ProfileImage";
import { LifebuoyIcon } from "@heroicons/react/24/outline";

export default function PostModel({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByUser,
}: Posts) {
  return (
    <li className="flex gap-4 rounded-lg bg-[rgba(100,116,139,0.5)] px-4 pb-2 pt-4">
      <Link href={`/profile/${user.id}`} className="h-fit">
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col gap-1">
        <div className="flex gap-1">
          <Link href={`/profile/${user.id}`} className="font-bold">
            {user.name}
          </Link>
        </div>
        <p className="flex-grow whitespace-pre-wrap">{content}</p>
        <div className="flex justify-between text-center">
          <button className="flex items-center space-x-1 rounded-lg hover:text-slate-300 text-indigo-400">
            <LifebuoyIcon className="h-5 w-5 " />
            <p>{likeCount}</p>
          </button>
          <span className="text-fray-500 self-end text-xs">
            -{createdAt.toDateString()}
          </span>
        </div>
      </div>
    </li>
  );
}
