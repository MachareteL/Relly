import { NextPage, GetServerSidePropsContext } from "next";
import { ProfileImage } from "~/components/ProfileImage";
import { ssgHelper } from "~/server/api/ssgHgelpr";
import { api } from "~/utils/api";

interface Props {
  id: string;
}

const Index: NextPage<Props> = ({ id }) => {
  const { data } = api.user.getProfile.useQuery({ id });
  const toggleFollow = api.user.toggleFollow.useMutation();
  function handleFollow() {
    toggleFollow.mutate({ userId: id });
  }

  if (!data) {
    return <> ERROR </>;
  }
  return (
    <div className="container m-auto flex flex-col p-4">
      <div className="relative h-52">
        <img
          src="https://picsum.photos/1280/720"
          alt="bkg"
          className="h-52 w-full"
        />
        <ProfileImage
          src={data.picture!}
          className="absolute -bottom-20 z-30 m-4 h-32 w-32"
        />
      </div>
      <button onClick={handleFollow}>Follow</button>
    </div>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ id: string }>
) => {
  const id = ctx.params?.id;
  if (!id) {
    return;
  }
  const ssg = ssgHelper();
  ssg.user.getProfile.prefetch({ id });
  return {
    props: { id },
  };
};

export default Index;
