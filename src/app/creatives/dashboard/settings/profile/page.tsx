'use client';
import { Edit } from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import { useProfile } from '@/hooks/Users';
import projectManagement from '@/lib/assets/project-management';
import { useMemo } from 'react';

export default function Notifications() {
  const { data } = useProfile();
    const userData = useMemo(() => data?.data || null, [data]);
  return (
    <div>
      <h2 className="font-bold">Profile</h2>
      <div className="border border-[#E7E7E7] rounded-2xl p-6 flex gap-5 my-6">
        <div>
          <Avatar size="md" src={ userData?.profilePicture || projectManagement.female} />
        </div>
        <div>
          <h2 className="font-bold">{userData?.firstName}</h2>
          <p>Product Manager</p>
        </div>
      </div>

      <div className="border border-[#E7E7E7] rounded-2xl p-6 mb-8 ">
        <div className="flex justify-between items-center pb-5">
          <h2 className="font-bold">Personal Information</h2>
          <button className="flex rounded-3xl border border-[#E7E7E7] px-4 py-1 gap-2 ">
            Edit
            <Edit />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-y-6 gap-x-16 mb-6">
          <div className="flex flex-col text-[#6D6D6D] gap-2">
            First name
            <span className="text-[#262626] font-bold">{userData?.firstName}</span>
          </div>
          <div className="flex flex-col text-[#6D6D6D] gap-2">
            Last name
            <span className="text-[#262626] font-bold">{userData?.lastName}</span>
          </div>

          <div className="flex flex-col text-[#6D6D6D] gap-2">
            Email address
            <span className="text-[#262626] font-bold">
              Moyinoluwa@gmail.com
            </span>
          </div>
          <div className="flex flex-col text-[#6D6D6D] gap-2">
            Phone
            <span className="text-[#262626] font-bold">{userData?.phoneNumber}</span>
          </div>

          <div className="flex flex-col text-[#6D6D6D] gap-2">
            Profession
            <span className="text-[#262626] font-bold">Product Manager</span>
          </div>
          <div className="flex flex-col text-[#6D6D6D] gap-2">
            Location
            <span className="text-[#262626] font-bold">{userData?.userAddresses?.[0].state?.name}, {userData?.userAddresses?.[0].country?.name}</span>
          </div>

          <div className="flex flex-col text-[#6D6D6D] gap-2">
            Portfolio Link
            <span className="text-[#262626] font-bold">
              https://yourportfolio.coma
            </span>
          </div>
          <div className="flex flex-col text-[#6D6D6D] gap-2">
            Social Media
            <span className="text-[#262626] font-bold">@Akindele</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[#6D6D6D] pb-2">Bio</p>
          <p className="text-[#262626] font-bold">
            {userData?.bio || 'No bio'}
          </p>
        </div>
      </div>
    </div>
  );
}
