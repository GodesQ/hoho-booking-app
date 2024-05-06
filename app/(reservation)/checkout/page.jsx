"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Image,
    Input,
    Spacer,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    User,
} from "@nextui-org/react";
import { format } from "date-fns";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { checkout, getSession, verifyPromoCode } from "@/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash } from "lucide-react";

export default function CheckoutPage() {
    let router = useRouter();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isPromoCodeVerify, setIsPromoCodeVerify] = useState(false);

    const [promocode, setPromoCode] = useState("");

    const [tourItems, setTourItems] = useState([]);

    const [totalAmount, setTotalAmount] = useState(0);

    const [totalDiscount, setTotalDiscount] = useState(0);

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
                number_of_pax: parseInt(item.number_of_pax),
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

    function handleRemoveCart(index) {
        // Create a copy of the current carts array
        const newTourItems = [...tourItems];

        // Remove the cart at the specified index
        newTourItems.splice(index, 1);

        // Update the state with the new array
        setTourItems(newTourItems);

        localStorage.setItem("carts", JSON.stringify(newTourItems));

        let total = 0;
        newTourItems.forEach((item) => {
            total += item.total_amount;
        });

        setTotalAmount(total);
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

        const response = await checkout(url, body);

        if (response.status == "paying") {
            router.push(response.url);
        }

        displayError(response.message, response.error);

        setCheckoutBtnActive(true);
    }

    const handleVerifyPromoCode = async () => {
        const url = "https://staging.philippines-hoho.ph/api/v2/promocodes/verify";
        const body = { code: reservation.promocode };

        const response = await verifyPromoCode(url, body);

        if (!response.promocode_exist) return displayError(response.message, response.error ?? response.message);

        let total_discount = 0;

        if (response?.data?.type == "discount") {
            if (response?.data?.discount_type == "percentage") {
                let percent = response.data.discount_amount / 100;

                reservation.items.map((item) => {
                    let discount = item.amount * percent;
                    total_discount += discount;
                    setTotalDiscount((prevDiscount) => prevDiscount + discount);
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

        toast.success("Promocode exist");
        setIsPromoCodeVerify(true);
        setReservation((prevReservation) => ({ ...prevReservation, promocode: promocode }));
        setTotalAmount((prevTotalAmount) => prevTotalAmount - total_discount);
    };

    const handlePromoCodeChange = (e) => {
        let value = e.target.value;

        let total_amount = 0;
        tourItems.forEach((item) => {
            total_amount += item.total_amount;
        });

        setTotalAmount(total_amount);
        setTotalDiscount(0);
        setPromoCode(value);
        setIsPromoCodeVerify(false);
    };

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
                                            <h3 className="text-md my-1 sm:text-md">
                                                When : {format(new Date(tourItem.reservation_date), "MMMM dd, yyyy")}
                                            </h3>
                                            <h3 className="text-md my-1 sm:text-md">
                                                Number of Pax : {tourItem.number_of_pax} pax
                                            </h3>
                                            <h3 className="text-md my-1 sm:text-md">
                                                Total : <span className="font-semibold">{tourItem.total_amount?.toFixed(2)}</span>
                                            </h3>
                                        </div>
                                        <div className="reservation-tour-content-action flex justify-end">
                                            {tourItems.length > 1 && (
                                                <Button
                                                    onPress={() => handleRemoveCart(index)}
                                                    className="bg-primary border-1 border-primary text-white text-tiny px-2 min-w-[3rem]"
                                                >
                                                    <Trash size={15} /> Remove
                                                </Button>
                                            )}
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
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        value={reservation.contact_no}
                                        onChange={(e) => handlePhoneNumberChange(e)}
                                        className="h-full"
                                    />
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
                        <div className="flex">
                            <Input label="Promo Code" value={promocode} onChange={handlePromoCodeChange} />
                            <Button className="bg-primary text-foreground h-auto" onPress={handleVerifyPromoCode}>
                                Verify
                            </Button>
                        </div>
                        <Spacer y={4} />
                        <Divider />
                        <div className="flex justify-between my-2">
                            <div>Items :</div>
                            <div>{tourItems.length} x</div>
                        </div>
                        <div className="flex justify-between my-2">
                            <div>Discount :</div>
                            <div>₱ {totalDiscount.toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between my-2">
                            <div>Total Amount :</div>
                            <div>₱ {parseFloat(totalAmount).toFixed(2)}</div>
                        </div>
                        <Divider />
                        <div className="flex justify-center mt-3">
                            <Button className="bg-primary text-white" onPress={onOpen}>
                                Review Reservation
                            </Button>
                            <Modal size={"5xl"} isOpen={isOpen} onClose={onClose} placement="center">
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
                                                                <span className="font-bold">Name:</span> {reservation.firstname}{" "}
                                                                {reservation.lastname}
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
                                                                <span className="font-bold">Discount:</span> ₱ {totalDiscount.toFixed(2)}
                                                            </li>
                                                            <li className="mb-2">
                                                                <span className="font-bold">Sub Amount:</span> ₱ {totalAmount.toFixed(2)}
                                                            </li>
                                                            <Divider className="mb-2" />
                                                            <li className="mb-2">
                                                                <span className="font-bold">Total Amount:</span> ₱ {totalAmount.toFixed(2)}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="danger" variant="light" onPress={onClose}>
                                                    Close
                                                </Button>
                                                <Button
                                                    className="bg-primary text-white"
                                                    onClick={handleCheckoutSubmit}
                                                    isDisabled={!isCheckoutBtnActive}
                                                >
                                                    Proceed to Payment
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
