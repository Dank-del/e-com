import {initTRPC, TRPCError} from "@trpc/server";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import prisma from "@/lib/prisma";

export const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const authenticatedProcedure = publicProcedure.use(async (opts) => {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email!
        }
    })

    if (!session) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to perform this action.',
        });
    }
    if (!user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Sign up again, the provided credentials do not match any user in the database',
        });
    }

    const cart = await prisma.cart.findFirstOrThrow({
        where: {
            userId: user.id
        }
    })

    return opts.next({ ...opts, ctx: { ...opts.ctx, session, user, cart } });
});