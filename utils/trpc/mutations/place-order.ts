// Create a tRPC mutation for placing an order
import {authenticatedProcedure} from "@/lib/trpc";
import {z} from "zod";
import prisma from "@/lib/prisma";

const placeOrder = authenticatedProcedure.input(z.object({
    shippingInfo: z.object({
        // Define your shipping info schema here
    }),
    paymentInfo: z.object({
        // Define your payment info schema here
    }),
})).mutation(async ({ctx, input}) => {
    const {shippingInfo, paymentInfo} = input;
    const {cart, user} = ctx;

    const getCart = await prisma.cart.findUniqueOrThrow({
        where: {id: cart.id}, include: {
            items: true
        }
    })

    // logic to place the order, create an order record, etc.

    const order = await prisma.order.create({
        data: {
            user: {connect: {id: user.id}},
            // shippingInfo: {create: shippingInfo},
            // paymentInfo: {create: paymentInfo},
            totalCost: cart.totalCost,
            orderedItems: {
                createMany: {
                    // @ts-ignore
                    data: getCart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        },
    });

    // Example: Clear the user's cart after placing the order
    await prisma.cartItem.deleteMany({
        where: {cartId: cart.id},
    });
});

export default placeOrder;