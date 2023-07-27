import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
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
  getProfile: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          _count: {
            select: { followedBy: true, following: true, posts: true },
          },
          followedBy:
            currentUserId == null
              ? undefined
              : { where: { followerId: currentUserId } },
        },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This profile does not exist.",
        });
      }
      return {
        name: profile.name,
        picture: profile.image,
        followedByCount: profile._count.followedBy,
        followingCount: profile._count.following,
        postsCount: profile._count.posts,
        followedByCurrentUser: profile.followedBy.length > 0,
      };
    }),
  toggleFollow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input: { userId }, ctx }) => {
      const follow = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
          followedBy: { some: { followerId: ctx.session.user.id } },
        },
      });
      if (follow == null) {
        await ctx.prisma.follows.create({
          data: {
            followerId: ctx.session.user.id,
            followingId: userId,
          },
        });
        // await ctx.prisma.user.update({
        //   where: { id: userId },
        //   data: {
        //     followedBy: {
        //       connect: {
        //         followerId_followingId: {
        //           followerId: ctx.session.user.id,
        //           followingId: userId,
        //         },
        //       },
        //     },
        //   },
        // });
      } else {
        // await ctx.prisma.user.update({
        //   where: { id: userId },
        //   data: {
        //     followedBy: {
        //       disconnect: {
        //         followerId_followingId: {
        //           followerId: ctx.session.user.id,
        //           followingId: userId,
        //         },
        //       },
        //     },
        //   },
        // });
        await ctx.prisma.follows.delete({
          where: {
            followerId_followingId: {
              followerId: ctx.session.user.id,
              followingId: userId,
            },
          },
        });
      }
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({ name: z.string().optional(), image: z.string().optional() })
    )
    .mutation(async ({ input: { name, image }, ctx }) => {
      const data = { name, image };
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data,
      });
      return user
    }),
});
