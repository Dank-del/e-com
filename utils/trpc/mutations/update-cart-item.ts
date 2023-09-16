// Create a tRPC mutation for updating the quantity of a cart item
import prisma from "@/lib/prisma";
import {authenticatedProcedure} from "@/lib/trpc";
import {z} from "zod";

const updateCartItem = authenticatedProcedure.input(z.object({
        cartItemId: z.number(),
        quantity: z.number(),
    })).mutation(async ({ ctx, input }) => {
        const { cartItemId, quantity } = input;
        const { cart } = ctx;

        // Find the cart item to update
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: cartItemId,
                cartId: cart.id,
            },
        });

        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        // Calculate the new total cost based on the updated quantity
        const product = await prisma.product.findUnique({
            where: { id: cartItem.productId },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        const newTotalCost = quantity * product.price;

        // Update the cart item with the new quantity and total cost
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: {
                quantity: quantity,
                totalCost: newTotalCost,
            },
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
    },
);

export default updateCartItem;