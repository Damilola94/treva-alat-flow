'use client';
import { EditSmall } from '@/app/assets/svgs';
import {
  CenterModal,
  CloseX,
  Edit,
  Facebook,
  Instagram,
  Linkedin,
  TikTok,
  Twitter,
} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile, useUsers } from '@/hooks/Users';
import { getAvatar, getFullName } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
  errorToast,
  handleErrors,
  successToast,
  useDeleteUserProfileMutation,
} from '@/services';
import { useAppSelector } from '@/store';
import { getErrorMessage, handleLogoutRedirect } from '@/utils';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const Profile = () => {
  const pathname = usePathname();
  const isCreative = pathname.includes('/creatives/');
  const { data, refetch } = useProfile();
  const userData = useMemo(() => data?.data || null, [data]);
  const { userId } = useAppSelector((state) => state?.auth);
  const [isEdit, toggleIsEdit] = useState(false);
  const [pictureEdit, togglePictureEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [triggerDelete, { isLoading }] = useDeleteUserProfileMutation();  

  const { updateProfileDetails, loading, updateResponse } = useUsers();

  const initialValues = {
    firstName: userData?.firstName ?? '',
    lastName: userData?.lastName ?? '',
    phoneNumber: userData?.phoneNumber ?? '',
    bio: userData?.bio ?? '',
    ...(isCreative && {
      portfolioLink: userData?.portfolioLink ?? '',
      websiteUrl: userData?.websiteUrl ?? '',
    }),
    picture: userData?.profilePicture ?? '',
  };
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateProfileDetails(values);
      } catch (error) {
        handleErrors(error);
      } finally {
        refetch && refetch();
      }
    },
  });

  const { handleBlur, handleChange, handleSubmit, values, touched, errors } =
    formik;

  useEffect(() => {
    if (updateResponse === 'success') {
      toggleIsEdit(false);
      refetch && refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateResponse]);

  const deleteUser = async () => {
    try {
      const payload = {
        userId: userId,
      };
      const response = await triggerDelete(payload).unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'Account deleted successfully');
        handleLogoutRedirect();
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

  return (
    <div>
      <h2 className="font-bold">Profile</h2>
      <div className="border border-[#E7E7E7] rounded-2xl p-6 flex gap-5 my-6">
        <div className="relative">
          {pictureEdit ? (
            <Avatar
              src={
                imagePreview ??
                (typeof values.picture === 'string'
                  ? values.picture
                  : userData?.profilePicture ??
                    getAvatar({
                      name: userData ? getFullName(userData) : '',
                      length: 2,
                    }))
              }
              className="w-12 h-12 rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
              size="md"
            />
          ) : (
            <Avatar
              src={
                userData?.profilePicture ??
                getAvatar({
                  name: userData ? getFullName(userData) : '',
                  length: 2,
                })
              }
              className="w-12 h-12 rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
              size="md"
            />
          )}

          <div className="absolute bottom-0 right-0 w-fit cursor-pointer">
            <label htmlFor="profilePicture">
              <EditSmall className="cursor-pointer" />
            </label>
            <input
              id="profilePicture"
              name="picture"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  togglePictureEdit(true);
                  formik.setFieldValue('picture', file);

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
        <div>
          <h2 className="font-bold">{userData?.firstName}</h2>
          <p>{userData?.profession || '--'}</p>
        </div>
      </div>

      <div className="border border-[#E7E7E7] rounded-2xl p-6 mb-8 ">
        <div className="flex justify-between items-center pb-5">
          <h2 className="font-bold">Personal Information</h2>
          <button
            onClick={() => toggleIsEdit((prev) => !prev)}
            className="flex rounded-3xl border border-[#E7E7E7] px-4 py-1 gap-2 "
          >
            {isEdit ? 'Cancle Edit' : 'Edit'}
            {isEdit ? <CloseX /> : <Edit />}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-y-6 gap-x-16 mb-6">
          {isEdit ? (
            <>
              <Input
                name="firstName"
                placeholder="First Name"
                label="First Name "
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                label="Last Name "
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <div className="flex flex-col text-[#6D6D6D] gap-2">
                Email address
                <span className="text-[#262626] font-bold">
                  {userData?.email || '--'}
                </span>
              </div>
              <Input
                name="phoneNumber"
                placeholder="Phone Number"
                label="Phone "
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              {isCreative && (
                <>
                  <div className="flex flex-col text-[#6D6D6D] gap-2">
                    Profession
                    <span className="text-[#262626] font-bold">
                      {userData?.profession || '--'}
                    </span>
                  </div>
                  <div className="flex flex-col text-[#6D6D6D] gap-2">
                    Location
                    <span className="text-[#262626] font-bold">
                      {userData?.userAddresses?.[0]?.state},{' '}
                      {userData?.userAddresses?.[0]?.country}
                    </span>
                  </div>
                  <Input
                    name="portfolioLink"
                    placeholder="Portfolio Link"
                    label="Portfolio Link "
                    value={values.portfolioLink}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                  <Input
                    name="websiteUrl"
                    placeholder="Website Url"
                    label="Website Url"
                    value={values.websiteUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </>
              )}
              {!isCreative && (
                <div className="flex flex-col text-[#6D6D6D] gap-2">
                  Location
                  <span className="text-[#262626] font-bold">
                    {userData?.userAddresses?.[0]?.state},{' '}
                    {userData?.userAddresses?.[0]?.country}
                  </span>
                </div>
              )}
              <div className="flex flex-col text-[#6D6D6D] gap-2">
                Social Media
                <div className="flex flex-wrap gap-3">
                  {userData?.userSocialMedias?.map((socials, index) => {
                    if (!socials?.username) return null;
                    const name = socials?.socialMediaTypeName;
                    const iconUrl = socials?.socialMediaTypeIcon;

                    let IconComponent = null;

                    if (!iconUrl) {
                      if (name === 'LinkedIn') {
                        IconComponent = (
                          <Linkedin className="h-5 w-5 text-gray-700" />
                        );
                      } else if (name === 'Instagram') {
                        IconComponent = (
                          <Instagram className="h-5 w-5 text-gray-700" />
                        );
                      } else if (name === 'X') {
                        IconComponent = (
                          <Twitter
                            fill="#000000"
                            stroke="#000000"
                            className="h-5 w-5 text-gray-700"
                          />
                        );
                      } else if (name === 'Facebook') {
                        IconComponent = (
                          <Facebook
                            fill="#000000"
                            stroke="#000000"
                            className="h-5 w-5 text-gray-700"
                          />
                        );
                      } else if (name === 'TikTok') {
                        IconComponent = (
                          <TikTok
                            fill="#000000"
                            stroke="#000000"
                            className="h-5 w-5 text-gray-700"
                          />
                        );
                      }
                    }

                    return (
                      <div key={index} className="flex items-center gap-2">
                        {IconComponent}
                        {iconUrl && (
                          <Image
                            src={iconUrl}
                            alt={name || 'Social icon'}
                            width={22}
                            height={22}
                            unoptimized
                          />
                        )}
                        <span>{socials?.username}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col text-[#6D6D6D] gap-2">
                First name
                <span className="text-[#262626] font-bold">
                  {userData?.firstName || '--'}
                </span>
              </div>
              <div className="flex flex-col text-[#6D6D6D] gap-2">
                Last name
                <span className="text-[#262626] font-bold">
                  {userData?.lastName || '--'}
                </span>
              </div>

              <div className="flex flex-col text-[#6D6D6D] gap-2">
                Email address
                <span className="text-[#262626] font-bold">
                  {userData?.email || '--'}
                </span>
              </div>

              <div className="flex flex-col text-[#6D6D6D] gap-2">
                Phone
                <span className="text-[#262626] font-bold">
                  {userData?.phoneNumber || '--'}
                </span>
              </div>

              {isCreative && (
                <>
                  <div className="flex flex-col text-[#6D6D6D] gap-2">
                    Profession
                    <span className="text-[#262626] font-bold">
                      {userData?.profession || '--'}
                    </span>
                  </div>
                  <div className="flex flex-col text-[#6D6D6D] gap-2">
                    Location
                    <span className="text-[#262626] font-bold">
                      {userData?.userAddresses &&
                      userData?.userAddresses?.length > 0 ? (
                        <>
                          {userData?.userAddresses?.[0]?.state},{' '}
                          {userData?.userAddresses?.[0]?.country}
                        </>
                      ) : (
                        <>--</>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col text-[#6D6D6D] gap-2">
                    Portfolio Link
                    <span className="text-[#262626] font-bold">
                      {userData?.portfolioLink || '--'}
                    </span>
                  </div>

                  <div className="flex flex-col text-[#6D6D6D] gap-2">
                    Website Url
                    <span className="text-[#262626] font-bold">
                      {userData?.websiteUrl || '--'}
                    </span>
                  </div>
                </>
              )}

              {!isCreative && (
                <div className="flex flex-col text-[#6D6D6D] gap-2">
                  Location
                  <span className="text-[#262626] font-bold">
                    {userData?.userAddresses &&
                    userData?.userAddresses?.length > 0 ? (
                      <>
                        {userData?.userAddresses?.[0]?.state},{' '}
                        {userData?.userAddresses?.[0]?.country}
                      </>
                    ) : (
                      <>--</>
                    )}
                  </span>
                </div>
              )}

              <div className="flex flex-col text-[#6D6D6D] gap-2">
                Social Media
                <div className="flex flex-wrap gap-3">
                  {userData?.userSocialMedias?.map((socials, index) => {
                    if (!socials?.username) return null;
                    const name = socials?.socialMediaTypeName;
                    const iconUrl = socials?.socialMediaTypeIcon;

                    let IconComponent = null;

                    if (!iconUrl) {
                      if (name === 'LinkedIn') {
                        IconComponent = (
                          <Linkedin className="h-5 w-5 text-gray-700" />
                        );
                      } else if (name === 'Instagram') {
                        IconComponent = (
                          <Instagram className="h-5 w-5 text-gray-700" />
                        );
                      } else if (name === 'X') {
                        IconComponent = (
                          <Twitter
                            fill="#000000"
                            stroke="#000000"
                            className="h-5 w-5 text-gray-700"
                          />
                        );
                      } else if (name === 'Facebook') {
                        IconComponent = (
                          <Facebook
                            fill="#000000"
                            stroke="#000000"
                            className="h-5 w-5 text-gray-700"
                          />
                        );
                      } else if (name === 'TikTok') {
                        IconComponent = (
                          <TikTok
                            fill="#000000"
                            stroke="#000000"
                            className="h-5 w-5 text-gray-700"
                          />
                        );
                      }
                    }

                    return (
                      <div key={index} className="flex items-center gap-2">
                        {IconComponent}
                        {iconUrl && (
                          <Image
                            src={iconUrl}
                            alt={name || 'Social icon'}
                            width={22}
                            height={22}
                            unoptimized
                          />
                        )}
                        <span>{socials?.username}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mb-4">
          {isEdit ? (
            <>
              <Input
                name="bio"
                type="text"
                id="bio"
                label="Bio"
                placeholder="Enter your bio"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </>
          ) : (
            <>
              <p className="text-[#6D6D6D] pb-2">Bio</p>
              <p className="text-[#262626] font-bold">
                {userData?.bio || 'No bio'}
              </p>
            </>
          )}
        </div>

        <div className="w-full items-center justify-between flex md:justify-end md:items-center">
          {/* <div className="">
            <button
              onClick={() => setDeleteModal(true)}
              className="text-[#E7211B] w-full text-left"
            >
              Delete Account
            </button>
          </div> */}
          <Button
            className="app_auth_login__btn"
            size="md"
            backgroundColor="primary-blue-500"
            onClick={() => handleSubmit()}
            isLoading={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>
      
      <CenterModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        headerImageType={5}
      >
        <div className="space-y-5 text-center">
          <div>
            <p className="font-bold text-[16px]">
              Are you sure you want to delete this account?
            </p>
            <p className="text-[#888888]">
              Account will be deleted Permanently
            </p>
          </div>
          <div className="w-full flex items-center gap-5">
            <Button
              onClick={() => setDeleteModal(false)}
              className="w-full p-3 rounded-full border border-[#F1F1F1]"
              variant={'outline'}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteUser}
              className="w-full p-3 rounded-full bg-[#F14343] text-white"
              isLoading={isLoading}
              variant={'destructive'}
            >
              Delete
            </Button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
};

export default Profile;
