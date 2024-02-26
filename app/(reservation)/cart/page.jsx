"use client";
import { Button, Image, Spacer } from "@nextui-org/react";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Cart() {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    getCartItems();
  }, []);

  function getCartItems() {
    let carts = JSON.parse(localStorage.getItem("carts")) || [];
    setCarts(carts);
  }

  function handleRemoveCart(index) {
    // Create a copy of the current carts array
    const newCarts = [...carts];
    
    // Remove the cart at the specified index
    newCarts.splice(index, 1);
  
    // Update the state with the new array
    setCarts(newCarts);
  }

  return (
    <div className="cart-main">
      <div className="wrapper">
        <h2 className="text-large font-semibold">Travel Cart</h2>
        <div className="cart-container my-3">
          <div className="cart-list">
            {carts.map((cart, index) => (
              <div key={index + 1} className="cart">
                <Image
                  alt={cart.tour.name}
                  className="object-cover object-top rounded-xl shadow"
                  src={`https://dashboard.philippines-hoho.ph/assets/img/tours/${cart.tour.id}/${cart.tour.featured_image}`}
                  width={"25%"}
                  classNames={{
                    wrapper: "w-[25%]",
                    img: "max-h-[200px] h-[200px] w-full",
                  }}
                />
                <div className="cart-main-content">
                  <div className="cart-content">
                    <h2 className="text-medium font-medium mb-1.5">
                      {cart.tour.name}
                    </h2>
                    <span className="bg-primary-50 font-semibold text-primary text-[12px] text-center my-2 p-1 px-3 rounded-2xl cursor-context-menu">
                      {cart.tour.type}
                    </span>
                    <Spacer y={4} />
                    <h3><small>When :</small> <span>{format(new Date(cart.reservation_date), 'MMMM dd, yyyy')}</span></h3>
                    <h3><small>How Many :</small> <span>{cart.number_of_pax} x</span></h3>
                    <h3><small>Total :</small> <span className="font-bold">{cart.total_amount.toFixed(2)}</span></h3>
                  </div>
                  <div className="cart-content-action flex justify-end">
                    <Button onPress={() => handleRemoveCart(index)} className="bg-primary border-1 border-primary text-white text-tiny px-2 min-w-[3rem]">
                      <Trash size={15} /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-form">

          </div>
        </div>
      </div>
    </div>
  );
}
