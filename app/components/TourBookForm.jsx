"use client";

import React, { useEffect, useState } from "react";
import { Calendar, CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import {
    Card,
    CardBody,
    Popover,
    PopoverTrigger,
    Button,
    PopoverContent,
    Input,
    Spacer,
    ButtonGroup,
    RadioGroup,
    Radio,
    cn,
    Select,
    SelectItem,
    CardHeader,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";

import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { API_ENDPOINT } from "@/constant";
import { getTicketPasses } from "@/action";

export default function TourBookForm({ tour }) {
    const router = useRouter();
    const [ticketPasses, setTicketPasses] = useState([]);

    const [reservation, setReservation] = useState({
        tour: tour,
        reservation_date: "",
        number_of_pax: null,
        ticket_pass: null,
        total_amount: 0,
    });

    const [tourPrice, setTourPrice] = useState(tour?.price);

    const [errors, setErrors] = useState([]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        fetchTicketPasses();
    }, []);

    async function fetchTicketPasses() {
        let url = `https://staging.philippines-hoho.ph/api/v2/ticket-passes`;
        let response = await getTicketPasses(url);
        setTicketPasses(response.data);
    }

    function handleAddToCart() {
        if (handleReservationErrors()) return;

        // Retrieve existing cart data from localStorage
        let carts = JSON.parse(localStorage.getItem("carts")) || [];
        carts.push(reservation);

        // Store the updated cart data back in localStorage
        localStorage.setItem("carts", JSON.stringify(carts));
        router.push("/cart");
    }

    const handleBookNow = (e) => {
        if (handleReservationErrors()) return;

        // Retrieve existing cart data from localStorage
        let carts = JSON.parse(localStorage.getItem("carts")) || [];
        carts.push(reservation);

        // Store the updated cart data back in localStorage
        localStorage.setItem("carts", JSON.stringify(carts));
        router.push("/checkout");
    };

    function handleReservationErrors() {
        let newErrors = [];
        for (const key in reservation) {
            let key_name = key.split("_").join(" ");
            let error = `The ${key_name} is required`;

            if ((reservation[key] == null || reservation[key] == "") && key !== "ticket_pass") {
                if (!newErrors.includes(error)) {
                    newErrors.push(error);
                }
            } else {
                if (newErrors.includes(error)) {
                    newErrors = newErrors.filter((e) => e !== error);
                }
            }
        }
        setErrors(newErrors);

        return newErrors.length != 0 ? true : false;
    }

    const handleDayClick = (day, modifiers) => {
        setReservation((prevReservation) => ({
            ...prevReservation,
            reservation_date: format(day, "yyyy-MM-dd"),
        }));
    };

    const handleSelectedPax = (e) => {
        const newReservation = { ...reservation, number_of_pax: e.target.value };
        setReservation((prevReservation) => ({
            ...prevReservation,
            number_of_pax: e.target.value,
        }));
        computeTotalAmount(newReservation.number_of_pax, reservation.ticket_pass);
    };

    const computeTotalAmount = (numberOfPax, ticketPass) => {
        let totalAmount = 0;
        if (tour?.type == "Guided Tour") {
            if (numberOfPax >= 25) {
                totalAmount = tour?.bracket_price_three * numberOfPax;
            } else if (numberOfPax >= 10) {
                totalAmount = tour?.bracket_price_two * numberOfPax;
            } else {
                totalAmount = tour?.bracket_price_one * numberOfPax;
            }
        } else {
            let selectedTicketPass = ticketPasses.find((pass) => pass.name === ticketPass);
            totalAmount = selectedTicketPass?.price * numberOfPax;
        }

        setReservation((prevReservation) => ({
            ...prevReservation,
            total_amount: totalAmount,
        }));
    };

    const handleTicketPassChange = (e) => {
        let ticketPass = ticketPasses.find((ticketPass) => ticketPass.id == e.target.value);
        setTourPrice(ticketPass.price);
        setReservation((prevReservation) => ({
            ...prevReservation,
            ticket_pass: ticketPass.name,
        }));
        computeTotalAmount(reservation.number_of_pax, ticketPass.name);
    }

    const getByPassDates = (bypass_days = 0) => {
        let today = new Date();

        if (parseInt(bypass_days) < 1) return today;

        const date = today.getDate() + parseInt(bypass_days);
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const fullDate = new Date(`${year}-${month}-${date}`);
        
        return fullDate;
    }

    return (
        <div className="tour-book-form">
            <Card className="p-2">
                <CardHeader className="flex flex-col items-start gap-2">
                    {errors.length > 0 ? (
                        errors.map((error, index) => (
                            <div key={index} className="py-1.5 px-3 text-left w-full bg-primary text-white rounded">
                                {error}
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                    <h2 className="text-black text-left text-small leading-6">{tour?.name}</h2>
                    <div className="flex justify-between w-full">
                        <h2 className="text-primary text-small">₱ {parseFloat(tourPrice).toFixed(2)}</h2>
                        {tour?.type == "Guided Tour" ? (
                            <a href="#" onClick={onOpen} className="text-primary text-sm">
                                Bracket Prices
                            </a>
                        ) : (
                            <></>
                        )}
                        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1 text-large">Guided Tour Bracket Prices</ModalHeader>
                                        <ModalBody>
                                            <div className="flex justify-between items-center px-2 my-1">
                                                <div>
                                                    <h4>Bracket Price One</h4>
                                                    <small>( Minimum of 4 )</small>
                                                </div>
                                                <p className="bg-primary p-1 px-2 text-white rounded-lg text-small">
                                                    ₱ {parseFloat(tour?.bracket_price_one).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center px-2 my-1">
                                                <div>
                                                    <h4>Bracket Price Two</h4>
                                                    <small>( Minimum of 10 )</small>
                                                </div>
                                                <p className="bg-primary p-1 px-2 text-white rounded-lg text-small">
                                                    ₱ {parseFloat(tour?.bracket_price_two).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center px-2 my-1">
                                                <div>
                                                    <h4>Bracket Price Three</h4>
                                                    <small>( Minimum of 25 )</small>
                                                </div>
                                                <p className="bg-primary p-1 px-2 text-white rounded-lg text-small">
                                                    ₱ {parseFloat(tour?.bracket_price_three).toFixed(2)}
                                                </p>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="form-group gap-4">
                        <Popover placement="bottom">
                            <PopoverTrigger>
                                <Input
                                    classNames={{
                                        label: "cursor-pointer text-small",
                                        input: [
                                            "cursor-pointer",
                                            "text-left",
                                            "placeholder:text-black dark:placeholder:text-black text-small leading-6",
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
                                    disabled={[
                                        { before: getByPassDates(reservation?.tour?.bypass_days) },
                                        { dayOfWeek: reservation?.tour?.disabled_days?.map((day) => (day == 7 ? 0 : parseInt(day))) ?? [] },
                                    ]}
                                    onDayClick={handleDayClick}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Spacer y={5} />
                    <div className="form-group gap-4">
                        <Select
                            label="Number of Pax"
                            placeholder="Select Number of Pax"
                            classNames={{ base: "text-black", label: "text-small" }}
                            color="black"
                            onChange={handleSelectedPax}
                        >
                            {Array.from({ length: 100 }).map((_, index) => {
                                const paxCount = index + (tour.minimum_pax ? tour.minimum_pax : 1);
                                return (
                                    <SelectItem key={paxCount} value={paxCount} textValue={`${paxCount} Pax`} classNames={{ base: "text-small" }}>
                                        {`${paxCount} Pax`}
                                    </SelectItem>
                                );
                            })}
                        </Select>
                    </div>
                    <Spacer y={5} />
                    {tour?.type == "DIY Tour" ? (
                        <RadioGroup label="Ticket Passes">
                            {ticketPasses.length > 0 &&
                                ticketPasses.map((ticketPass) => (
                                    <CustomRadio value={ticketPass.id} key={ticketPass.id} onChange={handleTicketPassChange}>
                                        {ticketPass.name}
                                    </CustomRadio>
                                ))}
                        </RadioGroup>
                    ) : (
                        <></>
                    )}
                    <Spacer y={5} />
                    <ButtonGroup fullWidth className="gap-3">
                        <Button className="bg-transparent border-primary border-1 rounded text-primary" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                        <Button className="bg-primary text-foreground rounded" onClick={handleBookNow}>
                            Book Now
                        </Button>
                    </ButtonGroup>
                </CardBody>
            </Card>
        </div>
    );
}

export const CustomRadio = (props) => {
    const { children, ...otherProps } = props;

    return (
        <Radio
            {...otherProps}
            classNames={{
                base: cn(
                    "m-0 text-black bg-content2 hover:bg-content2 items-center justify-between",
                    `flex-row-reverse max-w-[${screen.width}px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent`,
                    "data-[selected=true]:border-primary"
                ),
                label: cn("text-black block text-small"),
            }}
        >
            {children}
        </Radio>
    );
};
