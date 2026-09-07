import { t } from "./trpc";

export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new Error("UNAUTHORIZED"); // replace with TRPCError in real code
  }
  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

export const requireRole = (role: string) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user || (ctx.session.user as any).role !== role) {
      throw new Error("FORBIDDEN");
    }
    return next();
  });
