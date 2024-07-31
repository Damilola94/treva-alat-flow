import { type IGenderData } from '@/lib/static'
import React, { Fragment } from 'react'
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  Line,
  ComposedChart,
  Tooltip
} from 'recharts'
import { Text } from '@visx/text'

interface IProps {
  data: IGenderData[]
}

const data = [
  {
    name: '0-12 Age',
    value: 2100,
    pv: 2400,
    amt: 2400
  },
  {
    name: '13-25 Age',
    value: 2000,
    pv: 1398,
    amt: 2210
  },
  {
    name: '26-36 Age',
    value: 2300,
    pv: 9800,
    amt: 2290
  },
  {
    name: '37-46 Age',
    value: 2000,
    pv: 3908,
    amt: 2000
  },
  {
    name: '47-56 Age',
    value: 1900,
    pv: 4800,
    amt: 2181
  },
  {
    name: '57-65 Age',
    value: 2300,
    pv: 3800,
    amt: 2500
  },
  {
    name: '65+ ',
    value: 1800,
    pv: 4300,
    amt: 2100
  }
]

const CustomXAxisTick = ({ x, y, payload }: any) => {
  if (payload?.value) {
    return (
      <Fragment>
        <Text
          width={10}
          x={x}
          y={y + 10}
          textAnchor="middle"
          verticalAnchor="start"
          height="30px"
          className="app_age_chart_custom_axis_tick"
          fontWeight={500}
          fill="#1a1a1a"
        >
          {payload.value.split(' ')[0]}
        </Text>

        <Text
          width={10}
          x={x}
          y={y + 23}
          textAnchor="middle"
          verticalAnchor="start"
          height="30px"
          className="app_age_chart_custom_axis_tick small"
          fontWeight={400}
          fill="#808080"
        >
          {payload.value.split(' ')[1] || ''}
        </Text>
      </Fragment>
    )
  }
  return null
}

const CustomYAxisTick = () => null

export default function AgeGroupChart (props: IProps) {
  // const { data } = props;

  return (
    <div className="w-full flex-1">
      <ResponsiveContainer width="100%" minHeight={'200px'}>
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -30,
            bottom: 20
          }}
        >
          <CartesianGrid stroke="#D9D9EB" strokeOpacity={0.5} />
          <XAxis
            tick={<CustomXAxisTick />}
            dataKey="name"
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={<CustomYAxisTick />} axisLine={false} tickLine={false} />
          <Tooltip />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#9A1A87" stopOpacity="0.5" />
              <stop offset="1" stopColor="#9A1A87" stopOpacity="0" />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#991A86"
            fill="url(#splitColor)"
            activeDot={{ r: 16 }}
          />

          <Line
            type="monotone"
            // strokeDasharray="3 3"
            dataKey="value"
            stroke="#991A86"
            dot={{
              stroke: '#991A86',
              strokeWidth: 1,
              r: 4,
              strokeDasharray: '',
              fill: '#991A86'
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
