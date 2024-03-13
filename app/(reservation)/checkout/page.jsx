"use client";
import React, { useEffect, useState } from "react";
import { Button, Divider, Image, Input, Spacer } from "@nextui-org/react";
import { format } from "date-fns";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { getSession } from "@/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    let router = useRouter();

    const [tourItems, setTourItems] = useState([]);

    const [totalAmount, setTotalAmount] = useState(0);

    const [reservation, setReservation] = useState({
        firstname: "",
        lastname: "",
        contact_no: "",
        email: "",
        address: "",
        items: [],
        promocode: "",
    });

    const [isCheckoutBtnActive, setCheckoutBtnActive] = useState(true);
    const [userSession, setUserSession] = useState(null);

    useEffect(() => {
        getReservationItems();
        getUserSession();
    }, []);

    async function getUserSession() {
        let session = await getSession();
        if (session) {
            setUserSession(session);
            setReservation((prevReservation) => ({
                ...prevReservation,
                firstname: session.user.user.firstname,
                lastname: session.user.user.lastname,
                contact_no: session.user.user.countryCode + session.user.user.contact_no,
                email: session.user.user.email,
            }));
        }
    }

    function getReservationItems() {
        let tour_items = JSON.parse(localStorage.getItem("carts")) || [];
        setTourItems(tour_items);

        let reservationItems = [];
        let totalAmount = 0;

        tour_items.forEach((item) => {
            reservationItems.push({
                tour_id: item.tour.id,
                trip_date: format(item.reservation_date, "yyyy-MM-dd"),
                type: item.tour.type,
                ticket_pass: item.ticket_pass,
                number_of_pax: 4,
                amount: item.total_amount,
                discounted_amount: item.total_amount,
                discount: 0,
            });

            totalAmount += item.total_amount;
        });

        setTotalAmount(totalAmount);

        setReservation((prevReservation) => ({
            ...prevReservation,
            items: reservationItems,
        }));
    }

    function handlePhoneNumberChange(e) {
        setReservation((prevReservation) => ({
            ...prevReservation,
            contact_no: e,
        }));
    }

    function handleEmailChange(e) {
        setReservation((prevReservation) => ({
            ...prevReservation,
            email: e.target.value,
        }));
    }

    async function handleCheckoutSubmit() {
        let body, url;
        if (userSession) {
            body = {
                reserved_user_id: userSession.user.user.id,
                items: JSON.stringify(reservation.items),
                promocode: reservation.promocode,
            };
            url = "https://staging.philippines-hoho.ph/api/v2/tour-reservations";
        } else {
            body = {
                firstname: reservation.firstname,
                lastname: reservation.lastname,
                contact_no: reservation.contact_no,
                email: reservation.email,
                address: reservation.address,
                items: JSON.stringify(reservation.items),
                promocode: reservation.promocode,
            };
            url = "https://staging.philippines-hoho.ph/api/v2/tour-reservations/guest";
        }

        const response = await fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "x-api-code": process.env.API_CODE,
                "x-api-key": process.env.API_KEY,
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            const responseData = await response.json();
            if (responseData.status == "paying") {
                router.push(responseData.url);
            }
        }

        const errorData = await response.json();
        displayError(errorData.message, errorData.error);

        setCheckoutBtnActive(true);
    }

    const displayError = (head, body) => {
        toast.error(body, head);
    };

    return (
        <div className="checkout-main-container">
            <ToastContainer />
            <div className="wrapper">
                <h2 className="text-large font-semibold mb-4">Checkout</h2>
                <div className="checkout-container">
                    <div className="checkout-details">
                        <div className="w-full mb-10">
                            {tourItems.map((tourItem, index) => (
                                <div key={index + 1} className="reservation-tour-item">
                                    <Image
                                        alt={tourItem.tour.name}
                                        className="object-cover object-top rounded-xl shadow"
                                        src={tourItem.tour.featured_image}
                                        width={"25%"}
                                        classNames={{
                                            wrapper: "w-[25%]",
                                            img: "max-h-[80px] md:max-h-[200px] md:h-[200px] w-full",
                                        }}
                                    />
                                    <div className="reservation-tour-main-content">
                                        <div className="reservation-tour-content">
                                            <h2 className="text-small sm:text-medium font-medium mb-1.5">{tourItem.tour.name}</h2>
                                            <span className="bg-primary-50 font-semibold text-primary text-[12px] text-center my-2 p-1 px-3 rounded-2xl cursor-context-menu">
                                                {tourItem.tour.type}
                                            </span>
                                            <Spacer y={4} />
                                            <h3>
                                                <small>When :</small> <span className="text-sm sm:text-medium">{format(new Date(tourItem.reservation_date), "MMMM dd, yyyy")}</span>
                                            </h3>
                                            <h3>
                                                <small>How Many :</small> <span className="text-sm sm:text-medium">{tourItem.number_of_pax} x</span>
                                            </h3>
                                            <h3>
                                                <small>Total :</small> <span className="text-sm sm:text-medium font-bold">₱ {tourItem.total_amount?.toFixed(2)}</span>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h2 className="text-large font-semibold my-4">Contact Information</h2>
                        <div className="customer-detail-form">
                            <div className="columns-1 sm:columns-2 my-3 space-y-3">
                                <Input label="Email" onInput={handleEmailChange} value={reservation.email} />
                                <div className="phone-number-input">
                                    <PhoneInput placeholder="Enter phone number" value={reservation.contact_no} onChange={(e) => handlePhoneNumberChange(e)} className="h-full" />
                                </div>
                            </div>
                            <div className="columns-1 sm:columns-2 my-3 space-y-3">
                                <Input
                                    label="First Name"
                                    value={reservation.firstname}
                                    onInput={(e) => setReservation((prevReservation) => ({ ...prevReservation, firstname: e.target.value }))}
                                />
                                <Input
                                    label="Last Name"
                                    value={reservation.lastname}
                                    onInput={(e) => setReservation((prevReservation) => ({ ...prevReservation, lastname: e.target.value }))}
                                />
                            </div>
                            <Input
                                label="Address"
                                value={reservation.address}
                                onInput={(e) => setReservation((prevReservation) => ({ ...prevReservation, address: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="checkout-summary">
                        <Input label="Promo Code" />
                        <Spacer y={4} />
                        <Divider />
                        <div className="flex justify-between my-2">
                            <div>Items :</div>
                            <div>{tourItems.length} x</div>
                        </div>
                        <div className="flex justify-between my-2">
                            <div>Discount :</div>
                            <div>₱ 0.00</div>
                        </div>
                        <div className="flex justify-between my-2">
                            <div>Total Amount :</div>
                            <div>₱ {parseFloat(totalAmount).toFixed(2)}</div>
                        </div>
                        <Divider />
                        <div className="flex justify-center mt-3">
                            <Button className="bg-primary text-white" onClick={handleCheckoutSubmit} isDisabled={!isCheckoutBtnActive}>
                                Proceed to Payment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
