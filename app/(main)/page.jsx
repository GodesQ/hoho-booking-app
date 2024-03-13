import diyBackground from '../../public/assets/background-one.png';

import HeroBookForm from '../components/HeroBookForm';
import AttractionSlider from '../components/AttractionSlider';
import { Spacer } from '@nextui-org/react';
import GuidedTours from '../components/GuidedTours';
import DIYTours from '../components/DIYTours';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeaderPage from '../components/HeaderPage';

const diySection = {
    backgroundImage: `url(${diyBackground.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'right center',
    paddingTop: '40px', 
    paddingBottom: '40px'
}

export default function Home() {

    return (
        <div>
            <HeaderPage title='Book Philippine Hop On Hop Off Tours' subTitle="Explore the Wonders of the Philippines with our Hop-On Hop-Off Tours" />
            <HeroBookForm />
            <Spacer y={30} />
            <div className='section-container'>
                <h2 style={{ fontSize: '30px', fontWeight: '700' }} className='text-center'>Attractions</h2>
                <h3 className='text-center'>Discover Unforgettable Attractions Await Your Exploration</h3>
                <Spacer y={25} />
                <AttractionSlider />
            </div>
            <Spacer y={45} />
            <div className='' style={diySection}>
                <div className='section-container'>
                    <h2 style={{ fontSize: '30px', fontWeight: '700' }} className='text-center'>DIY Tours</h2>
                    <h3 className='text-center'>Create Your Own Experience: Do It Yourself Tour</h3>
                    <Spacer y={30} />
                    <DIYTours />
                </div>
            </div>
            <Spacer y={45} />
            <div className='section-container bg-white mx-auto' style={{ maxWidth: '1440px', padding: '0px 50px' }}>
                <div className="flex w-full relative flex-col md:flex-row gap-4">
                    <div className='guided-header-content'>
                        <h2 style={{ fontSize: '30px', fontWeight: '700' }} className='text-center'>Guided Tours</h2>
                        <h3 className='text-center'>Professionally Led Tours: Learn With a Guide</h3>
                    </div>
                    <button className="guided-header-button text-primary hover:text-white">
                        <Link href="/tours" className='bg-transparent hover:bg-primary border-1 border-primary px-5 py-3 rounded-full flex justify-center md:justify-end gap-2'>
                            View All Tours
                            <ArrowRight className='' size={20} />
                        </Link>
                    </button>
                </div>
                <Spacer y={30} />
                <GuidedTours />
            </div>
            <Spacer y={30} />
        </div>
    );
}