"use client";
import React, { useEffect, useState } from "react";
import "../../../../globals.css";
import { useParams, useRouter } from "next/navigation";
import { getTransaction } from "@/action";
import checkIcon from "../../../../../public/assets/check.png";
import { Button, Image, Link } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function TourReservationSuccess() {
    const params = useParams();
    const router = useRouter();
    const [transaction, setTransaction] = useState({});
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        fetchTransaction();
    }, [params.id]);

    async function fetchTransaction() {
        const url = `https://dashboard.philippines-hoho.ph/api/v2/transactions/${params.id}`;
        const response = await getTransaction(url);
        if (!response.status) return router.push("/");

        setIsReady(true);
        setTransaction(response.transaction);
    }

    return (
        isReady && (
            <div className="w-full min-h-[95vh] flex justify-center items-center py-4 px-3 bg-gray-100">
                <div className="sm:w-[95%] lg:w-[50%]">
                    <div className="flex justify-center items-center flex-col gap-2">
                        <Image src={checkIcon.src} width={100} height={100} />
                        <h2 className="text-2xl text-center font-semibold">Thank You</h2>
                        <h2 className="text-2xl text-center font-semibold">Your tour reservation has been processed.</h2>
                        <h4 className="text-md text-center">
                            Once the tour provider approves your reservation, you will receive a payment request via email with instructions on how to complete your payment. In the event of a
                            cancellation, you will also be notified promptly via email.
                        </h4>
                        <h5 className="text-center">(Note: Please Screenshot this Page)</h5>
                        <div className="bg-white sm:[95%] lg:w-[75%] p-3 my-3">
                            <h2 className="font-medium text-medium mb-4 text-center">Transaction Details</h2>
                            <Table aria-label="Example static collection table">
                                <TableHeader>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Value</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell>Reference Number</TableCell>
                                        <TableCell>{transaction.reference_no}</TableCell>
                                    </TableRow>
                                    <TableRow key="2">
                                        <TableCell>Total Discount</TableCell>
                                        <TableCell>₱ {parseInt(transaction.total_discount).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow key="3">
                                        <TableCell>Total Of Additional Charges</TableCell>
                                        <TableCell>₱ {parseInt(transaction.total_additional_charges).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow key="4">
                                        <TableCell>Sub Amount</TableCell>
                                        <TableCell>₱ {parseInt(transaction.sub_amount).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow key="5">
                                        <TableCell>Total Amount</TableCell>
                                        <TableCell>₱ {parseInt(transaction.payment_amount).toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <Button color="primary" href="/" as={Link} showAnchorIcon>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
}
