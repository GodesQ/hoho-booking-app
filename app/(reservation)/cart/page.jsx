"use client";
import { Button, Card, CardBody, Image, Spacer } from "@nextui-org/react";
import { format } from "date-fns";
import { ShoppingCart, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const [carts, setCarts] = useState([]);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);

  useEffect(() => {
    getCartItems();
  }, []);

  function getCartItems() {
    let cart_items = JSON.parse(localStorage.getItem("carts")) || [];
    setCarts(cart_items);
    calculateCartTotalAmount(cart_items);
  }

  function handleRemoveCart(index) {
    // Create a copy of the current carts array
    const newCarts = [...carts];

    // Remove the cart at the specified index
    newCarts.splice(index, 1);

    // Update the state with the new array
    setCarts(newCarts);

    localStorage.setItem('carts', JSON.stringify(newCarts));

    calculateCartTotalAmount(newCarts);
  }

  function calculateCartTotalAmount(carts) {
    let totalAmount = 0;

    carts.forEach(item => {
      totalAmount += item.total_amount;
    });

    setCartTotalAmount(totalAmount);
  }

  function handleCheckoutRedirect() {
    router.push('/checkout');
  }

  return (
    <div className="cart-main">
      <div className="wrapper">
        <h2 className="text-large font-semibold">Travel Cart</h2>
        {
          carts.length > 0 ? (
            <div className="cart-container my-3">
              <div className="cart-list">
                {carts.map((cart, index) => (
                  <div key={index + 1} className="reservation-tour-item">
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
                    <div className="reservation-tour-main-content">
                      <div className="reservation-tour-content">
                        <h2 className="text-medium font-medium mb-1.5">
                          {cart.tour.name}
                        </h2>
                        <span className="bg-primary-50 font-semibold text-primary text-[12px] text-center my-2 p-1 px-3 rounded-2xl cursor-context-menu">
                          {cart.tour.type}
                        </span>
                        <Spacer y={4} />
                        <h3><small>When :</small> <span>{format(new Date(cart.reservation_date), 'MMMM dd, yyyy')}</span></h3>
                        <h3><small>How Many :</small> <span>{cart.number_of_pax} x</span></h3>
                        <h3><small>Total :</small> <span className="font-bold">{cart.total_amount?.toFixed(2)}</span></h3>
                      </div>
                      <div className="reservation-tour-content-action flex justify-end">
                        <Button onPress={() => handleRemoveCart(index)} className="bg-primary border-1 border-primary text-white text-tiny px-2 min-w-[3rem]">
                          <Trash size={15} /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
                }
              </div>
              <div className="cart-form">
                <h2 className="text-medium font-semibold">Cart Summary</h2>
                <div className="flex justify-between my-2">
                  <div>Items :</div>
                  <div>{carts.length} x</div>
                </div>
                <div className="flex justify-between my-2">
                  <div>Total Amount :</div>
                  <div>{cartTotalAmount.toFixed(2)}</div>
                </div>
                <hr />
                <button onClick={handleCheckoutRedirect} className="bg-primary hover:bg-primary-900 py-3 px-4 my-2 text-small text-white rounded w-full">Checkout</button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mt-5">
              <Card className="px-4 py-5 max-w-[600px]">
                <CardBody className="text-black text-center">
                  <h2 className="text-medium mb-3"><ShoppingCart color="primary" /> Your Travel Cart</h2>
                  <p>There are no items in your travel cart. Click on "Continue Shopping" to resume your shopping.</p>
                  <Spacer y={5} />
                  <div className="text-center">
                    <Link href="/" className="bg-primary text-white py-3 px-4 rounded max-w-[100px] text-small">Continue Shopping</Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          )
        }
      </div>
    </div>
  );
}
