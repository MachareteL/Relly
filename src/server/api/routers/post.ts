import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
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
      // const currentUserID = await ctx.session?.user.id;
      const posts = await ctx.prisma.post.findMany({
        take: 11,
        where: {
          OR: [
            {
              user: {
                followedBy: { some: { followerId: ctx.session.user.id } },
              },
            },
            {
              createdAt: {
                gt: new Date(new Date().getTime() - 4000 * 60 * 60 * 1000),
              },
            },
          ],
        },
        skip: 10 * cursor,
        orderBy: [{ createdAt: "desc" }],
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

      // const teste = await ctx.prisma.user.findMany({
      //   where: {
      //     followedBy: {
      //       some: {
      //         followerId: ctx.session.user.id,
      //       },
      //     },
      //   },
      //   include:{
      //     posts:{
      //       take: 11,
      //       skip: 10 * cursor,
      //       orderBy: {createdAt: 'desc'}
      //     },
      //     rellies: true,
      //   }
      // });

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
  getAllbyId: protectedProcedure
    .input(z.object({ id: z.string(), cursor: z.number().optional() }))
    .query(async ({ input: { id, cursor = 0 }, ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        take: 11,
        where: {
          userId: id,
        },
        skip: 10 * cursor,
        orderBy: [{ createdAt: "desc" }],
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
  getTrending: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
      })
    )
    .query(async ({ input: { cursor = 0 }, ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().getTime() - 48 * 60 * 60 * 1000),
          },
        },
        take: 11,
        skip: 10 * cursor,
        orderBy: [{ rellies: { _count: "desc" } }, { createdAt: "desc" }],
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
        authorId: z.string(),
      })
    )
    .mutation(async ({ input: { id, ammount, authorId }, ctx }) => {
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
          id: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (user.relliesAmmount == 0 || user.relliesAmmount - ammount < 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have enough resources to perform this action",
        });
      }

      const autoRelly = relly?.userId == authorId;

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
          if (!autoRelly) {
            await ctx.prisma.user.update({
              where: {
                id: authorId,
              },
              data: {
                relliesAmmount: {
                  increment: Math.round(ammount * 0.8),
                },
              },
            });
          }
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
          if (!autoRelly) {
            await ctx.prisma.user.update({
              where: {
                id: authorId,
              },
              data: {
                relliesAmmount: {
                  increment: Math.round(ammount * 0.8),
                },
              },
            });
          }
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
