'use client'
import React, { useState } from 'react'
import { Bubble, Edit } from '../..'

const tabData = ['All', 'Social', 'Sports', 'Lifestyle', 'Entertainment']
const data = [
  'Film & Television',
  'Technology',
  'Politics',
  'News',
  'Soccer',
  'Health & Fitness',
  'Basketball',
  'Food',
  'Golf',
  'Tennis',
  'Formula 1',
  'Moto GP',
  'Music',
  'Boxing',
  'Fashion & Lifestyle',
  'Travel',
  'Money & Investment',
  'Gaming'
]

export function Psychographics () {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <div className="app_personal_information app_personal_information_con flex flex-col gap-5 app_psychographics">
      <div className="app_personal_information__header flex justify-between items-center">
        <div className="flex justify-between gap-5">
          <p className="app_personal_information__header__btn flex items-center gap-2">
            <Bubble />
            Psychographics
          </p>
        </div>
        <button type="button">
          <Edit />
        </button>
      </div>

      <div className="app_psychographics__tab">
        {tabData.map((item) => (
          <button
            key={item}
            type="button"
            className={`app_psychographics__tab__item ${
              activeTab === item ? 'active' : ''
            }`}
            onClick={() => {
              setActiveTab(item)
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="app_psychographics__options">
        {data?.map((item) => (
          <button
            key={item}
            type="button"
            className="app_psychographics__options__item"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
