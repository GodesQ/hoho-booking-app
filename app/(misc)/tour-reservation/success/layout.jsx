
import { Montserrat } from 'next/font/google';
import Footer from '@/app/components/Footer';
import '../../../globals.css';

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
    title: 'Tour Reservation Success - Philippines Hop On Hop Off',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className='scroll-smooth'>
            <body className={montserrat.className + ' lightRed'}>
                {children}
                <Footer />
            </body>
        </html>
    )
}
