import { GetStaticPaths, GetStaticPropsContext } from "next";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { createInnerTRPCContext } from "~/server/api/trpc";
//{ posts }: { posts: unknown }
// console.log(posts);

export default function Profile() {
  // const { query } = useRouter();
  // const teste = api.user.getProfile.useQuery({  : query.id });

  return (
    <>
      <div>TesteEEE</div>
    </>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(
  ctx: GetStaticPropsContext<{ id: string }>
) {
  const id = ctx.params?.id;
  if (!id) {
    return;
  }
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: SuperJSON,
  });
  await ssg.user.getProfile.prefetch({ id });
  return {
    props: {},
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
