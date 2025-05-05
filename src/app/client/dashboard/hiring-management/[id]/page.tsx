'use client'

import { useState } from 'react'
import { MapPin, Heart, Send, Globe, Star } from 'lucide-react'
import { Avatar } from '@/components/shared/avatar'
import clientManagement from '@/lib/assets/client-management'
import { Instagram, Linkedin } from '@/components/shared'

const mockCreative = {
  id: '1',
  name: 'Moyinoluwa Akindele',
  role: 'Product Designer',
  location: 'Lagos, Nigeria',
  about: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet. Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt. Ut labore et dolore magnam aliquam quaerat voluptatem.

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet. Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt. Ut labore et dolore magnam aliquam quaerat voluptatem.`,
  portfolio: {
    website: 'https://www.abcdefgh.com',
    social: {
      linkedin: '@Hikaru',
      instagram: '@Hikaru',
    },
  },
  rating: '4.6',
  reviewCount: '128',
  reviews: [
    {
      id: '1',
      name: 'Shinske Nakamura',
      location: 'Lagos, Nigeria',
      rating: 4,
      date: 'a week ago',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    },
    {
      id: '2',
      name: 'Shinske Nakamura',
      location: 'Lagos, Nigeria',
      rating: 3,
      date: 'a week ago',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    },
    {
      id: '3',
      name: 'Shinske Nakamura',
      location: 'Lagos, Nigeria',
      rating: 4,
      date: 'a week ago',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    },
  ],
  reviewSummary: {
    5: 11,
    4: 4,
    3: 2,
    2: 0,
    1: 0,
  },
}

type TabType = 'About' | 'Portfolio' | 'Reviews'

export default function CreativeProfile () {
  const [activeTab, setActiveTab] = useState<TabType>('About')

  // In a real app, you would fetch the creative data based on the ID
  // For now, we'll use the mock data
  const creative = mockCreative

  return (
    <div className="app_dashboard_page app_dashboard_home !p-4">
        <div className='bg-white'>
      <div className="border-b border-gray-200">
        <div className="p-6 flex flex-col  md:flex-row md:items-center md:justify-between gap-6">
            <div className=' flex flex-col md:flex-row md:items-center gap-4'>
          <div className="flex-shrink-0">
          <Avatar
                src={clientManagement?.femaleClient}
                className="w-12 h-12 rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                size= 'xl'
              />
          </div>

        <div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold mb-2">{creative.name}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm bg-[#00DAD933] text-[#262626] px-5 py-1 rounded-full">{creative.role}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mt-7">
                <MapPin className="h-4 w-4 mr-1" />
                {creative.location}
            </div>
          </div>

        </div>
            </div>

          <div className="">
            <button className="bg-[#7C3AED] text-white rounded-full px-4 py-2 flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Send a message</span>
            </button>

            <div className='flex justify-end pt-6'>
            <button className="">
              <Heart className="h-5 w-5 text-gray-700" />
            </button>

            </div>
          </div>
        </div>

        <div className="flex border-t border-gray-200 p-4 gap-2">
          {['About', 'Portfolio', 'Reviews'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 text-sm font-bold ${
                activeTab === tab ? ' border rounded-full border-[#262626] text-[#262626]' : 'text-[#808080] rounded-full border border-[#808080]'
              }`}
              onClick={() => { setActiveTab(tab as TabType); }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'About' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">About Me</h2>
            <div className="text-gray-700 whitespace-pre-line">{creative.about}</div>
          </div>
        )}

        {activeTab === 'Portfolio' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Portfolio</h2>

            <div className="mb-8">
              <a
                href={creative.portfolio.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1 bg-[#7B37F01A] text-[#7C3AED] border border-[#7B37F0] rounded-full"
              >
                <Globe className="h-4 w-4" />
                {creative.portfolio.website}
              </a>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Social Media</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-gray-700" />
                  <span>{creative.portfolio.social.linkedin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-gray-700" />
                  <span>{creative.portfolio.social.instagram}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
              <div className="md:w-1/2">
                <h2 className="text-xl font-semibold mb-6">
                  {Object.values(creative.reviewSummary).reduce((a, b) => a + b, 0)} Reviews
                  <span className="ml-2 inline-flex items-center">
                  <Star
                  className='h-4 w-4 fill-current text-[#262626]'
                />
                    <span className="ml-1">{creative.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({creative.reviewCount})</span>
                  </span>
                </h2>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="w-20 text-sm">{star} Stars</div>
                      <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#262626] rounded-full"
                          style={{
                            width: `${
                              (creative.reviewSummary[star as keyof typeof creative.reviewSummary] /
                                Number.parseInt(creative.reviewCount)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500 w-8">
                        ({creative.reviewSummary[star as keyof typeof creative.reviewSummary]})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {creative.reviews.map((review) => (
                <div key={review.id} className="border border-[#D1D1D1] rounded-lg p-5 ">
                  <div className='flex items-center gap-3 pb-5 mb-5 w-full border-b-2 border-[#D1D1D1]'>
                  <Avatar
                src={clientManagement?.femaleClient}
                className="w-12 h-12 rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                size= 'md'
              />
                    <div>
                      <div className="font-bold text-[#262626]">{review.name}</div>
                      <div className="text-sm text-[#6D6D6D] pt-2">{review.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-current text-[#262626]' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                  </div>

                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        </div>
      </div>
  )
}
