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
      <img src={data.picture!} alt="" className="rounded-full" />
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
