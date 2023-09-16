
import {z} from "zod";
import prisma from "@/lib/prisma";
import {authenticatedProcedure} from "@/lib/trpc";

// Define the input schema using Zod
const addToCartInput = z.object({
    productId: z.number(),
    quantity: z.number(),
});

// Define the mutation handler
const addToCart = authenticatedProcedure.input(addToCartInput).mutation(
    async ({ctx, input}) => {
        const {productId, quantity} = input;
        const {cart} = ctx;

        // Fetch the product based on the productId
        const product = await prisma.product.findUnique({
            where: {id: productId},
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // Check if the product is already in the cart
        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        });

        // Calculate the total cost of the cart item
        const totalCost = quantity * product.price;

        // Update or create the cart item
        if (existingCartItem) {
            // If the item already exists in the cart, update the quantity and total cost
            await prisma.cartItem.update({
                where: {id: existingCartItem.id},
                data: {
                    quantity: existingCartItem.quantity + quantity,
                    totalCost: existingCartItem.totalCost + totalCost,
                },
            });
        } else {
            // If the item doesn't exist in the cart, create a new cart item
            await prisma.cartItem.create({
                data: {
                    cart: {connect: {id: cart.id}},
                    product: {connect: {id: productId}},
                    quantity: quantity,
                    totalCost: totalCost,
                },
            });
        }

        // Recalculate the total cost of the cart
        const cartItems = await prisma.cartItem.findMany({
            where: {cartId: cart.id},
        });

        const updatedCartTotalCost = cartItems.reduce(
            (acc, item) => acc + item.totalCost,
            0
        );

        // Update the cart's total cost
        await prisma.cart.update({
            where: {id: cart.id},
            data: {totalCost: updatedCartTotalCost},
        });

        // Return the updated cart
        return await prisma.cart.findUniqueOrThrow({
            where: {id: cart.id}
        });
    },
);

export default addToCart;