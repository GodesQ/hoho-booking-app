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
                <h2>{title}</h2>
                <h1 className='text-small'>{subTitle}</h1>
            </div>
        </div>
    )
}
