import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
      })
    )
    .query(async ({ input: { cursor = 0 }, ctx }) => {
      console.log(cursor);

      const currentUserID = await ctx.session?.user.id;
      const posts = await ctx.prisma.post.findMany({
        take: 11,
        skip: 10 * cursor,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: {
            select: {
              rellies: true,
            },
          },
          rellies: {
            where: {
              userId: currentUserID,
            },
          },
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (posts.length > 10) {
        const nextPost = posts.pop();
        if (nextPost != null) {
          nextCursor = cursor + 1;
        }
      }
      return {
        posts: posts.map((post) => {
          return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            likeCount: post._count.rellies,
            user: post.user,
            likedByUser: post.rellies?.length > 0,
          };
        }),
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      console.log(ctx.session);
      if (!content)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The post must contain a content",
        });
      await ctx.prisma.post.create({
        data: {
          content,
          userId: ctx.session.user.id,
        },
      });
    }),
  toggleLike: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        ammount: z.number()
      })
    )
    .mutation(async ({ input: { id, ammount = 1 }, ctx }) => {
      const data = { postId: id, userId: ctx.session.user.id, ammount };
      const like = await ctx.prisma.rellies.findUnique({
        where: {
          userId_postId: data,
        },
      });
      // if (like == null) {
        await ctx.prisma.rellies.create({ data });
        return { liked: true };
      // } else {
      //   await ctx.prisma.like.delete({ where: { userId_postId: data } });
      //   return { liked: false };
      // }
    }),
});
