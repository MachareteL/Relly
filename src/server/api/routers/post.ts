import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      console.log(ctx.session);
      await ctx.prisma.post.create({
        data: {
          content,
          userId: ctx.session.user.id,
        },
      });
    }),
});
