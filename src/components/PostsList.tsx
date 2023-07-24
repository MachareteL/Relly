import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostModel from "./PostModel";
import { useSession } from "next-auth/react";

export default function PostsList({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore,
}: PostsListProps) {
  if (isLoading) return <>Loading...</>;
  if (isError) return <>Sorry! An error occured...</>;
  if (posts == null || posts.length == 0) return <>No posts yet, say hi!</>;
  const { data } = useSession();
  return (
    <ul>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={"Loading..."}
        className="space-y-2"
        style={{ transition: "ease-in-out 1s" }}
      >
        {posts.map((post) => (
          <PostModel
            key={post.id}
            {...post}
            className="border border-white border-opacity-30 bg-white bg-opacity-20"
            createdByCurrentUser={post.user.id == data?.user.id}
          />
        ))}
      </InfiniteScroll>
    </ul>
  );
}
