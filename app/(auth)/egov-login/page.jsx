"use client";

import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import loginGIF from "../../../public/assets/login-gif.gif";
import loadingGIF from "../../../public/assets/loading.gif";
import errorGIF from "../../../public/assets/error.gif";
import { Image } from "@nextui-org/react";
import { login } from "@/action";

export default function EGovPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const exchange_code = searchParams.get("exchange_code");

    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isSuccessLogin, setIsSuccessLogin] = useState(true);

    const getAccessToken = async (exchange_code) => {
        const formData = new FormData();
        formData.append("partner_code", "DOT");
        formData.append("partner_secret", "9a7adcea31874f269ac130a668a84c8e");
        formData.append("scope", "SSO_AUTHENTICATION");
        formData.append("exchange_code", exchange_code);

        try {
            const response = await axios.post("https://oauth.e.gov.ph/api/token", formData);
            if (response.status === 200) {
                await getSSOAuthentication(response.data.access_token);
            }
        } catch (error) {
            setHasError(true);
        }
    };

    const getSSOAuthentication = async (access_token) => {
        try {
            const response = await axios.post(
                "https://oauth.e.gov.ph/api/partner/sso_authentication",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        // Cookie: "cross-site-cookie=bar",
                    },
                }
            );
            hohoLoginRequest(response.data.data);
        } catch (error) {
            setHasError(true);
        }
    };

    const hohoLoginRequest = async (data) => {
        try {
            const requestData = {
                username: data.email,
                email: data.email,
                password: data.uniqid,
                contact_number: data.mobile,
                firstname: data.first_name,
                lastname: data.last_name,
                middlename: data.middle_name,
                birthdate: data.birth_date,
                gender: data.gender,
                country_of_residence: data.country,
            };

            const response = await axios.post(`https://staging.philippines-hoho.ph/api/sso/login`, requestData);
            login(response.data);

            router.push("/tours?tour_type=Guided");
        } catch (error) {
            setHasError(true);
        }
    };

    useEffect(() => {
        getAccessToken(exchange_code);
    }, [exchange_code]);

    return (
        <div className="w-full h-screen my-10">
            <div className="flex justify-center items-center flex-col">
                <div className="flex items-center justify-center gap-4 my-2">
                    <Image src="https://e.gov.ph/_next/static/media/logo.e3652a48.svg" width={60} />
                    <Image src="https://philippines-hoho.ph/wp-content/uploads/2023/09/philippines_hoho_footer-1024x1024.jpg" width={60} />
                </div>
                {hasError ? (
                    <div className="flex justify-center items-center gap-1 flex-col p-4">
                        <Image src={errorGIF.src} width={100} />
                        <div className="text-center text-danger rounded">An error occurred when attempting to log in with eGOV SSO.</div>
                    </div>
                ) : (
                    <Image src={loadingGIF.src} width={50} />
                )}
                {/* <h3>Login with eGOV...</h3> */}
            </div>
        </div>
    );
}
