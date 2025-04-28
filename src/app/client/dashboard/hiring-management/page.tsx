'use client';

import clientManagement from '@/lib/assets/client-management';
import { ArrowRight, Search, Star } from 'lucide-react';
import { Avatar } from '@/components/shared/avatar';
import { useRouter } from 'next/navigation';

const kpis = [
  { label: 'Onboarded Creatives', value: '35' },
  { label: 'Creative Hires', value: '6', hasViewAll: true },
  { label: 'Published projects', value: '6' }
];

const users = Array(9).fill({
  id: '1',
  name: 'Moyinoluwa Akindele',
  role: 'Product Designer',
  rating: '4.6',
  reviews: '128',
});

export default function Page () {
  const router = useRouter();

  const handleUserClick = (id: string) => {
    router.push(`/client/dashboard/hiring-management/${id}`);
  };

  return (
    <div className="app_dashboard_page app_dashboard_home !p-4">
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {kpis.map((item, index) => {
          return (
            <div
              className='app_dashboard_home__kpis__item relative'
              key={index}>
              <h6 className="app_dashboard_home__kpis__item__h6 !font-bold">
                {item.label}
              </h6>

              <p className="app_dashboard_home__kpis__item__value">
                {item.value}
              </p>
              {item.hasViewAll && (
                <button className="absolute top-4 right-4 text-xs border border-[#262626] rounded-full px-3 py-1">
                  View all
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none bg-transparent border border-[#E6E7EC] rounded-4xl px-4 py-2 pr-8 text-sm">
              <option>Rating</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select className="appearance-none bg-transparent border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm">
              <option>Category</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search for creatives"
            className="w-full border border-gray-200 rounded-full px-4 py-2 pl-10 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((user, index) => (
          <div key={index} className="bg-white border border-[#E7E7E7] rounded-lg p-5 mb-5">
            <div className="flex items-center gap-3">
              <Avatar
                src={clientManagement?.femaleClient}
                className="w-12 h-12 rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                size='md'
              />
              <div className="flex flex-col">
                <p className="font-bold text-base">{user.name}</p>
                <span className="text-xs bg-[#E6F7F4] text-[#0D9488] px-3 py-1 rounded-full mt-1 inline-block w-fit">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star
                  className='h-4 w-4 fill-current text-[#262626]'
                />
                <span className="text-sm font-medium">{user.rating}</span>
                <span className="text-xs text-gray-400">({user.reviews})</span>
              </div>
              <button className="text-sm font-bold text-[#7B37F0] border border-[#7B37F0] hover:bg-[#F5F3FF] px-3 py-1.5 rounded-full flex items-center gap-1" onClick={() => { handleUserClick(user.id); }}>
                View profile <ArrowRight className='w-[20px] h-[20px]'></ArrowRight>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
