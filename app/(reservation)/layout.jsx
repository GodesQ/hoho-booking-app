import '../globals.css'
import { Montserrat } from 'next/font/google'
import { Providers } from '../providers'
import ReservationNavbar from '../components/ReservationNavbar'
import { Spacer } from '@nextui-org/react'
import Footer from '../components/Footer'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
    title: 'Reservation - Philippine Hop On Hop Off',
    // description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className='scroll-smooth'>
            <body className={montserrat.className + ' lightRed'}>
                <Providers>
                        <ReservationNavbar />
                        <Spacer y={5} />
                        {children}
                        <Spacer y={10} />
                        <Footer />
                </Providers>
            </body>
        </html>
    )
}
