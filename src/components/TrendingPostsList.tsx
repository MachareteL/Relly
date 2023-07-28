import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostModel from "./PostModel";
import { useSession } from "next-auth/react";

export default function TrendingPostsList({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore,
}: PostsListProps) {
  const { data } = useSession();
  if (isLoading) return <>Loading...</>;
  if (isError) return <>Sorry! An error occured...</>;
  if (posts == null || posts.length == 0) return <>No posts yet, say hi!</>;

  return (
    <ul className="">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={"Loading..."}
        className="space-y-2"
        style={{ transition: "ease-in-out 1s" }}
      >
        {posts.map((post) => {
          
          return (
            <PostModel
              key={post.id}
              {...post}
              createdByCurrentUser={post.user.id == data?.user.id}
              className="bg-white bg-opacity-20 border border-white border-opacity-30"
            />
          );
        })}
      </InfiniteScroll>
    </ul>
  );
}
