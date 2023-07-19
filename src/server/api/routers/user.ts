import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getRelliesAmmount: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id }, ctx }) => {
      const user = await ctx.prisma.rellies.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      console.log(user);
      
      if (!user) {
        new TRPCError({
          code: "NOT_FOUND",
          message: "User does not Exist",
        });
      }
      return user;
    }),
});
