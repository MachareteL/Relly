import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";



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
  return (
    <ul>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={"Loading..."}
      >
        {posts.map((post) => (
          <div key={post.id}>{post.content}</div>
        ))}
      </InfiniteScroll>
    </ul>
  );
}
