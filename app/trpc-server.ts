import {authenticatedProcedure, router} from "@/lib/trpc";
import prisma from "@/lib/prisma";
import placeOrder from "@/utils/trpc/mutations/place-order";
import updateCartItem from "@/utils/trpc/mutations/update-cart-item";
import removeCartItem from "@/utils/trpc/mutations/remove-cart-item";
import getProducts from "@/utils/trpc/queries/get-products";
import {Product} from "@prisma/client";
import getProduct from "@/utils/trpc/queries/get-product";



// this is our RPC API
export const appRouter = router({
    placeOrder: placeOrder,
    updateCart: updateCartItem,
    removeCartItem: removeCartItem,
    getProducts: getProducts,
    getCart: authenticatedProcedure.query(async (req) => {
        const cartItems =  await prisma.cart.findUniqueOrThrow({where: {id: req.ctx.cart.id}, include: {items: true}});
        const products: Product[] = [];
        cartItems.items.map(async (item) => {
            products.push(await prisma.product.findUniqueOrThrow({ where: { id: item.productId }}))
        })
        return {
            products: products,
            cartItems: cartItems
        }

    }),
    getProduct: getProduct
});

export type AppRouter = typeof appRouter;