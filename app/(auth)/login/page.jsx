"use client";

import React, { useState } from "react";
import LogoText from "../../../public/hoho_text.png";
import Logo from "../../../public/hoho-logo.jpg";
import heroBackground from "../../../public/assets/bg-hero.png";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";

export default function LoginPage() {
  const headerStyling = {
    backgroundImage: `url(${heroBackground.src})`,
  };
  
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [loginBtnDisabled, setLoginBtnDisabled] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async () => {
    try {
      setLoginBtnDisabled(true);

      const response = await fetch(`http://127.0.0.1:8000/api/v2/login`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      setLoginBtnDisabled(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-content-container">
        <div className="flex justify-center items-center flex-col text-center gap-3">
          <Image
            src={Logo}
            width={100}
            className="nav-logo"
            alt="Philippines Hop On Hop Off"
          />
          <h2 className="text-large" style={{ lineHeight: "35px" }}>
            Welcome to Philippine Hop On Hop Off Booking Tour Website
          </h2>
          <h3>
            Get Ready to Explore - Login and Dive into the Vibrant Culture of
            the Philippines!
          </h3>
        </div>
        <div className="login-form">
          {errorMessage != "" ? (
            <div className="my-4 bg-primary-50 text-primary rounded py-3 px-4">
              {errorMessage}
            </div>
          ) : (
            <div></div>
          )}
          <form action="#">
            <div className="my-5">
              <label className="text-small" htmlFor="username">
                Username <span className="text-danger">*</span>
              </label>
              <Input
                type="text"
                placeholder="Type your username address..."
                className="mt-2"
                onInput={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>
            <div className="my-5">
              <label className="text-small" htmlFor="password">
                Password <span className="text-danger">*</span>
              </label>
              <Input
                type="password"
                placeholder="Type your password..."
                className="mt-2"
                onInput={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
            <Button isDisabled={loginBtnDisabled}
              className="bg-primary text-foreground w-full rounded-xl shadow"
              onClick={handleLoginSubmit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
      <div className="login-image-container" style={headerStyling}>
        <Image
          src={LogoText}
          width={360}
          className="nav-logo"
          alt="Philippines Hop On Hop Off"
        />
        <h2 className="text-small">
          Explore the Beauty of the Philippines with Ease - Login to Plan Your
          Adventure! Dive into a World of Stunning Landscapes, Rich Culture, and
          Unforgettable Experiences.
        </h2>
      </div>
    </div>
  );
}
