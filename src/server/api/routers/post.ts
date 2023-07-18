import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const postRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserID = await ctx.session?.user.id;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
          likes: {
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

      if (posts.length > limit) {
        const nextPost = posts.pop();
        if (nextPost != null) {
          nextCursor = { id: nextPost.id, createdAt: nextPost.createdAt };
        }
      }
      return {
        posts: posts.map((post) => {
          return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            likeCount: post._count.likes,
            user: post.user,
            likedByUser: post.likes?.length > 0,
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
});
