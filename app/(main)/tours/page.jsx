"use client";

import React, { useEffect, useState } from "react";
import HeaderPage from "@/app/components/HeaderPage";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@nextui-org/react";
import { API_ENDPOINT } from "@/constant";
import { getTours } from "@/action";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

const ToursPage = () => {
    const tourTypes = [
        {
            label: "All",
            value: "",
        },
        {
            label: "DIY",
            value: "DIY Tour",
        },
        {
            label: "Guided",
            value: "Guided Tour",
        },
        {
            label: "Seasonal",
            value: "Seasonal Tour",
        },
    ];

    const [query, setQuery] = useState({
        name: "",
        type: tourTypes[0].value,
    });

    const [tours, setTours] = useState([]);

    const [filteredTours, setFilteredTours] = useState([]);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        let url = `https://dashboard.philippines-hoho.ph/api/v2/tours`;
        let response = await getTours(url);
        setTours(response.data);
        setFilteredTours(response.data);
    };

    const handleFilterTours = () => {
        let newFilteredTours = tours.filter((tour) => {
            let queryName = query.name;
            let regex = new RegExp(queryName, "gi");
            return tour.name.match(regex);
        });

        if (query.type != "") {
            if (newFilteredTours.length > 0) {
                newFilteredTours = newFilteredTours.filter((tour) => {
                    return tour.type == query.type;
                });
            } else {
                newFilteredTours = tours.filter((tour) => {
                    return tour.type == query.type;
                });
            }
        }

        setFilteredTours(newFilteredTours);
    };

    return (
        <div className="lightRed ">
            <Navbar isWithHeader={true} />
            <HeaderPage
                title="All Tours"
                subTitle="Immerse Yourself in Filipino Culture: Philippine Hop On Hop Off Tours Invite You to Explore Diversity"
            />
            <div className="wrapper pt-3 pb-10">
                <div className="flex justify-center items-start flex-col lg:flex-row gap-5">
                    <Card className="w-[100%] lg:w-[30%] p-3">
                        <CardBody className="flex flex-column gap-3">
                            <Input
                                label="Tour Name"
                                placeholder="Search name of tour..."
                                value={query.name}
                                onChange={(e) =>
                                    setQuery((prevQuery) => ({
                                        ...prevQuery,
                                        name: e.target.value,
                                    }))
                                }
                            />
                            <Select
                                className="text-black "
                                placeholder="Select type of tour..."
                                selectedKeys={[query.type]}
                                label="Tour Type"
                                onChange={(e) =>
                                    setQuery((prevQuery) => ({
                                        ...prevQuery,
                                        type: e.target.value,
                                    }))
                                }
                            >
                                {tourTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Button className="bg-primary text-foreground" onClick={handleFilterTours}>
                                Filter
                            </Button>
                        </CardBody>
                    </Card>
                    <div className="w-[100%] lg:w-[70%] lg:p-3">
                        <div className="grid grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4">
                            {filteredTours.length > 0 ? (
                                filteredTours?.map((tour) => (
                                    <Link key={tour.id} href={`/tours/${tour.type.replace("Tour", "").toLowerCase().trim()}/${tour.id}`}>
                                        <Card className="guided-card" key={tour.id}>
                                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                <h4 className="font-bold text-small text-black">
                                                    {tour.name.length > 20 ? tour.name.substr(0, 20) + "..." : tour.name}
                                                </h4>
                                                <small className="text-default-500">{tour.type}</small>
                                            </CardHeader>
                                            <CardBody className="overflow-visible py-2 h-auto">
                                                <Image
                                                    alt="Card background"
                                                    className="object-cover object-top rounded-xl h-[180px] lg:h-[270px]"
                                                    src={tour.featured_image}
                                                    width={350}
                                                    height={350}
                                                />
                                            </CardBody>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-black">No Tour Found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToursPage;
