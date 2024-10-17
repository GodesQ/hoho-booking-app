"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import { Select, SelectItem, Spacer } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { countries } from "@/data/countries";

export default function TravelTaxPage() {
    const [currentPassenger, setCurrentPassenger] = useState({});

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
                        <div className="grid grid-cols-4 gap-3">
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label">
                                    First Name
                                </label>
                                <input className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label">
                                    Last Name
                                </label>
                                <input className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label">
                                    Middle Name
                                </label>
                                <input className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label">
                                    Ext. Name
                                </label>
                                <input className="form-control" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label">
                                    Passport Number
                                </label>
                                <input className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label">
                                    Ticket Number / Booking Reference Number
                                </label>
                                <input className="form-control" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="form-group">
                                <RadioGroup
                                    label="Class"
                                    className="text-black"
                                    classNames={{
                                        description: "text-black black",
                                        label: "form-label",
                                    }}
                                    defaultValue="business class"
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
                            <div className="form-group">
                                <label htmlFor="" className="form-label">
                                    Amount
                                </label>
                                <input type="text" className="form-control" readOnly value={1620} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="form-group">
                                <label htmlFor="" className="form-label">
                                    Mobile Number
                                </label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">
                                    Email Address
                                </label>
                                <input type="email" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">
                                    Confirm Email Address
                                </label>
                                <input type="email" className="form-control" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="form-group">
                                <label htmlFor="" className="form-label">
                                    Destination
                                </label>
                                <Select
                                    placeholder="Select Destination"
                                    classNames={{
                                        base: "w-full",
                                        mainWrapper: "w-full",
                                        trigger: "py-2 border bg-white hover:bg-white",
                                    }}
                                >
                                    {countries.map((country) => (
                                        <SelectItem key={country.key}>{country.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">
                                    Departure Date
                                </label>
                                <input type="date" className="form-control" />
                            </div>
                            <div className="flex items-center">
                                <button className="py-3 px-4 mt-3 bg-primary text-white rounded" type="button">
                                    Add Passenger
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
