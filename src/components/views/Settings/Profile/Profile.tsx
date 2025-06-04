'use client';
import { EditSmall } from '@/app/assets/svgs';
import {
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
import { handleErrors } from '@/services';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const Profile = () => {
  const { data, refetch } = useProfile();
  const userData = useMemo(() => data?.data || null, [data]);
  const [isEdit, toggleIsEdit] = useState(false);
  const [pictureEdit, togglePictureEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { updateProfileDetails, loading, updateResponse } = useUsers();

  const initialValues = {
    firstName: userData?.firstName ?? '',
    lastName: userData?.lastName ?? '',
    phoneNumber: userData?.phoneNumber ?? '',
    bio: userData?.bio ?? '',
    portfolioLink: userData?.portfolioLink ?? '',
    websiteUrl: userData?.websiteUrl ?? '',
    picture: userData?.profilePicture ?? '',
  };
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        updateProfileDetails(values);
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

  console.log(values?.picture);

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

        <div className="w-full flex justify-end items-center">
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
    </div>
  );
};

export default Profile;
