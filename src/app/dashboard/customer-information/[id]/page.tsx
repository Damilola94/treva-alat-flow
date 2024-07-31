'use client'

import React from 'react'
import {
  ProfileCircle,
  Securitycard,
  UserOctagon
} from '@/components/shared'
import Image from 'next/image'
import dashboard from '@/lib/assets/dashboard'
import { Psychographics } from '@/components/shared/dashboard/customer-information'
import queries from '@/services/queries/customer-management'
import { Skeleton } from '@/components/ui/skeleton'
import { PersonalInfoItem } from '@/components/shared/dashboard'
import { PersonalInfo } from '@/components/shared/dashboard/personal-info'

export interface ICustomer {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  gender?: string
  dob: Date
  phone: string
  address?: string
  maritalStatus?: string
  placeOfBirth?: string
  nationality?: string
  motherMaidenName?: string
  lga?: string
  state?: string
  religion?: string
  identification: string
  signature?: string
}

export interface INextOfKin {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  gender?: string
  dob: Date
  phone: string
  relationship: string
  address?: string
  maritalStatus?: string
  placeOfBirth?: string
  nationality?: string
  motherMaidenName?: string
  lga?: string
  state?: string
  religion?: string
  identification: string
}

function ContactInfo () {
  const { data, isLoading } = queries.readOne()
  const customer = data?.responseData

  const validId = customer?.idPassport ?? customer?.idNin ?? customer?.idDriversLicense ?? customer?.idLicense

  if (!data?.responseData && isLoading) {
    return (
      <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
        <Skeleton height={180} />
      </div>
    )
  }

  return (
    <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
      <div className="app_personal_information__header flex justify-between items-center">
        <div className="flex gap-5">
          <p className="app_personal_information__header__btn flex items-center gap-2">
            <ProfileCircle />
            Contact Information
          </p>
        </div>
      </div>
      <div className="flex-1 app_personal_information__ctt__con">
        <div className="app_personal_information__ctt__flex">
          <PersonalInfoItem label="Residential Address" value={customer?.address} />
          <PersonalInfoItem label="Nearest Bustop/Landmark" value="--" />
          <PersonalInfoItem label="State" value={customer?.state} />
          <PersonalInfoItem label="LGA" value="--" />
          <PersonalInfoItem
            label="No of years in present Residence"
            value="--"
          />
          <PersonalInfoItem
            label="Valid Means of ID"
            value={validId}
          />
        </div>
      </div>
    </div>
  )
}

function NextOfKinInfo () {
  const { data, isLoading } = queries.readOne()
  const customer = data?.responseData

  if (!data?.responseData && isLoading) {
    return (
      <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
        <Skeleton height={185} />
      </div>
    )
  }

  return (
    <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
      <div className="app_personal_information__header flex justify-between items-center">
        <div className="flex gap-5">
          <p className="app_personal_information__header__btn flex items-center gap-2">
            <UserOctagon />
            Next of kin Information
          </p>
        </div>
      </div>

      <div className="flex-1 app_personal_information__ctt__con">
        <div className="app_personal_information__ctt__flex">
          <PersonalInfoItem label="First Name" value={customer?.nextOfKinFirstName} />
          <PersonalInfoItem label="Middle Name" value="--" />
          <PersonalInfoItem label="Last Name" value={customer?.nextOfKinLastName} />
          <PersonalInfoItem label="Gender" value={customer?.nextOfKinGender} />
          <PersonalInfoItem label="Date of Birth" value="--" />
          <PersonalInfoItem label="Phone Number" value={customer?.nextOfKinPhoneNumber} />
          <PersonalInfoItem label="Relationship" value="--" />
        </div>
      </div>

      <div className="flex-1 app_personal_information__ctt__con">
        <div className="app_personal_information__ctt__flex">
          <PersonalInfoItem label="Residential Address" value={customer?.nextOfKinAddress} />
          <PersonalInfoItem label="Nearest Bustop/Landmark" value="--" />
          <PersonalInfoItem label="State" value="--" />
          <PersonalInfoItem label="LGA" value="--" />
          <PersonalInfoItem
            label="No of years in present Residence"
            value="--"
          />
          <PersonalInfoItem
            label="Valid Means of ID"
            value="--"
          />
        </div>
      </div>
    </div>
  )
}

function AccountMandateInfo () {
  const { data, isLoading } = queries.readOne()

  if (!data?.responseData && isLoading) {
    return (
      <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
        <Skeleton height={180} />
      </div>
    )
  }

  return (
    <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
      <div className="app_personal_information__header flex justify-between items-center">
        <div className="flex gap-5">
          <p className="app_personal_information__header__btn flex items-center gap-2">
            <Securitycard />
            Account Mandate Information
          </p>

          <p className="app_personal_information__header__btn flex items-center gap-2">
            Sole Signatory
          </p>
        </div>
      </div>

      <div className="flex-1 app_personal_information__ctt__con">
        <div className="app_personal_information__ctt__flex">
          <PersonalInfoItem label="First Name" value="--" />
          <PersonalInfoItem label="Middle Name" value="--" />
          <PersonalInfoItem label="Last Name" value="--" />
          <PersonalInfoItem label="Email" value="--" />
          <PersonalInfoItem label="Phone Number" value="--" />

          <div className="flex flex-col gap-2">
            <p className="app_personal_information__ctt__label">Signature</p>

            <div className="app_personal_information__ctt__image">
              <Image
                src={dashboard.signature}
                alt="signature"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page () {
  return (
    <div className="app_dashboard_page__pd app_customer_information">
      <PersonalInfo />

      <Psychographics />

      <ContactInfo />

      <NextOfKinInfo />

      <AccountMandateInfo />
    </div>
  )
}
