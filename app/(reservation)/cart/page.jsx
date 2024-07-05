"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Image } from "@nextui-org/react";
import { ReceiptText, SendHorizonal, Tag, TicketCheck, Trash, X } from "lucide-react";
import { format } from "date-fns";
import OrderSummary from "@/app/components/OrderSummary";
import CartTable from "@/app/components/CartTable";

export default function CartPage() {
    const [carts, setCarts] = useState([]);

    const [financialData, setFinancialData] = useState({
        total_amount: 0,
        sub_amount: 0,
        discount: 0,
        additional_charges: 0,
        promocode_info: {
            value: '',
            is_verify: false,
        },
    });

    useEffect(() => {
        getCartItems();
    }, []);

    async function getCartItems() {
        let cart_items = (await JSON.parse(localStorage.getItem("carts"))) || [];
        setCarts(cart_items);

        let total_items_amount = 0;

        cart_items.forEach((item) => {
            total_items_amount += item.total_amount;
        });

        setFinancialData((prevData) => ({...prevData, sub_amount: total_items_amount, total_amount: total_items_amount}))
    }

    function handleRemoveCart(index) {
        // Create a copy of the current carts array
        const newCarts = [...carts];

        // Remove the cart at the specified index
        newCarts.splice(index, 1);

        let total_item_amount = 0;

        newCarts.forEach(item => {
            total_item_amount += item.total_amount;
        });

        // Update the state with the new array
        setCarts(newCarts);
        setFinancialData((prevData) => ({...prevData, sub_amount: total_item_amount, total_amount: total_item_amount}))

        localStorage.setItem("carts", JSON.stringify(newCarts));
    }

    return (
        <div className="wrapper">
            <div className="flex justify-center items-start flex-col lg:flex-row gap-5">
                <div className="w-[100%] lg:w-[67%] travel-cart-container">
                    <div className="travel-cart-header">
                        <h2>Travel Cart</h2>
                    </div>
                    <CartTable items={carts}  handleRemoveCart={handleRemoveCart}  />
                </div>

                <OrderSummary cart_items={carts} financialData={financialData} />
            </div>
        </div>
    );
}
