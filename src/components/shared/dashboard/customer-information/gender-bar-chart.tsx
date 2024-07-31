import { type IGenderData } from '@/lib/static'
import React, { Fragment } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts'

interface IProps {
  data: IGenderData[]
}

interface IBarChartLabel {
  x: number
  y: number
  width: number
  value: number
}

const BarChartLabel: React.FC<IBarChartLabel> = ({
  x,
  y,
  value
}: {
  x: number
  y: number
  value: number | string
}) => {
  const newX = x - 30
  const newY = y + 9
  return (
    <text textAnchor="start" x={newX} y={newY} fill="#666">
      {value}
    </text>
  )
}

export default function GenderBarChart (props: IProps) {
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
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            barGap={30}
            // margin={{}}
          >
            <XAxis type="number" tickSize={0} axisLine={false} />
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
              barSize={8}
              maxBarSize={100}
              radius={[10, 10, 10, 10]}
              background={'#F5F5F5' as any}
            >
              <LabelList
                dataKey="name"
                position="top"
                fill="#262626"
                content={<BarChartLabel x={-1} y={-1} width={-1} value={-1} />}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>

            <Bar
              dataKey="max"
              fill="#323232"
              barSize={0.1}
              style={{
                textAnchor: 'middle'
              }}
              label={false}
              maxBarSize={100}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={'#000'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-end">
          <p className="app_chart_percentage_text">Percentage (%)</p>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap md:flex-col gap-5 app_gender_tooltip__con gender">
        {data?.map((item) => (
          <div key={item.index} className="app_gender_tooltip flex gap-1">
            <div
              className="app_gender_tooltip__indicator"
              style={{ background: item.fill }}
            ></div>
            <div className="flex-1">
              <p className="app_gender_tooltip__text"> {item.percent}%</p>
              <p className="app_gender_tooltip__text__sm">{item.fullLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  )
}
