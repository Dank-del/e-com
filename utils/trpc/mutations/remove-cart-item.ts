import {authenticatedProcedure} from "@/lib/trpc";
import {z} from "zod";
import prisma from "@/lib/prisma";

const removeCartItem = authenticatedProcedure.input(z.object({
    productId: z.number(),
    quantity: z.number()
})).mutation(async ({ ctx, input }) => {
    const cartItemId = input.productId;
    const { cart } = ctx;

    // Find the cart item to remove
    const cartItem = await prisma.cartItem.findFirst({
        where: {
            id: cartItemId,
            cartId: cart.id,
        },
    });

    if (!cartItem) {
        throw new Error('Cart item not found');
    }

    // Remove the cart item from the database
    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });

    // Recalculate the total cost of the cart
    const cartItems = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
    });

    const updatedCartTotalCost = cartItems.reduce(
        (acc, item) => acc + item.totalCost,
        0
    );

    // Update the cart's total cost
    await prisma.cart.update({
        where: { id: cart.id },
        data: { totalCost: updatedCartTotalCost },
    });

    // Return the updated cart
    return await prisma.cart.findUniqueOrThrow({
        where: {id: cart.id}
    });
})

export default removeCartItem;