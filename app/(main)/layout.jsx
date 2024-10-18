import "../globals.css";
import { Montserrat } from "next/font/google";
import { Providers } from "../providers";
import Footer from "../components/Footer";
import { AppWrapper } from "@/context";
import { Image } from "@nextui-org/react";
import messengerLogo from "../../public/messenger.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
    title: "Book Tour - Philippines Hop On Hop Off",
    description: "Experience the best of the Philippines with our Book Tour website. Discover different hubs and book your DIY or guided tour. Unforgettable memories await!",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={montserrat.className + " lightRed"}>
                <Providers>
                    <AppWrapper>
                        <ToastContainer />
                        {children}
                        <Footer />
                    </AppWrapper>
                </Providers>
                <div className="contact-messenger-con">
                    <a href="https://m.me/philippineshoponhopoff" target="_blank">
                        <Image src={messengerLogo.src} />
                    </a>
                </div>
            </body>
        </html>
    );
}
