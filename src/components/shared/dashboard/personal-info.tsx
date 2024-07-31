import { Skeleton } from '@/components/ui/skeleton'
import routes from '@/lib/routes'
import { getAvatar } from '@/lib/utils'
import queries from '@/services/queries/customer-management'
import { format } from 'date-fns'
import { useParams } from 'next/navigation'
import { TagUser, Export, ArrowDownBulk } from '../svgs'
import { PersonalInfoItem } from './personal-info-item'
import Link from 'next/link'
import Image from 'next/image'
import { useIsActive } from '@/hooks'

export function PersonalInfo () {
  const IS_ACCT_MGT = useIsActive().isActive(routes.dashboard.accountManagement.path)

  const params = useParams()
  const accountNumber = typeof params.id === 'string' ? params.id : undefined

  const { data, isLoading } = queries.readOne({ accountNumber })
  const customer = data?.responseData

  if (!data?.responseData && isLoading) {
    return (
      <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
        <Skeleton height={IS_ACCT_MGT ? 265 : 400} />
      </div>
    )
  }

  return (
    <div className="app_personal_information app_personal_information_con flex flex-col gap-5">
      <div className="app_personal_information__header flex justify-between items-center">
        <div className="flex gap-5">
          <Link href={routes.dashboard.customerInformation.path + `/${accountNumber}`}>
            <button
              type="button"
              className="app_personal_information__header__btn flex items-center gap-2"
            >
              <TagUser />
              Personal Information
            </button>
          </Link>

          {!IS_ACCT_MGT && (
            <Link className="hidden md:block" href={routes.dashboard.accountManagement.path + `/${accountNumber}`}>
              <button
                type="button"
                className="app_personal_information__header__btn flex items-center gap-2 full"
              >
                Account Management
                <Export />
              </button>
            </Link>
          )}
        </div>

        {!IS_ACCT_MGT && (
          <div className="flex justify-end">
            <button
              type="button"
              className="app_personal_information__header__btn full flex items-center gap-2"
            >
              Actions <ArrowDownBulk />
            </button>
          </div>
        )}
      </div>

      <div className="app_personal_information__ctt__upper flex flex-col lg:flex-row gap-5">
        <div className="flex-1 flex flex-col md:flex-row gap-7 app_personal_information__ctt__con">
          <div className="app_personal_information__ctt__upper__avi ">
            <Image
              src={getAvatar({ size: 100, rounded: true, name: `${customer?.firstName} ${customer?.lastName}`, length: 2 })}
              alt="avi"
              className="w-full"
              height={50}
              width={50}
            />
          </div>

          <div className="flex flex-col gap-8 flex-1">
            <div className="app_personal_information__ctt__flex">
              <PersonalInfoItem label="First Name" value={customer?.firstName} />
              <PersonalInfoItem label="Middle Name" value={customer?.middleName} />
              <PersonalInfoItem label="Last Name" value={customer?.lastName} />
            </div>

            <div>
              <PersonalInfoItem
                label="Email Address"
                value={customer?.email}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 app_personal_information__ctt__con">
          <div className="flex flex-col gap-8">
            <div className="app_personal_information__ctt__flex">
              <PersonalInfoItem label="Gender" value={customer?.gender} />
              <PersonalInfoItem label="Date of Birth" value={customer?.dateOfBirth ? format(new Date(customer.dateOfBirth), 'MM-dd-yyyy') : '--'} />
              <PersonalInfoItem label="Phone Number" value={customer?.phoneNumber} />
            </div>

            <div>
              <PersonalInfoItem
                label="Location"
                value={customer?.address}
              />
            </div>
          </div>
        </div>
      </div>

      {!IS_ACCT_MGT && (
        <div className="flex-1 app_personal_information__ctt__con">
          <div className="app_personal_information__ctt__flex">
            <PersonalInfoItem label="Marital Status" value={customer?.maritalStatus} />
            <PersonalInfoItem label="Place of Birth" value="--" />
            <PersonalInfoItem label="Mother’s Maiden Name" value={customer?.motherMaidenName} />
            <PersonalInfoItem label="Nationality" value={customer?.nationality}/>
            <PersonalInfoItem label="LGA" value="--" />
            <PersonalInfoItem label="Religion" value={customer?.regionName} />
          </div>
        </div>
      )}
    </div>
  )
}
