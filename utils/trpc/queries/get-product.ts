import {authenticatedProcedure} from "@/lib/trpc";
import prisma from "@/lib/prisma";
import z from "zod";

const getProduct = authenticatedProcedure.input(z.number()).query(async (req) => {
    return await prisma.product.findUniqueOrThrow({
        where: {
            id: req.input
        }
    });
})

export default getProduct;