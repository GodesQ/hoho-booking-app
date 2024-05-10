"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import {
    Select,
    SelectItem,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Input,
} from "@nextui-org/react";
import "react-day-picker/dist/style.css";
import { API_ENDPOINT } from "@/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTicketPasses, getTours } from "@/action";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function HeroBookForm() {
    const router = useRouter();

    const tourTypeRef = useRef();

    const tourType = [
        { label: "DIY", value: "diy" },
        { label: "Guided", value: "guided" },
    ];

    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    const [tours, setTours] = useState([]);

    // This state used for selectedKeys of select tour field
    const [selectedTour, setSelectedTour] = useState("");

    const [ticketPasses, setTicketPasses] = useState([]);

    const [reservation, setReservation] = useState({
        tour: null,
        reservation_date: "",
        number_of_pax: null,
        ticket_pass: null,
        total_amount: 0,
    });

    useEffect(() => {
        fetchTicketPasses();
    }, [])

    const fetchTicketPasses = async () => {
        let url = `https://staging.philippines-hoho.ph/api/v2/ticket-passes`;
        let response = await getTicketPasses(url);
        setTicketPasses(response.data);
    }

    const handleTourTypeChange = async (e) => {
        let typeValue = e.target.value;
        let url = `https://staging.philippines-hoho.ph/api/v2/tours?type=${typeValue}`;
        let response = await getTours(url);
        setTours(response.data);
        setSelectedTour("");
    };

    const handleTourChange = (e) => {
        let tour_id = e.target.value;
        let selectedTour = tours.find((tour) => tour.id == tour_id);

        setReservation((prevReservation) => ({
            ...prevReservation,
            tour: selectedTour,
        }));

        setSelectedTour(e.target.value);

        computeTotalAmount(reservation.number_of_pax, reservation.ticket_pass, selectedTour)
    };

    const handleDayClick = (day, modifiers) => {
        setReservation((prevReservation) => ({
            ...prevReservation,
            reservation_date: format(day, "yyyy-MM-dd"),
        }));
    }

    const handleSelectedPax = (e) => {
        const newReservation = { ...reservation, number_of_pax: e.target.value };

        setReservation((prevReservation) => ({
            ...prevReservation,
            number_of_pax: e.target.value,
        }));

        computeTotalAmount(newReservation.number_of_pax, reservation.ticket_pass, reservation.tour);
    }

    const handleTicketPassChange = (e) => {
        let ticketPass = ticketPasses.find((ticketPass) => ticketPass.id == e.target.value);
        let ticketPassName = ticketPass != undefined ? ticketPass.name : null;

        setReservation((prevReservation) => ({
            ...prevReservation,
            ticket_pass: ticketPassName,
        }));

        computeTotalAmount(reservation.number_of_pax, ticketPassName, reservation.tour);
    }

    const computeTotalAmount = (numberOfPax, ticketPass, tour) => {
        let totalAmount = 0;

        if (tourTypeRef.current.value == "guided") {
            if (numberOfPax >= 25) {
                totalAmount = tour?.bracket_price_three * numberOfPax;
            } else if (numberOfPax >= 10) {
                totalAmount = tour?.bracket_price_two * numberOfPax;
            } else {
                totalAmount = tour?.bracket_price_one * numberOfPax;
            }
        } else {
            let selectedTicketPass = ticketPasses.find((pass) => pass.name === ticketPass);
            totalAmount = selectedTicketPass?.price * reservation.number_of_pax;
        }

        setReservation((prevReservation) => ({
            ...prevReservation,
            total_amount: totalAmount,
        }));
    };

    const handleCheckoutBtn = async () => {
        let errors = handleReservationErrors();
        if (errors.length > 0) return;

        setIsCheckoutLoading(true);

        // Retrieve existing cart data from localStorage
        let items = await JSON.parse(localStorage.getItem("carts")) || [];
        items.push(reservation);

        // Store the updated cart data back in localStorage
        localStorage.setItem("carts", JSON.stringify(items));

        setIsCheckoutLoading(false);

        router.push("/checkout");
    }

    const handleReservationErrors = () => {
        let errors = [];

        for (const property in reservation) {
            let normalProperty = property.replace(/_/g, ' ');

            if (reservation[property] == null || reservation[property] == '' || reservation[property] == 0) {
                if (property === 'ticket_pass') {
                    if (tourTypeRef.current.value === 'diy') {
                        toast.error(`The ${normalProperty} is required.`);
                        errors.push(normalProperty);
                    }
                } else {
                    toast.error(`The ${normalProperty} is required.`);
                    errors.push(normalProperty);
                }
            }
        }

        return errors;
    }


    return (
        <div className="hero-book-form ">
            <ToastContainer />
            <form>
                <div className="fieldset">
                    <div
                        className=" form-group flex flex-wrap md:flex-nowrap gap-4"
                        style={{ width: "20%" }}
                    >
                        <Select
                            ref={tourTypeRef}
                            label="Tour Type"
                            placeholder="Select a type of tour"
                            className="max-w-xs"
                            onChange={handleTourTypeChange}
                        >
                            {tourType.map((tourType) => (
                                <SelectItem
                                    key={tourType.value}
                                    value={tourType.value}
                                    className="text-small"
                                >
                                    {tourType.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div
                        className="form-group flex flex-wrap md:flex-nowrap gap-4"
                        style={{ width: "30%" }}
                    >
                        <Select
                            label="Tours"
                            placeholder="Select tour"
                            className="max-w-xs"
                            onChange={handleTourChange}
                            selectedKeys={selectedTour ? [selectedTour] : []}
                        >
                            {tours.length > 0 &&
                                tours.map((tour) => (
                                    <SelectItem key={tour.id} value={tour.id} title={tour.name}>
                                        {tour.name}
                                    </SelectItem>
                                ))}
                        </Select>
                    </div>
                    <div className="form-group gap-4" style={{ width: "25%" }}>
                        <Popover placement="bottom">
                            <PopoverTrigger>
                                <Input
                                    classNames={{
                                        label: "cursor-pointer",
                                        input: [
                                            "cursor-pointer",
                                            "text-left",
                                            "placeholder:text-black dark:placeholder:text-black",
                                        ],
                                        description: "text-background",
                                    }}
                                    type="date"
                                    label="Reservation Date"
                                    placeholder="MM/DD/YYYY"
                                    endContent={<Calendar size={22} color="gray" />}
                                    value={reservation.reservation_date}
                                />
                            </PopoverTrigger>
                            <PopoverContent>
                                <DayPicker
                                    selected={new Date(reservation.reservation_date)}
                                    mode="single"
                                    disabled={[{ before: new Date() }, { dayOfWeek: reservation?.tour?.disabled_days?.map(day => parseInt(day)) ?? [] }]}
                                    onDayClick={handleDayClick}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div
                        className="flex-1 form-group flex flex-wrap md:flex-nowrap gap-4"
                        style={{ width: "15%" }}
                    >
                        <Select label="Pax" placeholder="Select Pax" className="max-w-xs" onChange={handleSelectedPax}>
                            {Array.from({ length: 100 }).map((_, index) => {
                                const paxCount =
                                    index + (reservation?.tour?.minimum_pax ? reservation?.tour?.minimum_pax : 1);
                                return (
                                    <SelectItem
                                        key={paxCount}
                                        value={paxCount}
                                        textValue={`${paxCount} Pax`}
                                        classNames={{ base: "text-small" }}
                                    >
                                        {`${paxCount} Pax`}
                                    </SelectItem>
                                );
                            })}
                        </Select>
                    </div>
                    <div
                        className={"form-group flex-wrap md:flex-nowrap gap-4" + (tourTypeRef.current?.value != 'diy' ? " hidden" : "flex")}
                        style={{ width: "15%" }}
                    >
                        <Select
                            label="Ticket Pass"
                            placeholder="Select Ticket Pass"
                            className="max-w-xs"
                            onChange={handleTicketPassChange}
                        >
                            {ticketPasses.map((ticketPass) => (
                                <SelectItem key={ticketPass.id} value={ticketPass.id}>
                                    {ticketPass.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <button className="book-btn" type="button" disabled={isCheckoutLoading ? true : false} onClick={handleCheckoutBtn}>
                    {isCheckoutLoading ? 'Booking...' : 'Book Now'}
                </button>
            </form>
        </div>
    );
}
