import React from "react";
import {Spinner} from "@nextui-org/react";

export default function Loading() {
    return (
        <section className="w-screen h-screen flex justify-center items-center">
            <Spinner />
        </section>
    );
}
