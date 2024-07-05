"use client";
import { verifyPromoCode } from "@/action";
import { Button, Input } from "@nextui-org/react";
import { ReceiptText, SendHorizonal, TicketCheck } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderSummary = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [promocode, setPromoCode] = useState('');
    const [hidePromoCode, setHidePromoCode] = useState(true);

    useEffect(() => {
        
        if(pathname.includes('checkout')) {
            setHidePromoCode(false);
        } else {
            setHidePromoCode(true);
        }

        setPromoCode(promocode);
    }, [props.cart_items, props.promocode]);


    const handleVerifyPromoCode = async () => {
        props.handleVerifyPromoCode(promocode);
    }

    const handlePromoCodeChange = (e) => {
        let value = e.target.value;
        setPromoCode(value);
    }

    const handleRedirectToCheckout = (e) => {
        router.push("/checkout");
    }

    const displayError = (head, body) => {
        toast.error(body, head);
    }

    return (
        <div className="w-full lg:w-[33%] order-summary-container">
            <ToastContainer />
            <div className="order-summary-header">
                <h2>Order Summary</h2>
            </div>
            <div className="order-summary-body">
                <div className={`promocode-container ${hidePromoCode ? 'hidden' : ''}`}>
                    <div className="flex justify-start gap-2 mb-3">
                        <TicketCheck className="text-green-600" />
                        <h4 className="text-md font-semibold">Apply Promo Code</h4>
                    </div>
                    <fieldset className="flex mb-8">
                        <Input label="Promo Code" value={promocode} onChange={handlePromoCodeChange} className="h-auto" />
                        <Button onClick={handleVerifyPromoCode} className="bg-green-600 text-foreground h-auto font-semibold">
                            APPLY
                        </Button>
                    </fieldset>
                </div>

                <div className="summary-list">
                    <h4 className="text-md mb-5 font-semibold flex gap-2">
                        <ReceiptText className="text-primary" /> PRICE DETAILS ({props.cart_items.length} {props.cart_items.length > 1 ? "Items" : "Item"})
                    </h4>

                    <div className="flex justify-between items-center my-2">
                        <h5 className="text-gray-400 font-medium">Sub Total</h5>
                        <h5>{props.financialData.sub_amount.toFixed(2)}</h5>
                    </div>
                    <div className="flex justify-between items-center my-2">
                        <h5 className="text-gray-400 font-medium">Discount</h5>
                        <h5 className="text-red-500 font-semibold">{props.financialData.discount.toFixed(2)}</h5>
                    </div>
                    <div className="flex justify-between items-center my-2">
                        <h5 className="text-gray-400 font-medium">Additional Charges</h5>
                        <h5 className="text-black-500 font-semibold">99 / Pax</h5>
                    </div>
                    <div className="flex justify-between items-center my-2">
                        <h5 className="text-gray-400 font-medium">Promo Code</h5>
                        <h5 className="text-green-600 font-semibold uppercase">{props?.financialData?.promocode_info?.value}</h5>
                    </div>

                    <div className="border-t-1 border-gray-200 mt-4">
                        <div className="flex justify-between items-center my-2">
                            <h5 className="font-bold">Total Amount</h5>
                            <h5 className="font-bold">{props.financialData.total_amount.toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
                {
                    props?.onOpen ? (
                        <Button onPress={props.onOpen} className={`w-[100%] bg-primary text-white mt-4 ${props?.cart_items?.length <= 0 ? 'hidden' : null }`}>
                            Review Reservation <SendHorizonal />
                        </Button>
                    ) :
                    (
                        <Button onClick={handleRedirectToCheckout} className={`w-[100%] bg-primary text-white mt-4 ${props?.cart_items?.length <= 0 ? 'hidden' : null }`}>
                            CHECKOUT <SendHorizonal />
                        </Button>
                    )
                }
                
            </div>
        </div>
    );
};

export default OrderSummary;
