import { NextPage, GetServerSidePropsContext } from "next";
import { ssgHelper } from "~/server/api/ssgHgelpr";
import { api } from "~/utils/api";

interface Props {
  id: string;
}

const Index: NextPage<Props> = ({ id }) => {
  console.log(id);

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
      <div className="relative h-72 w-full overflow-hidden bg-blue-500">
        <img
          src="https://picsum.photos/1280/720"
          alt="bkg"
          className="w-full"
        />
        <img
          src={data.picture!}
          alt="aa"
          className="absolute bottom-0 z-30 m-4 h-32 rounded-full "
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
