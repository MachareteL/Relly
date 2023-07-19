import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getRelliesAmmount: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    // console.log(user);

    if (!user) {
      new TRPCError({
        code: "NOT_FOUND",
        message: "User does not Exist",
      });
    }
    return user;
  }),
});
