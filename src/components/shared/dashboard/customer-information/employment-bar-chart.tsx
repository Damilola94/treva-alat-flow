import { type IGenderData } from '@/lib/static'
import React, { Fragment } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts'

interface IProps {
  data: IGenderData[]
}

export default function EmploymentBarChart (props: IProps) {
  const { data } = props

  return (
    <Fragment>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" minHeight={'200px'}>
          <BarChart
            width={900}
            height={341}
            data={data}
            layout="vertical"
            barCategoryGap={1}
            margin={{ top: 10, right: 0, left: -60, bottom: 0 }}
            barGap={30}
            // margin={{}}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <CartesianGrid stroke="#D9D9EB" strokeOpacity={0.5} />
            <XAxis
              type="number"
              tickSize={0}
              axisLine={false}
              domain={[0, 100]}
            />
            <YAxis
              dataKey="name"
              type="category"
              scale="band"
              tickLine={false}
              tick={false}
              axisLine={false}
            />

            <Bar
              dataKey="percent"
              fill="#323232"
              barSize={22}
              maxBarSize={100}
              // background={'#F5F5F5' as any}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-end">
          <p className="app_chart_percentage_text">Percentage (%)</p>
        </div>
      </div>

      <div className="flex md:flex-col gap-5 app_gender_tooltip__con">
        {data?.map((item) => (
          <div key={item.index} className="app_gender_tooltip flex gap-1">
            <div
              className="app_gender_tooltip__indicator"
              style={{ background: item.fill }}
            ></div>
            <div>
              <p className="app_gender_tooltip__text"> {item.percent}%</p>
              <p className="app_gender_tooltip__text__sm">{item.fullLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  )
}
