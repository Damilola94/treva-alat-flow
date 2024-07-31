'use client'
import React, { useState } from 'react'
import { ArrowDown, Bubble, RenderIf } from '../..'
import GenderBarChart from './gender-bar-chart'
import EmploymentBarChart from './employment-bar-chart'
import AgeGroupChart from './age-group-chart'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  employmentData,
  genderData,
  maritalData,
  religionData
} from '@/lib/static'
import queries from '@/services/queries/customer-management/demographics'
import { Skeleton } from '@/components/ui/skeleton'
import { getParseFloat } from '@/lib/numbers'

enum DemographicsEnum {
  GENDER = 'Gender',
  EMPLOYMENT_STATUS = 'Employment Status',
  MARITAL_STATUS = 'Marital Status',
  RELIGION = 'Religion',
  AGE_GROUP = 'Age Group'
}

type IOption = `${DemographicsEnum}`

const options: IOption[] = Object.values(DemographicsEnum)

export function Demographics () {
  const { data, isLoading } = queries.read()

  const [activeOption, setActiveOption] = useState<IOption>(DemographicsEnum.GENDER)

  if (!data?.responseData?.length && isLoading) {
    return (
    <div className="app_gender_chart flex flex-col gap-6">
      <Skeleton height={320} />
    </div>
    )
  }

  const activeResponseData = data?.responseData?.find((item) => item.category?.toLowerCase() === activeOption.toLowerCase())

  const genderOrReligionData = [DemographicsEnum.GENDER.toLowerCase(), DemographicsEnum.RELIGION.toLowerCase()].includes(activeResponseData?.category?.toLowerCase() ?? '') ? activeResponseData?.data ?? [] : []
  const genderChartData = genderOrReligionData.map((item, index) => ({ ...(genderData[index] ?? {}), ...item, percent: getParseFloat(item.value) }))
  const religionChartData = genderOrReligionData.map((item, index) => ({ ...(religionData[index] ?? {}), ...item, percent: getParseFloat(item.value) }))

  const employmentOrMaritalData = [DemographicsEnum.EMPLOYMENT_STATUS.toLowerCase(), DemographicsEnum.MARITAL_STATUS.toLowerCase()].includes(activeResponseData?.category?.toLowerCase() ?? '') ? activeResponseData?.data ?? [] : []
  const employmentChartData = employmentOrMaritalData.map((item, index) => ({ ...(employmentData[index] ?? {}), ...item, percent: getParseFloat(item.value) }))
  const maritalChartData = employmentOrMaritalData.map((item, index) => ({ ...(maritalData[index] ?? {}), ...item, percent: getParseFloat(item.value) }))

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ageData = [DemographicsEnum.AGE_GROUP.toLowerCase()].includes(activeResponseData?.category?.toLowerCase() ?? '') ? activeResponseData?.data ?? [] : []

  return (
    <div className="app_gender_chart flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <button className="app_gender_chart__btn">
            <Bubble />
            Demographics
          </button>
        </div>

        <div>
          <Popover>
            <PopoverTrigger
            // onClick={() => {
            //   setIsOpen(true);
            // }}
            >
              <p className="app_gender_chart__btn">
                {activeOption}
                <ArrowDown />
              </p>
            </PopoverTrigger>
            <PopoverContent
              className="app_gender__popover"
              side="bottom"
              align="end"
              sideOffset={10}
            >
              <div className="flex flex-col gap-0">
                {options.map((item) => (
                  <button
                    key={item}
                    className={`app_gender__popover__btn ${
                      item === activeOption ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveOption(item)

                      setTimeout(() => {
                        document.body.focus()
                      }, 500)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {/* <button className="app_gender_chart__btn">
            Gender
            <ArrowDown />
          </button> */}
        </div>
      </div>

      <div className="app_gender_chart__bar__chart flex gap-10 items-center">
        <RenderIf condition={activeOption === 'Gender'}>
          <GenderBarChart data={genderChartData} />
        </RenderIf>

        <RenderIf condition={activeOption === 'Religion'}>
          <GenderBarChart data={religionChartData} />
        </RenderIf>

        <RenderIf condition={activeOption === 'Employment Status'}>
          <EmploymentBarChart data={employmentChartData} />
        </RenderIf>

        <RenderIf condition={activeOption === 'Marital Status'}>
          <EmploymentBarChart data={maritalChartData} />
        </RenderIf>

        <RenderIf condition={activeOption === 'Age Group'}>
          <AgeGroupChart data={maritalChartData} />
        </RenderIf>
      </div>
    </div>
  )
}
