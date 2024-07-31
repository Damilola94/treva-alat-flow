import React, { Fragment, useState } from 'react'
import { PieChart, Cell, Pie, Sector } from 'recharts'
import { Text } from '@visx/text'

const Data = [
  {
    id: 1,
    title: 'Average Timeline for Legal Advisory',
    route: '',
    needle: true,
    label: 'Credit Score',

    needleValue: 10,
    child: [
      {
        id: 1,
        value: 50,
        color: '#d70000'
      },
      {
        id: 2,
        value: 50,
        color: '#fec750'
      },
      {
        id: 3,
        value: 50,
        color: '#7dff8a'
      },
      {
        id: 4,
        value: 50,
        color: '#00c213'
      }
    ]
  }
]

const RADIAN = Math.PI / 180

const needleComp = (
  value: number,
  data: Array<{ id: number, value: number, color: string }>,
  cx: number | string,
  cy: number | string,
  iR: number,
  oR: number,
  color: string
) => {
  let total = 0
  data.forEach((v) => {
    total += v.value
  })
  const ang = 180.0 * (1 - value / total)
  const length = (iR + 2 * oR) / 3
  const sin = Math.sin(-RADIAN * ang)
  const cos = Math.cos(-RADIAN * ang)
  const r = 5
  const x0 = 90
  const y0 = 90
  const xba = x0 + r * sin
  const yba = y0 - r * cos
  const xbb = x0 - r * sin
  const ybb = y0 + r * cos
  const xp = x0 + length * cos
  const yp = y0 + length * sin

  return [
    <Fragment key={cx}>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="#none"
        fill={color}
      />
      ,
    </Fragment>
  ]
}

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    cornerRadius,

    label
  } = props
  const centerTextPos = cy - 5
  return (
    <g>
      <Text
        x={cx}
        y={centerTextPos}
        dy={25}
        textAnchor="middle"
        fill="#222"
        style={{ fontSize: '12px', fontWeight: 500 }}
        width={200}
      >
        {label}
      </Text>

      <Text
        x={cx}
        y={centerTextPos + 25}
        dy={25}
        textAnchor="middle"
        fill="#222"
        style={{ fontSize: '20px', fontWeight: 700 }}
        width={200}
        className="app_needle_chart__label"
      >
        720
      </Text>

      <Text
        x={cx}
        y={centerTextPos + 45}
        dy={25}
        textAnchor="middle"
        fill="#808080"
        style={{ fontSize: '12px', fontWeight: 500 }}
        width={200}
        className="app_needle_chart__label"
      >
        Excellent Credit
      </Text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={cornerRadius}
      />
    </g>
  )
}

export default function NeedleChart () {
  const kpi = Data[0]
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }
  const { label, needleValue } = kpi
  const cx = '50%'
  const cy = '50%'
  const iR = 45
  const oR = 65
  return (
    <div className="directorate_kpi__cards__card flex items-center justify-around gap-5">
      <div className="directorate_kpi__cards__card__chart">
        <PieChart
          width={180}
          height={180}
          margin={{ top: 35, left: 80, right: 80, bottom: 35 }}
        >
          <defs>
            {kpi.child.map((entry, index) => {
              const comboId = `${index}${kpi.id}`
              return (
                <linearGradient id={`myGradient${comboId}`} key={comboId}>
                  <stop offset="0%" stopColor={entry.color} />
                  <stop offset="100%" stopColor={entry.color} />
                </linearGradient>
              )
            })}
          </defs>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            activeIndex={activeIndex}
            activeShape={(pp: any) => renderActiveShape({ ...pp, label })}
            data={kpi.child}
            cx={cx}
            cy={cy}
            innerRadius={iR}
            outerRadius={oR}
            fill="#8884d8"
            stroke="none"
            paddingAngle={0}
            cornerRadius={0}
            onMouseEnter={onPieEnter}
          >
            {kpi.child.map((entry, index) => {
              const comboId = `${index}${kpi.id}`
              return (
                <Cell
                  key={`cell-${comboId}`}
                  fill={`url(#myGradient${comboId})`}
                />
              )
            })}
          </Pie>
          {needleComp(needleValue, kpi.child, cx, cy, iR, oR, '#333')}
        </PieChart>
      </div>

      <div className="">
        <h3 className="app_needle_chart__value"> 720</h3>
        <p className="app_needle_chart__details">Excellent Credit</p>
      </div>
    </div>
  )
}
