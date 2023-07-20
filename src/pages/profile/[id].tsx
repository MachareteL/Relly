import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { ssgHelper } from "~/server/api/ssgHgelpr";
import { api } from "~/utils/api";

const Profile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data } = api.user.getProfile.useQuery({ id });
  if (!data) {
    return <> ERROR </>;
  }
  return (
    <>
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
            className="absolute z-30 h-32 rounded-full bottom-0 m-4 "
          />
        </div>
      </div>
    </>
  );
};

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ id: string }>
) {
  const id = ctx.params?.id;
  if (!id) {
    return;
  }
  const ssg = ssgHelper();
  await ssg.user.getProfile.prefetch({ id });
  return {
    props: {
      id,
    },
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default Profile;
