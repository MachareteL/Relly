type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

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
