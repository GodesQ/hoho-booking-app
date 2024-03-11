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

export default function HeroBookForm() {
  const tourType = [
    { label: "DIY", value: "diy" },
    { label: "Guided", value: "guided" },
  ];

  const [tours, setTours] = useState([]);
  const [ticketPasses, setTicketPasses] = useState([]);

  const [reservation, setReservation] = useState({
    tour: null,
    reservation_date: format(new Date(), "yyyy-MM-dd"),
    number_of_pax: null,
    ticket_pass: null,
    total_amount: 0,
  });

  useEffect(() => {
    fetchTicketPasses();
  }, [])

  const fetchTicketPasses = async () => {
    let url = `${API_ENDPOINT}/ticket-passes`;
    let response = await getTicketPasses(url);
    setTicketPasses(response.data);
  }

  const handleTourTypeChange = async (e) => {
    let typeValue = e.target.value;
    let url = `${API_ENDPOINT}/tours?type=${typeValue}`;
    let response = await getTours(url);
    setTours(response.data);
  };

  const handleTourChange = (e) => {
    let tour_id = e.target.value;
    let selectedTour = tours.find((tour) => tour.id == tour_id);
    setReservation((prevReservation) => ({
      ...prevReservation,
      tour: selectedTour,
    }));
  };

  const handleDayClick = (day, modifiers) => {
    setReservation((prevReservation) => ({
      ...prevReservation,
      reservation_date: format(day, "yyyy-MM-dd"),
    }));
  };

  const handleCheckoutBtn = () => {};

  return (
    <div className="hero-book-form ">
      <ToastContainer />
      <form>
        <div className="fieldset">
          <div
            className="flex-1 form-group flex flex-wrap md:flex-nowrap gap-4"
            style={{ width: "15%" }}
          >
            <Select
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
            style={{ width: "25%" }}
          >
            <Select
              label="Tours"
              placeholder="Select tour"
              className="max-w-xs"
              onChange={handleTourChange}
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
                  disabled={{ before: new Date() }}
                  onDayClick={handleDayClick}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div
            className="form-group flex flex-wrap md:flex-nowrap gap-4"
            style={{ width: "15%" }}
          >
            <Select label="Pax" placeholder="Select Pax" className="max-w-xs">
              {Array.from({ length: 100 }).map((_, index) => {
                const paxCount =
                  index + (1);
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
            className="form-group flex flex-wrap md:flex-nowrap gap-4"
            style={{ width: "25%" }}
          >
            <Select
              label="Ticket Pass"
              placeholder="Select Ticket Pass"
              className="max-w-xs"
            >
              {ticketPasses.map((ticketPass) => (
                <SelectItem key={ticketPass.id} value={ticketPass.id}>
                  {ticketPass.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <button className="book-btn" type="button" onClick={handleCheckoutBtn}>
          Book Tour
        </button>
      </form>
    </div>
  );
}
