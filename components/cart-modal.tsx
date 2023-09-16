import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@nextui-org/react";
import {CartIcon} from "@/components/icons";
import {Card, CardHeader, Divider, Image} from "@nextui-org/react";
import {trpc} from "@/app/trpc";

export default function CartModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const removeItemMutation = trpc.removeCartItem.useMutation()
    const cartItems = trpc.getCart.useQuery()

    return (
        <>
            <CartIcon onClick={onOpen}/>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cart </ModalHeader>
                            <ModalBody>
                                <ol className="overflow-y-scroll max-h-80">
                                    {cartItems ? cartItems.data?.products.map((item, idx) => {
                                        return <li key={idx} className="m-3">
                                            <Card className="max-w-[400px]">
                                                <CardHeader className="flex gap-3 justify-self-end">
                                                    <Image
                                                        alt="product img"
                                                        height={40}
                                                        radius="sm"
                                                        src={item.imageUrl}
                                                        width={40}
                                                    />
                                                    <div className="flex flex-col">
                                                        <p className="text-md">{item.name}</p>
                                                        <p className="text-small text-default-500">{item.price}</p>
                                                    </div>
                                                    <div className="flex flex-row justify-end">
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            onPress={async () => {
                                                                await removeItemMutation.mutateAsync({
                                                                    productId: item.id,
                                                                    quantity: 1
                                                                })
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        </li>
                                    }) : <div>
                                        <h1>No items added to cart</h1>
                                    </div>}
                                </ol>
                            </ModalBody>
                            <Divider></Divider>
                            <div className="flex justify-end m-3">
                                <h1 className="text-3xl font-semibold text-green-600">
                                    Total: {cartItems.data?.products
                                    .reduce((accumulator, object) => {
                                        return accumulator + object.price;
                                    }, 0) || 0}
                                </h1>
                            </div>
                            <ModalFooter>
                                <Button color="danger" className="font-semibold" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" className="font-semibold" onPress={onClose}>
                                    Check Out
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
