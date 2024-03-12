"use client";

import React, { useEffect, useState } from "react";
import HeaderPage from "@/app/components/HeaderPage";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Select,
    SelectItem,
} from "@nextui-org/react";
import { API_ENDPOINT } from "@/constant";
import { getTours } from "@/action";
import Image from "next/image";

const ToursPage = () => {
    const tourTypes = [
        { label: "All", value: "" },
        { label: "DIY", value: "DIY Tour" },
        { label: "Guided", value: "Guided Tour" },
    ];

    const [query, setQuery] = useState({
        name: "",
        type: "",
    });

    const [tours, setTours] = useState([]);

    useEffect(() => {
        fetchTours();
    });

    const fetchTours = async () => {
        let url = `${API_ENDPOINT}/tours?name=${query.name}&type=${query.type}`;
        let response = await getTours(url);
        setTours(response.data);
    };

    return (
        <div className="lightRed ">
            <HeaderPage
                title="All Tours"
                subTitle="Immerse Yourself in Filipino Culture: Philippine Hop On Hop Off Tours Invite You to Explore Diversity"
            />
            <div className="wrapper pt-3 pb-10">
                <div className="flex justify-center items-start gap-7">
                    <Card className="w-[30%] p-3">
                        <CardBody className="flex flex-column gap-3">
                            <Input
                                label="Tour Name"
                                placeholder="Search name of tour..."
                            />
                            <Select
                                className="text-black"
                                placeholder="Select type of tour..."
                                selectedKeys={[tourTypes[0].value]}
                                label="Tour Type"
                            >
                                {tourTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Button className="bg-primary text-foreground">
                                Filter
                            </Button>
                        </CardBody>
                    </Card>
                    <Card className="w-[70%] p-3">
                        <CardBody>
                            <div className="grid grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-3 gap-4">
                                {tours.length > 0 ? (
                                    tours?.map((tour) => (
                                        <Card
                                            className="guided-card"
                                            key={tour.id}
                                        >
                                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                <h4 className="font-bold text-medium text-black">
                                                    {tour.name.length > 20
                                                        ? tour.name.substr(
                                                              0,
                                                              20
                                                          ) + "..."
                                                        : tour.name}
                                                </h4>
                                                <small className="text-default-500">
                                                    {tour.type}
                                                </small>
                                            </CardHeader>
                                            <CardBody className="overflow-visible py-2">
                                                <Image
                                                    alt="Card background"
                                                    className="object-cover rounded-xl max-h-[350px]"
                                                    src={tour.featured_image}
                                                    width={350}
                                                    height={350}
                                                />
                                            </CardBody>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-black">
                                        No Tour Found
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ToursPage;
