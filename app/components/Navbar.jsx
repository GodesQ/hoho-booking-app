"use client";
import React, { useState, useEffect } from "react";
import Logo from "../../public/hoho-logo.jpg";
import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getSession, logout } from "@/action";
import { Avatar, Button, Image, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import DefaultAvatar from "../../public/avatar.jpg";

export default function Navbar({ isWithHeader }) {
    const [session, setSession] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [itemsQuantity, setItemsQuantity] = useState(0);

    useEffect(() => {
        async function fetchSession() {
            const sessionData = await getSession();
            setSession(sessionData);
        }

        fetchSession();
        getCartItems();
    }, []);

    const getCartItems = async () => {
        let cart_items = (await JSON.parse(localStorage.getItem("carts"))) || [];
        setItemsQuantity(cart_items.length);
    };

    function handleMenu() {
        if (isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    return (
        <nav>
            <div className="flex justify-center items-center gap-4">
                <Link href="/" className="nav-logo">
                    <Image src={Logo.src} width={70} alt="Philippines Hop On Hop Off" />
                </Link>
                <Menu size={25} color={"black"} className="menu-btn" onClick={handleMenu} />
            </div>

            <ul className={isWithHeader ? "nav-list with-bg" : "nav-list"} style={{ top: isOpen ? "80px" : "-200px" }}>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/tours">Tours</Link>
                </li>
                <li>
                    <Link href="/travel-tax">Pay Travel Tax</Link>
                </li>
                <li>
                    <Link href="https://philippines-hoho.ph/">Official Website</Link>
                </li>
            </ul>
            <div className="flex gap-3 items-center justify-between nav-end-section">
                {session?.user ? (
                    <Popover placement="bottom">
                        <PopoverTrigger>
                            <Avatar src={DefaultAvatar.src} size="sm" className="cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent>
                            <ul className="p-2">
                                <li className="hover:bg-grey py-2">
                                    <Link href="/profile">Profile</Link>
                                </li>
                                <li className="hover:bg-grey  py-2">
                                    <a href="#" onClick={handleLogout}>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Link href="/login" className="nav-btn bg-primary rounded text-foreground">
                        Login Now
                    </Link>
                )}
                <Link href="/cart" className="relative">
                    <div className="w-[20px] h-auto text-center absolute top-[-8px] right-[-10px] text-xs bg-primary text-white rounded-full">{itemsQuantity}</div>
                    <ShoppingCart size={20} className="cursor-pointer cart-icon-btn" />
                </Link>
            </div>
        </nav>
    );
}
