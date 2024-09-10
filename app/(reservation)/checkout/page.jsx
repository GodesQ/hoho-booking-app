"use client";
import React, { useEffect, useState } from "react";
import { Button, Divider, Image, Input, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, User } from "@nextui-org/react";
import { format } from "date-fns";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { checkout, getSession, verifyPromoCode } from "@/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import OrderSummary from "@/app/components/OrderSummary";
import CartTable from "@/app/components/CartTable";

export default function CheckoutPage() {
    let router = useRouter();

    const modal1 = useDisclosure();
    const modal2 = useDisclosure();

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

    const [tourItems, setTourItems] = useState([]);

    const [reservation, setReservation] = useState({
        firstname: "",
        lastname: "",
        contact_no: "",
        email: "",
        address: "",
        items: [],
        promocode: "",
    });

    const [isBookTourBtnDisabled, setBookTourBtnDisabled] = useState(false);
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

        if(tour_items.length <= 0) router.back(); 

        setTourItems(tour_items);

        let reservationItems = [];
        let total_items_amount = 0;

        tour_items.forEach((item) => {
            reservationItems.push({
                tour_id: item.tour.id,
                trip_date: format(item.reservation_date, "yyyy-MM-dd"),
                type: item.tour.type.replace(" Tour", ""),
                ticket_pass: item.ticket_pass,
                number_of_pass: parseInt(item.number_of_pax),
                amount: item.total_amount,
                discounted_amount: item.total_amount,
                discount: 0,
            });

            total_items_amount += item.total_amount;
        });

        setFinancialData((prevData) => ({ ...prevData, total_amount: total_items_amount, sub_amount: total_items_amount }));

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
                items: reservation.items,
                promocode: reservation.promocode,
            };
            url = "https://dashboard.philippines-hoho.ph/api/v2/tour-reservations";
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
            url = "https://dashboard.philippines-hoho.ph/api/v2/tour-reservations/guest";
        }

        setBookTourBtnDisabled(true);

        const response = await checkout(url, body);
        console.log(response);

        if (response.status) {
            router.push(`/tour-reservation/success/${response.transaction.id}`);
        }

        displayError(response.message, response.error);
        setBookTourBtnDisabled(false);
    }

    const handleVerifyPromoCode = async (promocode) => {
        const url = "https://dashboard.philippines-hoho.ph/api/v2/promocodes/verify";
        const body = { code: promocode };

        const response = await verifyPromoCode(url, body);

        if (!response.promocode_exist) return displayError(response.message, response.error ?? response.message);

        let total_discount = 0;

        if (response?.data?.type == "discount") {
            if (response?.data?.discount_type == "percentage") {
                let percent = response.data.discount_amount / 100;

                reservation.items.map((item) => {
                    let discount = item.amount * percent;
                    total_discount += discount;

                    return {
                        tour_id: item.tour_id,
                        trip_date: item.trip_date,
                        type: item.type,
                        ticket_pass: item.ticket_pass,
                        number_of_pax: item.number_of_pax,
                        amount: item.amount,
                        discounted_amount: item.amount - discount,
                        discount: discount,
                    };
                });
            }
        }

        setReservation((prevReservation) => ({ ...prevReservation, promocode: promocode }));

        setFinancialData((prevData) => ({
            ...prevData,
            total_amount: prevData.total_amount - total_discount,
            discount: total_discount,
            promocode_info: {
                value: response?.data?.code,
                is_verify: true,
            }
        }));

    };

    const displayError = (head, body) => {
        toast.error(body, head);
    }

    return (
        <div className="checkout-main-container">
            <ToastContainer />
            <div className="wrapper">
                <h2 className="text-large font-semibold mb-4">Checkout</h2>
                <div className="checkout-container">
                    <div className="checkout-details">
                        <CartTable items={tourItems} />
                        <h2 className="text-large font-semibold my-4">Contact Information</h2>
                        <div className="customer-detail-form">
                            <div className="columns-1 sm:columns-2 my-3 space-y-3">
                                <Input label="Email" onInput={handleEmailChange} value={reservation.email} />
                                <div className="phone-number-input">
                                    <PhoneInput placeholder="Enter phone number" value={reservation.contact_no} onChange={(e) => handlePhoneNumberChange(e)} className="h-full" />
                                </div>
                            </div>
                            <div className="columns-1 sm:columns-2 my-3 space-y-3">
                                <Input label="First Name" value={reservation.firstname} onInput={(e) => setReservation((prevReservation) => ({ ...prevReservation, firstname: e.target.value }))} />
                                <Input label="Last Name" value={reservation.lastname} onInput={(e) => setReservation((prevReservation) => ({ ...prevReservation, lastname: e.target.value }))} />
                            </div>
                            <Input label="Address" value={reservation.address} onInput={(e) => setReservation((prevReservation) => ({ ...prevReservation, address: e.target.value }))} />
                        </div>
                    </div>

                    <OrderSummary cart_items={tourItems}
                        handleVerifyPromoCode={handleVerifyPromoCode}
                        financialData={financialData}
                        onOpen={modal1.onOpen}
                    />

                    <Modal motionProps={{ variants: { enter: { scale: "var(--scale-enter)", y: "var(--slide-enter)", opacity: 1, transition: { scale: { duration: 0.4, ease: [0.36, 0.66, 0.4, 1], }, opacity: { duration: 0.4, ease: [0.36, 0.66, 0.4, 1], }, y: { type: "spring", bounce: 0, duration: 0.6, }, }, }, exit: { scale: "var(--scale-exit)", y: "var(--slide-exit)", opacity: 0, transition: { duration: 0.3, ease: [0.36, 0.66, 0.4, 1], }, }, }, }} size={"5xl"} isOpen={modal1.isOpen} onClose={modal1.onClose} placement="center">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Review Reservation</ModalHeader>
                                    <ModalBody>
                                        <div className="flex flex-col lg:flex-row gap-7 lg:gap-4">
                                            <div className="w-[100%] lg:w-[33%] border-none lg:border-r-1  border-grey">
                                                <h2 className="mb-2 text-medium">Tour Items</h2>
                                                <div className="flex flex-column gap-2">
                                                    {tourItems.map((tourItem) => (
                                                        <User
                                                            key={tourItem.tour.id}
                                                            name={tourItem.tour.name}
                                                            description={tourItem.tour.type}
                                                            avatarProps={{
                                                                src: tourItem.tour.featured_image,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-[100%] lg:w-[33%] border-none lg:border-r-1  border-grey">
                                                <h2 className="mb-2 text-medium">Customer Details</h2>
                                                <ul>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Name:</span> {reservation.firstname} {reservation.lastname}
                                                    </li>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Email:</span> {reservation.email}
                                                    </li>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Contact Number:</span> {reservation.contact_no}
                                                    </li>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Address:</span> {reservation.address}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="w-[100%] lg:w-[33%]">
                                                <h2 className="mb-2 text-medium">Summary</h2>
                                                <ul>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Promo Code:</span> {reservation.promocode}
                                                    </li>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Items:</span> {reservation.items.length} x
                                                    </li>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Discount:</span> ₱ {financialData.discount.toFixed(2)}
                                                    </li>
                                                    <li className="mb-2">
                                                        <span className="font-bold">Sub Amount:</span> ₱ {financialData.total_amount.toFixed(2)}
                                                    </li>
                                                    <Divider className="mb-2" />
                                                    <li className="mb-2">
                                                        <span className="font-bold">Total Amount:</span> ₱ {financialData.total_amount.toFixed(2)}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button className="bg-primary text-white" onClick={handleCheckoutSubmit} isDisabled={isBookTourBtnDisabled}>
                                            Book Tour
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>

                </div>
            </div>
        </div>
    );
}
