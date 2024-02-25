"use client"

import React from 'react'
import { Calendar, CalendarIcon } from "lucide-react";
import { DayPicker } from 'react-day-picker';
import { Select, SelectItem, Popover, PopoverTrigger, Button, PopoverContent, Input, } from "@nextui-org/react";
import 'react-day-picker/dist/style.css';

export default function HeroBookForm() {
    const tourType = [
        { label: "DIY", value: "diy" },
        { label: "Guided", value: "guided" },
    ];

    return (
        <div className='hero-book-form ' >
            <form >
                <div className='fieldset'>
                    <div className="form-group flex flex-wrap md:flex-nowrap gap-4" style={{ width: '25%' }}>
                        <Select
                            label="Tour Type"
                            placeholder="Select a type of tour"
                            className="max-w-xs"
                        >
                            {tourType.map((tourType) => (
                                <SelectItem key={tourType.value} value={tourType.value} className='text-small'>
                                    {tourType.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="form-group flex flex-wrap md:flex-nowrap gap-4" style={{ width: '30%' }}>
                        <Select
                            label="Tours"
                            placeholder="Select tour"
                            className="max-w-xs"
                        >
                            {tourType.map((tourType) => (
                                <SelectItem key={tourType.value} value={tourType.value}>
                                    {tourType.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="form-group gap-4" style={{ width: '25%' }}>
                        <Popover placement="bottom">
                            <PopoverTrigger>
                                <Input classNames={{
                                    label: 'cursor-pointer',
                                    input: ['cursor-pointer', 'text-left', 'placeholder:text-black dark:placeholder:text-black'],
                                    description: 'text-background',
                                }} type="date" label="Reservation Date" placeholder="MM/DD/YYYY" endContent={<Calendar size={22} color="gray" />} />
                            </PopoverTrigger>
                            <PopoverContent>
                                <DayPicker />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="form-group flex flex-wrap md:flex-nowrap gap-4" style={{ width: '20%' }}>
                        <Select
                            label="Pax"
                            placeholder="Select Pax"
                            className="max-w-xs"
                        >
                            {tourType.map((tourType) => (
                                <SelectItem key={tourType.value} value={tourType.value}>
                                    {tourType.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <button className="book-btn">Book Tour</button>
            </form>
        </div>
    )
}
