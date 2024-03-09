"use client"

import heroBackground from '../../public/assets/bg-hero.png';

const headerStyling = {
    backgroundImage: `url(${heroBackground.src})`,
}

export default function HeaderPage(props) {
    let title = props.title;
    let subTitle = props.subTitle;
    
    return (
        <div className="header-section" style={headerStyling}>
            <div className="header-content">
                <h1>{title}</h1>
                <h2 className='text-small'>{subTitle}</h2>
            </div>
        </div>
    )
}
