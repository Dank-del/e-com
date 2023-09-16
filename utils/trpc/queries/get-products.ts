import prisma from "@/lib/prisma";
import {publicProcedure} from "@/lib/trpc";

const getProducts = publicProcedure.query(async (req) => {
    const products = await prisma.product.findMany({});
    console.log(products, "ok");
    console.log("ok")
    return products;
})

export default getProducts;