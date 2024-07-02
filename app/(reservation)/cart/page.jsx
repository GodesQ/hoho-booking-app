"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Image } from "@nextui-org/react";
import { ReceiptText, SendHorizonal, Tag, TicketCheck, Trash, X } from "lucide-react";
import { format } from "date-fns";
import OrderSummary from "@/app/components/OrderSummary";
import CartTable from "@/app/components/CartTable";

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
                    <CartTable items={carts}  handleRemoveCart={handleRemoveCart}  />
                </div>

                <OrderSummary cart_items={carts}/>
            </div>
        </div>
    );
}
