"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
    return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1 day").sign(key);
}

export async function decrypt(input) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(user) {
    // Create the session
    const expires = new Date(Date.now() + 24 * 3600 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
    const session = await getSession();
    
    const response = await fetch("https://dashboard.philippines-hoho.ph/api/v2/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.user.token}`,
        },
    });

    // Destroy the session
    cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession() {
    const session = cookies().get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 3600 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}

export async function updateUserSession(updatedInfo) {
    const session = cookies().get("session")?.value;
    if (!session) return;

    cookies().set("session", "", { expires: new Date(0) });

    const parsed = await decrypt(session);

    const newUser = {
        ...parsed.user,
        user: {
            ...parsed.user.user,
            firstname: updatedInfo.firstname,
            lastname: updatedInfo.lastname,
            contact_no: updatedInfo.contact_no.number,
            countryCode: updatedInfo.contact_no.countryCode,
            isoCode: updatedInfo.contact_no.isoCode,
        },
    };

    const expires = new Date(Date.now() + 24 * 3600 * 1000);

    const res = NextResponse.next();
    cookies().set({
        name: "session",
        value: await encrypt({ user: newUser, expires }),
        httpOnly: true,
        expires: expires,
    });
}

export async function getUserReservations(url, token) {
    
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    // Extract JSON content from the response
    return await response.json();
}

export async function getAttractions(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-code": process.env.API_CODE,
            "x-api-key": process.env.API_KEY,
        },
    });

    // Extract JSON content from the response
    return await response.json();
}

export async function getTours(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-code": process.env.API_CODE,
            "x-api-key": process.env.API_KEY,
        },
    });

    // Extract JSON content from the response
    return await response.json();
}

export async function getTour(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-code": process.env.API_CODE,
            "x-api-key": process.env.API_KEY,
        },
    });

    // Extract JSON content from the response
    return await response.json();
}

export async function getTicketPasses(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-code": process.env.API_CODE,
            "x-api-key": process.env.API_KEY,
        },
    });

    // Extract JSON content from the response
    return await response.json();
}

export async function checkout(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-code": process.env.API_CODE,
            "x-api-key": process.env.API_KEY,
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

export async function verifyPromoCode(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-code": process.env.API_CODE,
            "x-api-key": process.env.API_KEY,
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

export async function updateProfile(url, data, token) {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

export async function getTransaction(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-code": process.env.API_CODE,
            "x-api-key": process.env.API_KEY,
        },
    });

    // Extract JSON content from the response
    return await response.json();
}