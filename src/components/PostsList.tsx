import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type Posts = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByUser: boolean;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
};

type PostsListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Posts[];
};

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
