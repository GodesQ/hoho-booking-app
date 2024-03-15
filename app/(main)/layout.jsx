import "../globals.css";
import { Montserrat } from "next/font/google";
import { Providers } from "../providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppWrapper } from "@/context";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Book Tour - Philippines Hop On Hop Off",
  description: 'Experience the best of the Philippines with our Book Tour website. Discover different hubs and book your DIY or guided tour. Unforgettable memories await!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={montserrat.className + " lightRed"}>
        <Providers>
          <AppWrapper>
            <Navbar />
            {children}
            <Footer />
          </AppWrapper>
        </Providers>
      </body>
    </html>
  );
}
