"use client"
import { Tab, Tabs } from '@nextui-org/react'
import { BetweenHorizontalStart, DoorOpen, Route, Text } from 'lucide-react'
import React from 'react'


export default function TourDetailTab({tour}) {
    return (
        <Tabs aria-label="Options" color='primary' className='flex' classNames={{ 
            tabList: 'w-full'
         }}>
            <Tab key="description" title={
                <div className="flex items-center space-x-2">
                <Text size={20} />
                <span className='hidden md:block'>Description</span>
                </div>
            }  className='text-black'>
                {tour?.description ?? 'No Description Found'}
            </Tab>
            <Tab key="itinerary" title={
                <div className="flex items-center space-x-2">
                <Route size={20} />
                <span className='hidden md:block'>Itinerary</span>
                </div>
            } className='text-black'>
                {tour?.tour_itinerary ? tour.tour_itinerary.split('\n').map(str => <p className='my-1' key={str}>{str}</p>) : 'No Itinerary Found'}
            </Tab>
            <Tab key="inclusion" title={
                <div className="flex items-center space-x-2">
                <BetweenHorizontalStart size={20} />
                <span className='hidden md:block'>Inclusion</span>
                </div>
            } className='text-black'>
                {tour?.tour_inclusion ? tour.tour_inclusion.split('\n').map(str => <p className='my-1' key={str}>{str}</p>) : 'No Inclusion Found'}
            </Tab>
            <Tab key="operating-hours" title={
                <div className="flex items-center space-x-2">
                <DoorOpen size={20} />
                <span className='hidden md:block'>Operating Hours</span>
                </div>
            } className='text-black'>
                {tour?.operating_hours ? tour.operating_hours.split('\n').map(str => <p className='my-1' key={str}>{str}</p>) : 'No Operating Hours Found'}
            </Tab>
        </Tabs>
    )
}
