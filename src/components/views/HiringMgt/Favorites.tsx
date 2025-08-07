'use client';
import { MiniLoader, Pagination } from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import { useFavorites } from '@/hooks/Users';
import useProfessions from '@/hooks/Users/useProfessions';
import { extractName, getAvatar, getFullName } from '@/lib/utils';
import { ArrowRight, Search, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

const Favorites = () => {
  const router = useRouter();
  const [params, setParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchKey: '',
    rating: '',
    professionId: '',
  });

  const { favoriteData, loading } = useFavorites(params);
  const { loading: profLoading, professions } = useProfessions();

  const favorites = useMemo(
    () => favoriteData?.data || [],
    [favoriteData?.data],
  );

  const favoritedPageData = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (favoriteData?.metaData as any) || null,
    [favoriteData?.metaData],
  );

  const handleUserClick = (id: string) => {
    router.push(`/client/dashboard/hiring-management/${id}`);
  };

  if (loading || profLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <MiniLoader message="loading" />
      </div>
    );
  }

  return (
    <div className="app_dashboard_page app_dashboard_home !p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-transparent border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm"
              value={params.rating ?? ''}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  rating: e.target.value,
                }))
              }
            >
              <option value="">All Ratings</option>
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-transparent border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm"
              value={params.professionId || ''}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  professionId: e.target.value,
                }))
              }
            >
              <option value="">All Categories</option>
              {professions?.map((profession) => (
                <option key={profession.id} value={profession.id}>
                  {profession.name}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search Favorites"
            className="w-full border border-gray-200 rounded-full px-4 py-2 pl-10 text-sm"
            onChange={(e) => {
              setParams((prev) => ({
                ...prev,
                searchKey: e.target.value,
              }));
            }}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favorites?.map((user) => (
          <div
            key={user?.id}
            className="bg-white border border-[#E7E7E7] rounded-lg p-5 mb-5"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={
                  user?.profilePicture ??
                  getAvatar({
                    name: user?.name
                      ? getFullName(extractName(user?.name))
                      : '',
                    length: 2,
                  })
                }
                className="w-12 h-12 rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                size="md"
              />
              <div className="flex flex-col">
                <p className="font-bold text-base">{user?.name}</p>
                <span className="text-xs bg-[#E6F7F4] text-[#0D9488] px-3 py-1 rounded-full mt-1 inline-block w-fit">
                  {user?.profession}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-[#262626]" />
                <span className="text-sm font-medium">
                  {user?.averageRating}
                </span>
                <span className="text-xs text-gray-400">
                  ({user?.averageRating})
                </span>
              </div>
              <button
                className="text-sm font-bold text-[#7B37F0] border border-[#7B37F0] hover:bg-[#F5F3FF] px-3 py-1.5 rounded-full flex items-center gap-1"
                onClick={() => {
                  user?.id && handleUserClick(user?.id);
                }}
              >
                View profile{' '}
                <ArrowRight className="w-[20px] h-[20px]"></ArrowRight>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white app_table__pagination">
        <Pagination
          paginate={{
            pageCount: favoritedPageData?.totalPages || 0,
            currentPage: favoritedPageData?.currentPage || 0,
            marginPagesDisplayed: 2,
            pageRangeDisplayed: favoritedPageData?.pageSize || 0,
          }}
          // handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
};

export default Favorites;
