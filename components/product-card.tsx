import {Card, CardHeader, CardBody, Image, Button} from "@nextui-org/react";
import React from "react";
import {Product} from "@prisma/client"

const ProductCard: React.FC<Partial<Product>> = (props) => (
    <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-row items-start">
            <div className="flex-col items-start">
                <p className="text-tiny uppercase font-bold">{props.name}</p>
                <small className="text-default-500">#{props.category}</small>
                <h4 className="font-bold text-large">₹{props.price}/-</h4>
            </div>
            <Button className="ml-auto" color="success">Add to Cart</Button>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
            <Image
                alt="product image"
                className="object-cover rounded-xl"
                src={props.imageUrl}
                width={270}
            />
        </CardBody>
    </Card>
)

export default ProductCard;