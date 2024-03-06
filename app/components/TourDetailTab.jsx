"use client"
import { Tab, Tabs } from '@nextui-org/react'
import React from 'react'


export default function TourDetailTab({tour}) {
    return (
        <Tabs aria-label="Options" color='primary' className='flex'>
            <Tab key="description" title="Description" className='text-black'>
                {tour?.description}
            </Tab>
            <Tab key="itinerary" title="Itinerary" className='text-black'>
                {tour?.tour_itinerary ? tour.tour_itinerary.split('\n').map(str => <p className='my-1' key={str}>{str}</p>) : 'No Itinerary Found'}
            </Tab>
            <Tab key="inclusion" title="Inclusions" className='text-black'>
                {tour?.tour_inclusion ? tour.tour_inclusion.split('\n').map(str => <p className='my-1' key={str}>{str}</p>) : 'No Inclusion Found'}
            </Tab>
            <Tab key="operating-hours" title="Operating Hours" className='text-black'>
                {tour?.operating_hours ? tour.operating_hours.split('\n').map(str => <p className='my-1' key={str}>{str}</p>) : 'No Operating Hours Found'}
            </Tab>
        </Tabs>
    )
}
