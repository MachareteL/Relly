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
  createdByCurrentUser?: boolean;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
  className?: string;
};

type PostsListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Posts[];
};

type author = {
  id: string;
  image: string | null;
  name: string | null;
};

type RellyButtonProps = {
  handleRelly: (id: string, ammount: number, authorId: string) => unknown;
  id: string;
  likedByUser: boolean;
  className: string;
  value: number;
  onClickColor: string;
  author: author;
};
