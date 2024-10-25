"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { Select, SelectItem, Spacer } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { countries } from "@/data/countries";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import { toast } from "react-toastify";
import validatePassenger from "@/utils/validate_passenger";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function TravelTaxPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [currentPassenger, setCurrentPassenger] = useState({
        firstname: "",
        lastname: "",
        middlename: "",
        suffix: "",
        passport_number: "",
        ticket_number: "",
        mobile_number: "",
        email_address: "",
        confirm_email: "",
        destination: "",
        departure_date: "",
        class: "business class",
        passenger_type: "",
        amount: 1620.0,
    });

    const [phone, setPhone] = useState("");

    const [currentFormState, setCurrentFormState] = useState("add");

    const [passengerFormErrors, setPassengerFormErrors] = useState({});

    const [travelTaxData, setTravelTaxData] = useState({
        user_id: "",
        amount: 0,
        processing_fee: 0,
        discount: 0,
        total_amount: 0,
        passengers: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPassenger((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));

        if (name == "class") {
            setCurrentPassenger((prevDetails) => ({
                ...prevDetails,
                amount: value === "business class" ? 1620.0 : 2700.0,
            }));
        }
    };

    const handleAddPassenger = () => {
        const errors = validatePassenger(currentPassenger);
        if (Object.keys(errors).length != 0) {
            setPassengerFormErrors(errors);
            toast.error("Failed to add passenger. Please check all fields.");
            return;
        }

        let passenger = currentPassenger;

        if (travelTaxData.passengers.length == 0) {
            passenger.passenger_type = "primary";
        } else {
            passenger.passenger_type = "normal";
        }

        let sub_amount = travelTaxData.amount + passenger.amount;
        let total_processing_fee = computeTotalProcessingFee(sub_amount);
        let total = sub_amount + total_processing_fee;

        setTravelTaxData((prevState) => ({
            ...prevState,
            amount: sub_amount,
            processing_fee: total_processing_fee,
            total_amount: total,
            passengers: [...prevState.passengers, passenger], // Add currentPassenger to the passengers array
        }));

        clearCurrentPassengerValues();

        toast.success("Passenger Added Successfully");
    };

    const computeTotalProcessingFee = (sub_amount) => {
        const processingFeePercentage = 0.05;

        return sub_amount * processingFeePercentage;
    };

    const clearCurrentPassengerValues = () => {
        // Optionally, reset currentPassenger after adding it
        setCurrentPassenger({
            firstname: "",
            lastname: "",
            middlename: "",
            suffix: "",
            passport_number: "",
            ticket_number: "",
            mobile_number: "",
            email_address: "",
            confirm_email: "",
            destination: "",
            departure_date: "",
            class: "business class",
            passenger_type: "",
            amount: 1620.0,
        });
    };

    const handleEditPassenger = (index) => {
        setCurrentFormState("update");
        let passenger = travelTaxData.passengers[index];
        passenger.index = index;
        setCurrentPassenger(passenger);
    };

    const handleCancelForm = () => {
        setCurrentFormState("add");
        clearCurrentPassengerValues();
    };

    const handleUpdatePassenger = () => {
        const errors = validatePassenger(currentPassenger);
        if (Object.keys(errors).length != 0) {
            setPassengerFormErrors(errors);
            toast.error("Failed to add passenger. Please check all fields.");
            return;
        }

        setTravelTaxData((prevState) => {
            const updatedPassengers = [...prevState.passengers]; // Clone the passengers array
            updatedPassengers[currentPassenger.index] = { ...currentPassenger }; // Update the passenger at the specific index
            delete updatedPassengers[currentPassenger.index].index; // Remove the index property

            let sub_amount = travelTaxData.amount + currentPassenger.amount;
            let total_processing_fee = computeTotalProcessingFee(sub_amount);
            let total = sub_amount + total_processing_fee;

            return {
                ...prevState,
                processing_fee: total_processing_fee,
                amount: sub_amount,
                total_amount: total,
                passengers: updatedPassengers, // Set the updated passengers array
            };
        });

        clearCurrentPassengerValues();
        toast.success("Passenger Updated Successfully");
    };

    const handleNextStep = () => {
        if (travelTaxData.passengers.length === 0) {
            toast.error("No Passengers Found. Please add atleast one passenger.");
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmitTravelTax = async () => {
        try {
            const response = await axios.post(`https://staging.philippines-hoho.ph/api/v2/travel-tax`, travelTaxData, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-api-code": "hoho-code-hohobookingwebsite030524",
                    "x-api-key": "hoho-keycL0QsUu5pejVaN9GBRfekKRAN030524",
                },
            });

            if (response.data.status == "paying") {
                return router.push(response.data.url);
            }
        } catch (error) {
            toast.error(error.message ?? "Server Error");
        }
    };

    return (
        <div>
            <Navbar isWithHeader={false} />
            <Spacer y={120} />
            <div className="section-container min-h-[80vh]">
                <h2 className="font-bold text-2xl">Pay Travel Tax</h2>
                <div className="shadow w-full p-6 rounded mt-4">
                    <Accordion>
                        <AccordionItem
                            key="1"
                            aria-label="Accordion 1"
                            title=" Notes for multiple passengers in one transaction"
                            className="bg-warning-100"
                            classNames={{
                                base: "px-4 rounded border border-warning",
                                title: "text-md text-black font-semibold",
                                indicator: "text-black black",
                                content: "text-black text-sm font-medium",
                            }}
                        >
                            <ul className="list-inside list-disc flex flex-col gap-2">
                                <li>A maximum of five (5) passengers can be added in one transaction.</li>
                                <li>
                                    All passengers within the same transaction may be on different flights (different flight dates and destination) and will retain the same Mobile Number, E-mail
                                    Address, information of the first added passenger (Primary).
                                </li>
                                <li>Only one (1) Acknowledgement Receipt (AR) will be issued to the Primary passenger for all passengers under the same transaction.</li>
                            </ul>
                        </AccordionItem>
                    </Accordion>

                    <form className="my-3">
                        <div className={`${currentStep == 1 ? "block" : "hidden"}`}>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="form-group sm:col-span-1 col-span-4">
                                    <label aria-label="firstname" htmlFor="firstname" className="form-label">
                                        First Name
                                    </label>
                                    <input
                                        className={`form-control ${passengerFormErrors?.firstname && "border border-danger"}`}
                                        value={currentPassenger.firstname}
                                        onChange={handleChange}
                                        name="firstname"
                                        id="firstname"
                                    />
                                </div>
                                <div className="form-group sm:col-span-1 col-span-4">
                                    <label aria-label="lastname" htmlFor="lastname" className="form-label">
                                        Last Name
                                    </label>
                                    <input
                                        className={`form-control ${passengerFormErrors?.lastname && "border border-danger"}`}
                                        value={currentPassenger.lastname}
                                        onChange={handleChange}
                                        name="lastname"
                                        id="lastname"
                                    />
                                </div>
                                <div className="form-group sm:col-span-1 col-span-4">
                                    <label aria-label="middlename" htmlFor="middlename" className="form-label">
                                        Middle Name <span className="text-warning text-sm">(Optional)</span>
                                    </label>
                                    <input className={`form-control`} value={currentPassenger.middlename} onChange={handleChange} name="middlename" id="middlename" />
                                </div>
                                <div className="form-group sm:col-span-1 col-span-4">
                                    <label aria-label="suffix" htmlFor="suffix" className="form-label">
                                        Suffix <span className="text-warning text-sm">(Optional)</span>
                                    </label>
                                    <input className={`form-control`} value={currentPassenger.suffix} onChange={handleChange} name="suffix" id="suffix" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="form-group sm:col-span-1 col-span-4">
                                    <label aria-label="passport_number" htmlFor="passport_number" className="form-label">
                                        Passport Number
                                    </label>
                                    <input
                                        className={`form-control ${passengerFormErrors?.passport_number && "border border-danger"}`}
                                        value={currentPassenger.passport_number}
                                        onChange={handleChange}
                                        name="passport_number"
                                        id="passport_number"
                                    />
                                </div>
                                <div className="form-group sm:col-span-1 col-span-4">
                                    <label aria-label="ticket_number" htmlFor="ticket_number" className="form-label">
                                        Ticket Number / Booking Reference Number
                                    </label>
                                    <input
                                        className={`form-control ${passengerFormErrors?.ticket_number && "border border-danger"}`}
                                        value={currentPassenger.ticket_number}
                                        onChange={handleChange}
                                        name="ticket_number"
                                        id="ticket_number"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="form-group sm:col-span-1 col-span-2">
                                    <RadioGroup
                                        label="Class"
                                        className="text-black"
                                        onChange={handleChange}
                                        name="class"
                                        classNames={{
                                            description: "text-black black",
                                            label: "form-label",
                                        }}
                                        defaultValue={currentPassenger.class}
                                    >
                                        <Radio
                                            value="first class"
                                            classNames={{
                                                label: "text-black text-md",
                                            }}
                                        >
                                            First Class
                                        </Radio>
                                        <Radio
                                            value="business class"
                                            classNames={{
                                                label: "text-black text-md",
                                            }}
                                        >
                                            Economy/Business Class
                                        </Radio>
                                    </RadioGroup>
                                </div>
                                <div className="form-group sm:col-span-1 col-span-2">
                                    <label aria-label="amount" htmlFor="amount" className="form-label">
                                        Amount
                                    </label>
                                    <input type="text" className="form-control" readOnly value={currentPassenger.amount.toFixed(2)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="form-group sm:col-span-1 col-span-3">
                                    <label aria-label="mobile_number" htmlFor="mobile_number" className="form-label">
                                        Mobile Number
                                    </label>
                                    <PhoneInput
                                        prefix=""
                                        defaultCountry="ph"
                                        value={currentPassenger.mobile_number}
                                        onChange={(phone) => setCurrentPassenger((prevPassenger) => ({ ...prevPassenger, mobile_number: phone }))}
                                    />
                                </div>
                                <div className="form-group sm:col-span-1 col-span-3">
                                    <label aria-label="email_address" htmlFor="email_address" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${passengerFormErrors?.email_address && "border border-danger"}`}
                                        value={currentPassenger.email_address}
                                        onChange={handleChange}
                                        name="email_address"
                                        id="email_address"
                                    />
                                </div>

                                <div className="form-group sm:col-span-1 col-span-3">
                                    <label aria-label="confirm_email" htmlFor="confirm_email" className="form-label">
                                        Confirm Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${passengerFormErrors?.confirm_email && "border border-danger"}`}
                                        value={currentPassenger.confirm_email}
                                        onChange={handleChange}
                                        name="confirm_email"
                                        id="confirm_email"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="form-group sm:col-span-1 col-span-3">
                                    <label aria-label="destination" htmlFor="destination" className="form-label">
                                        Destination
                                    </label>
                                    <Select
                                        aria-label="destination"
                                        placeholder="Select Destination"
                                        onChange={handleChange}
                                        name="destination"
                                        classNames={{
                                            base: `w-full`,
                                            mainWrapper: "w-full ",
                                            trigger: `py-2 border bg-white hover:bg-white ${passengerFormErrors?.destination && "border-danger"}`,
                                        }}
                                    >
                                        {countries.map((country) => (
                                            <SelectItem key={country.key}>{country.label}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="form-group sm:col-span-1 col-span-3">
                                    <label aria-label="departure_date" htmlFor="departure_date" className="form-label">
                                        Departure Date
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control ${passengerFormErrors?.departure_date && "border border-danger"}`}
                                        value={currentPassenger.departure_date}
                                        onChange={handleChange}
                                        name="departure_date"
                                        id="departure_date"
                                    />
                                </div>
                                <div className="flex items-center w-full xl:w-auto">
                                    {currentFormState === "add" ? (
                                        <button className="py-3 px-4 mt-3 bg-primary text-white rounded w-full xl:w-auto" type="button" onClick={handleAddPassenger}>
                                            Add Passenger
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button className="py-3 px-4 mt-3 bg-primary text-white rounded w-full xl:w-auto" type="button" onClick={handleUpdatePassenger}>
                                                Update Passenger
                                            </button>
                                            <button className="py-3 px-4 mt-3 bg-primary-100 text-primary border border-primary rounded w-full xl:w-auto" type="button" onClick={handleCancelForm}>
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`${currentStep == 2 ? "block" : "hidden"}`}>
                            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h4>
                                        Total of Passengers: <span className="font-bold">{travelTaxData.passengers.length} x</span>
                                    </h4>
                                </div>
                                <div>
                                    <h4>
                                        Processing Fee: <span className="font-bold">₱ {travelTaxData.processing_fee.toFixed(2)}</span>
                                    </h4>
                                </div>
                                <div>
                                    <h4>
                                        Sub Amount: <span className="font-bold">₱ {travelTaxData.amount.toFixed(2)}</span>
                                    </h4>
                                </div>
                                <div>
                                    <h4>
                                        Total Amount: <span className="font-bold">₱ {travelTaxData.total_amount.toFixed(2)}</span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-2">
                            <button
                                className="py-2 px-2 bg-primary text-white rounded text-lg disabled:bg-gray-200"
                                disabled={currentStep == 1 ? true : false}
                                type="button"
                                onClick={handlePreviousStep}
                            >
                                Previous{" "}
                            </button>
                            <button className="py-2 px-2 bg-primary text-white rounded text-lg disabled:bg-gray-200" type="button" onClick={currentStep == 2 ? handleSubmitTravelTax : handleNextStep}>
                                {currentStep == 2 ? "Submit" : "Next"}{" "}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="my-4">
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Last Name</TableColumn>
                            <TableColumn>First Name</TableColumn>
                            <TableColumn>Middle Name</TableColumn>
                            <TableColumn>Ext Name</TableColumn>
                            <TableColumn>Destination</TableColumn>
                            <TableColumn>Passport Number</TableColumn>
                            <TableColumn>Ticket Number</TableColumn>
                            <TableColumn></TableColumn>
                        </TableHeader>
                        <TableBody>
                            {travelTaxData.passengers.length > 0 &&
                                travelTaxData.passengers.map((passenger, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{passenger?.firstname}</TableCell>
                                        <TableCell>{passenger?.lastname}</TableCell>
                                        <TableCell>{passenger?.middlename}</TableCell>
                                        <TableCell>{passenger?.suffix}</TableCell>
                                        <TableCell>{passenger?.destination}</TableCell>
                                        <TableCell>{passenger?.passport_number}</TableCell>
                                        <TableCell>{passenger?.ticket_number}</TableCell>
                                        <TableCell>
                                            <button className="py-2 px-2 bg-primary text-white rounded text-sm" onClick={() => handleEditPassenger(index)}>
                                                Edit
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
