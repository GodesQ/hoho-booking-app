"use client";

import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function page() {
    const searchParams = useSearchParams();

    const exchange_code = searchParams.get("exchange_code");

    const getAccessToken = async (exchange_code) => {
        const formData = new FormData();
        formData.append("partner_code", "DOT");
        formData.append("partner_secret", "9a7adcea31874f269ac130a668a84c8e");
        formData.append("scope", "SSO_AUTHENTICATION");
        formData.append("exchange_code", exchange_code);

        try {
            const response = await axios.post("https://oauth.e.gov.ph/api/token", formData);
            if (response.status === 200) {
                // Call the next function with the access token
                await getSSOAuthentication(response.data.access_token);
            }
        } catch (error) {
            console.error("Error in getAccessToken:", error);
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
                        Cookie: "cross-site-cookie=bar",
                    },
                }
            );
            // console.log("SSO Authentication Response:", response.data);
            hohoLoginRequest(response.data.data);
        } catch (error) {
            console.error("Error in getSSOAuthentication:", error);
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

            console.log(response.data);
        } catch (error) {
            console.error("Error in getSSOAuthentication:", error);
        }
    };

    useEffect(() => {
        if (exchange_code) {
            getAccessToken(exchange_code);
        }
    }, [exchange_code]);

    return <div></div>;
}
