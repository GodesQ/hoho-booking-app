import diyBackground from '../../public/assets/background-one.png';

import HeroBookForm from '../components/HeroBookForm';
import AttractionSlider from '../components/AttractionSlider';
import { Spacer } from '@nextui-org/react';
import GuidedTours from '../components/GuidedTours';
import DIYTours from '../components/DIYTours';
import Link from 'next/link';
import { ArrowRight, ArrowRightCircle } from 'lucide-react';
import HeaderPage from '../components/HeaderPage';

const diySection = {
    backgroundImage: `url(${diyBackground.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'right center'
}

export default function Home() {

    return (
        <div>
            <HeaderPage title='Book Philippine Hop On Hop Off Tours' subTitle="Explore the Wonders of the Philippines with our Hop-On Hop-Off Tours" />
            <HeroBookForm />
            <Spacer y={30} />
            <div className='mx-auto' style={{ maxWidth: '1440px', padding: '0 50px' }}>
                <h2 style={{ fontSize: '30px', fontWeight: '700' }} className='text-center'>Attractions</h2>
                <h3 className='text-center'>Discover Unforgettable Attractions Await Your Exploration</h3>
                <Spacer y={25} />
                <AttractionSlider />
            </div>
            <Spacer y={45} />
            <div className='' style={diySection}>
                <div className='mx-auto' style={{ maxWidth: '1440px', padding: '40px 50px' }}>
                    <h2 style={{ fontSize: '30px', fontWeight: '700' }} className='text-center'>DIY Tours</h2>
                    <h3 className='text-center'>Discover Unforgettable Attractions Await Your Exploration</h3>
                    <Spacer y={30} />
                    <DIYTours />
                </div>
            </div>
            <Spacer y={45} />
            <div className='bg-white mx-auto' style={{ maxWidth: '1440px', padding: '0px 50px' }}>
                <div className="flex w-full justify-center relative items-center">
                    <div className='guided-header-content'>
                        <h2 style={{ fontSize: '30px', fontWeight: '700' }} className='text-center'>Guided Tours</h2>
                        <h3 className='text-center'>Discover Unforgettable Attractions Await Your Exploration</h3>
                    </div>
                    <div className="guided-header-button text-primary hover:text-white">
                        <Link href="#" className='bg-transparent hover:bg-primary border-1 border-primary px-5 py-3 rounded-full flex justify-end gap-2'>
                            View All Tours
                            <ArrowRight className='' size={20} />
                        </Link>
                    </div>
                </div>
                <Spacer y={30} />
                <GuidedTours />
            </div>
            <Spacer y={30} />
        </div>
    );
}