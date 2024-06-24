"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Image } from "@nextui-org/react";
import { ReceiptText, SendHorizonal, Tag, TicketCheck, Trash, X } from "lucide-react";
import { format } from "date-fns";

export default function CartPage() {
    const [carts, setCarts] = useState([]);
    const [cartTotalAmount, setCartTotalAmount] = useState(0);

    useEffect(() => {
        getCartItems();
    }, []);

    async function getCartItems() {
        let cart_items = (await JSON.parse(localStorage.getItem("carts"))) || [];
        setCarts(cart_items);
        calculateCartTotalAmount(cart_items);
    }

    function calculateCartTotalAmount(carts) {
        let totalAmount = 0;

        carts.forEach((item) => {
            totalAmount += item.total_amount;
        });

        setCartTotalAmount(totalAmount);
    }

    function handleRemoveCart(index) {
        // Create a copy of the current carts array
        const newCarts = [...carts];

        // Remove the cart at the specified index
        newCarts.splice(index, 1);

        // Update the state with the new array
        setCarts(newCarts);

        localStorage.setItem("carts", JSON.stringify(newCarts));

        calculateCartTotalAmount(newCarts);
    }

    return (
        <div className="wrapper">
            <div className="flex justify-center items-start gap-5">
                <div className="travel-cart-container">
                    <div className="travel-cart-header">
                        <h2>Travel Cart</h2>
                    </div>
                    <div className="travel-cart-body">
                        <div className="travel-cart-table">
                            <div className="travel-cart-table-header">
                                <div className="w-[45%] font-semibold">Tour Details</div>
                                <div className="w-[20%] font-semibold">Trip Date</div>
                                <div className="w-[15%] font-semibold">No. of Pax</div>
                                <div className="w-[15%] font-semibold">Total</div>
                                <div className="w-[5%]"></div>
                            </div>
                            {carts.length > 0 ? (
                                <div className="travel-cart-table-body">
                                    {carts.map((cart, index) => (
                                        <div key={index} className="flex justify-start items-start gap-4 w-full">
                                            <div className="w-[45%]">
                                                <div className="flex justify-start items-start gap-3">
                                                    <Image
                                                        alt={cart.tour.name}
                                                        className="object-cover object-top rounded-xl shadow"
                                                        src={cart.tour.featured_image}
                                                        width={"37%"}
                                                        classNames={{
                                                            wrapper: "w-[37%]",
                                                            img: "max-h-[120px] md:max-h-[120px] md:h-[120px] w-full",
                                                        }}
                                                    />
                                                    <div className="w-[63%]">
                                                        <h2 className="text-small sm:text-small font-medium mb-1.5">{cart.tour.name}</h2>
                                                        <span className="bg-primary-50 font-semibold text-primary text-[12px] text-center my-2 p-1 px-3 rounded-2xl cursor-context-menu">
                                                            {cart.tour.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-[20%]"> {format(new Date(cart.reservation_date), "MMM dd, yyyy")}</div>
                                            <div className="w-[15%]">{cart.number_of_pax} Pax</div>
                                            <div className="w-[15%]">{cart.total_amount?.toFixed(2)}</div>
                                            <div className="w-[5%]">
                                                <Button className="min-w-[100%] bg-primary text-white px-2"  onPress={() => handleRemoveCart(index)}>
                                                    <Trash size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>No Cart Item Found</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="order-summary-container">
                    <div className="order-summary-header">
                        <h2>Order Summary</h2>
                    </div>
                    <div className="order-summary-body">
                        <div className="promocode-container">
                            <div className="flex justify-start gap-2 mb-3">
                                <TicketCheck className="text-green-600" />
                                <h4 className="text-md font-semibold">Apply Promo Code</h4>
                            </div>
                            <fieldset className="flex mb-8">
                                <Input label="Promo Code" value="" className="h-auto" />
                                <Button className="bg-green-600 text-foreground h-auto font-semibold">APPLY</Button>
                            </fieldset>
                        </div>

                        <div className="summary-list">
                            <h4 className="text-md mb-5 font-semibold flex gap-2">
                                <ReceiptText className="text-primary" /> PRICE DETAILS ({carts.length} {carts.length > 1 ? "Items" : "Item"})
                            </h4>

                            <div className="flex justify-between items-center my-2">
                                <h5 className="text-gray-400 font-medium">Sub Total</h5>
                                <h5>{cartTotalAmount.toFixed(2)}</h5>
                            </div>
                            <div className="flex justify-between items-center my-2">
                                <h5 className="text-gray-400 font-medium">Discount</h5>
                                <h5 className="text-red-500 font-semibold">0.00</h5>
                            </div>
                            <div className="flex justify-between items-center my-2">
                                <h5 className="text-gray-400 font-medium">Additional Charges</h5>
                                <h5 className="font-semibold">99.00 / Pax</h5>
                            </div>
                            <div className="flex justify-between items-center my-2">
                                <h5 className="text-gray-400 font-medium">Promo Code</h5>
                                <h5 className="text-green-600 font-semibold"></h5>
                            </div>

                            <div className="border-t-1 border-gray-200 mt-4">
                                <div className="flex justify-between items-center my-2">
                                    <h5 className="font-bold">Total Amount</h5>
                                    <h5 className="font-bold">{cartTotalAmount.toFixed(2)}</h5>
                                </div>
                            </div>
                        </div>
                        <Button className="w-[100%] bg-primary text-white mt-4">
                            CHECKOUT <SendHorizonal />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
