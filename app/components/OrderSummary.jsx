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

    const [financialData, setFinancialData] = useState({
        total_amount: 0,
        sub_amount: 0,
        discount: 0,
        additional_charges: 0,
        promocode_info: {},
    });

    const [promocode, setPromoCode] = useState('');
    const [hidePromoCode, setHidePromoCode] = useState(true);

    useEffect(() => {
        
        if(pathname.includes('checkout')) {
            setHidePromoCode(false);
        } else {
            setHidePromoCode(true);
        }

        getFinancialAmounts();
        setPromoCode(promocode);
    }, [props.cart_items, props.promocode]);

    const getFinancialAmounts = () => {
        let subAmount = 0;

        props.cart_items.forEach((item) => {
            subAmount += item.total_amount;
        });

        setFinancialData((prevData) => ({ ...prevData, sub_amount: subAmount, total_amount: subAmount }));
    };

    const handleVerifyPromoCode = async () => {
        const url = "https://staging.philippines-hoho.ph/api/v2/promocodes/verify";
        const body = { code: promocode };

        const response = await verifyPromoCode(url, body);

        if (!response.promocode_exist) {
            setFinancialData((prevData) => ({...prevData, promocode_info: {}}))
            return displayError(response.message, response.error ?? response.message);
        }

        toast.success('Promocode exist');

        setFinancialData((prevData) => ({...prevData, promocode_info: response.data}))

        if (response?.data?.type == "discount") {
            if(response?.data?.discount_type == "percentage") {
                let total_discount = getTotalPercentageDiscount(response.data);
                setFinancialData((prevData) => ({...prevData, discount: total_discount}));
                computeTotalAmount(total_discount);
            }
        }
    }

    const computeTotalAmount = (discount) => {
        let sub_amount = financialData.sub_amount;
        setFinancialData((prevData) => ({...prevData, total_amount: sub_amount - discount}))
    }

    const getTotalPercentageDiscount = (promocode) => {
        let percent = promocode.discount_amount / 100;
        let total_discount = 0;

        props.cart_items.forEach((item) => {
            let discount = item.total_amount * percent;
            total_discount += discount;
        });

        return total_discount;
    }

    const handlePromoCodeChange = (e) => {
        let value = e.target.value;
        setPromoCode(value);
    }

    const handleRedirectToCheckout = (e) => {
        sessionStorage.setItem('financialData', JSON.stringify(financialData));
        router.push("/checkout");
    }

    const displayError = (head, body) => {
        toast.error(body, head);
    }

    return (
        <div className="order-summary-container">
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
                        <h5>{financialData.sub_amount.toFixed(2)}</h5>
                    </div>
                    <div className="flex justify-between items-center my-2">
                        <h5 className="text-gray-400 font-medium">Discount</h5>
                        <h5 className="text-red-500 font-semibold">{financialData.discount.toFixed(2)}</h5>
                    </div>
                    <div className="flex justify-between items-center my-2">
                        <h5 className="text-gray-400 font-medium">Additional Charges</h5>
                        <h5 className="font-semibold">99.00 / Pax</h5>
                    </div>
                    <div className="flex justify-between items-center my-2">
                        <h5 className="text-gray-400 font-medium">Promo Code</h5>
                        <h5 className="text-green-600 font-semibold uppercase">{financialData?.promocode_info?.code}</h5>
                    </div>

                    <div className="border-t-1 border-gray-200 mt-4">
                        <div className="flex justify-between items-center my-2">
                            <h5 className="font-bold">Total Amount</h5>
                            <h5 className="font-bold">{financialData.total_amount.toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
                <Button onClick={handleRedirectToCheckout} className="w-[100%] bg-primary text-white mt-4">
                    CHECKOUT <SendHorizonal />
                </Button>
            </div>
        </div>
    );
};

export default OrderSummary;
