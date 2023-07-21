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
        include: {
          rellies: true,
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      });

      // const posts = await ctx.prisma.post.findMany({
      //   take: 11,
      //   skip: 10 * cursor,
      //   orderBy: { createdAt: "desc" },
      //   select: {
      //     id: true,
      //     content: true,
      //     createdAt: true,
      //     _count: {
      //       select: {
      //         rellies: true,
      //       },
      //     },
      //     rellies: {
      //       where: {
      //         userId: currentUserID,
      //       },
      //     },
      //     user: {
      //       select: {
      //         name: true,
      //         id: true,
      //         image: true,
      //       },
      //     },
      //   },
      // });

      let nextCursor: typeof cursor | undefined;
      if (posts.length > 10) {
        const nextPost = posts.pop();
        if (nextPost != null) {
          nextCursor = cursor + 1;
        }
      }
      return {
        posts: posts.map((post) => {
          let likeCount = 0;
          post.rellies.map((relly) => {
            if (relly.ammount) {
              likeCount += relly.ammount;
            }
          });
          return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            likeCount,
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
  relly: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        ammount: z.number(),
      })
    )
    .mutation(async ({ input: { id, ammount }, ctx }) => {
      const data = { postId: id, userId: ctx.session.user.id };
      const relly = await ctx.prisma.rellies.findUnique({
        where: {
          userId_postId: data,
        },
      });
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          relliesAmmount: true,
        },
      });
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      if (user.relliesAmmount == 0 || user.relliesAmmount - ammount <= 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have enough resources to perform this action",
        });
      }

      if (relly == null) {
        try {
          await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              relliesAmmount: { decrement: ammount },
            },
          });
          await ctx.prisma.rellies.create({
            data: { postId: id, userId: ctx.session.user.id, ammount },
          });
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      } else {
        try {
          await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              relliesAmmount: { decrement: ammount },
            },
          });
          await ctx.prisma.rellies.update({
            where: { userId_postId: data },
            data: { ammount: { increment: ammount } },
          });
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      }
      return relly;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      if (!id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const post = await ctx.prisma.post.findUnique({
        where: {
          id,
        },
      });
      if (post) {
        await ctx.prisma.post.delete({
          where: {
            id,
          },
        });
        return { deleted: true };
      }
      return { deleted: false };
    }),
});
