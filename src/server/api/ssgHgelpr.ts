import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "./trpc";
import { appRouter } from "./root";
import SuperJSON from "superjson";

export function ssgHelper() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: SuperJSON,
  });
}
