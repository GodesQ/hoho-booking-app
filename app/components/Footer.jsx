import React from 'react';

const Footer = () => {
    return (
        <div className='footer'>
            <div className="wrapper">
                <div className="flex justify-between items-center flex-col md:flex-row gap-3">
                    <a href="#" className='text-white text-sm text-center'>Copyright © 2024 Philippines Hop On Hop Off</a>
                    <div className="flex gap-3">
                        <a className='text-white text-sm' target='_blank' href="https://philippines-hoho.ph/terms-and-conditions/">Terms and Conditions</a>
                        <a className='text-white text-sm' target='_blank' href="https://philippines-hoho.ph/privacy-policy/">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
