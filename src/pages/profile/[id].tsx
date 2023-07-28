import type { NextPage, GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import PostsList from "~/components/PostsList";
import { ProfileImage } from "~/components/ProfileImage";
import { ssgHelper } from "~/server/api/ssgHgelpr";
import { api } from "~/utils/api";

interface Props {
  id: string;
}

const Index: NextPage<Props> = ({ id }) => {
  const { data: user } = useSession({ required: true });
  const { data } = api.user.getProfile.useQuery({ id });
  const ctx = api.useContext();
  const toggleFollow = api.user.toggleFollow.useMutation({
    onSuccess: async () => {
      await ctx.user.getProfile.invalidate();
    },
  });
  function handleFollow() {
    toggleFollow.mutate({ userId: id });
  }
  if (!data) {
    return <> ERROR </>;
  }
  return (
    <div className="container m-auto flex flex-col sm:p-4">
      <img
        src="https://picsum.photos/1280/720"
        alt="bkg"
        className="h-32 w-full sm:h-48 rounded-t-md"
      />
      <div className="flex items-center space-x-2 bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(255,255,255,0.2)] px-4 py-4 rounded-b-md">
        <ProfileImage
          src={data.picture}
          className="h-16 w-16 sm:h-32 sm:w-32"
        />
        <div>
          <div className="flex items-center space-x-4">
            <h1>{data.name}</h1>
            {id != user?.user.id ? (
              <button
                onClick={handleFollow}
                className={`w-20 rounded-md px-2 py-1 ${
                  !data.followedByCurrentUser
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white bg-opacity-30"
                }`}
              >
                {!data.followedByCurrentUser ? "Follow" : "Unfollow"}
              </button>
            ) : null}
          </div>
          <div className="flex justify-between space-x-4">
            <div>
              <h1>{data.followingCount} Following</h1>
            </div>
            <div>
              <h1>{data.followedByCount} Followers</h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        <UserPosts id={id} />
      </div>
    </div>
  );
};

function UserPosts({ id }: { id: string }) {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.post.getAllbyId.useInfiniteQuery(
      { id },
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

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ id: string }>
) => {
  const id = ctx.params?.id;
  if (!id) {
    return;
  }
  const ssg = ssgHelper();
  await ssg.user.getProfile.prefetch({ id });
  return {
    props: { id },
  };
};

export default Index;
