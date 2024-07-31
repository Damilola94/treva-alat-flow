import React, { Fragment } from 'react'
import { Text } from '@visx/text'
import { PieChart, Pie, Sector, Cell, Label } from 'recharts'
import queries from '@/services/queries/account-management/financial-segment'

const colors = ['#9A1A87', '#3F78C5', '#123A4A', '#F29855', '#552ECF', 'blue', 'red', 'grey']

const useData = () => {
  const { data } = queries.read()

  return data?.responseData?.map((item, index) => ({ name: item.name, value: item.count, color: colors[index] ?? 'grey' })) ?? []
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    name,
    color,
    value,
    cornerRadius
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 1) * cos
  const sy = cy + (outerRadius + 1) * sin
  const mx = cx + (outerRadius + 3) * cos
  const my = cy + (outerRadius + 3) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke="#CDCDCD"
        fill="none"
        strokeDasharray="0.71 0.71"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 3}
        y={ey}
        textAnchor={textAnchor}
        style={{ fontSize: '8px' }}
        fill={color}
      >
        {value}
      </text>
      <Text
        x={ex + (cos >= 0 ? 1 : -1) * -15}
        y={ey}
        dy={10}
        textAnchor={textAnchor}
        fill="#999"
        style={{ fontSize: '8px' }}
        id="rectResize"
      >
        {name}
      </Text>
    </g>
  )
}

export default function FinancialSegmentChart () {
  const data = useData()
  const total = data.reduce((prev, curr) => prev + curr.value, 0)

  return (
    <Fragment>
      <div className="">
        <PieChart
          width={180}
          height={180}
          margin={{ top: 35, left: 80, right: 80, bottom: 35 }}
        >
          <Pie
            dataKey="value"
            startAngle={360}
            endAngle={0}
            // activeIndex={activeIndex}
            activeShape={(pp: any) => renderActiveShape({ ...pp })}
            data={data}
            cx={'50%'}
            cy={'50%'}
            innerRadius={63}
            outerRadius={80}
            fill="#8884d8"
            stroke="none"
            paddingAngle={3}
            cornerRadius={7}
            // onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => {
              const comboId = `${index}`
              return <Cell key={`cell-${comboId}`} fill={entry.color} />
            })}

            <Label
              position="center"
              style={{
                fontSize: '21px',
                color: '#1A1A1A',
                letterSpacing: '0.02em',
                fontWeight: 500
              }}
            >
              {total}
            </Label>
          </Pie>
          {/* {needle && needleComp(value, kpi.child, cx, cy, iR, oR, '#333')} */}
        </PieChart>
      </div>

      <div className="flex flex-col gap-5">
        {data?.map((item, id) => (
          <div
            key={id}
            className="flex app_financial_segment_tooltip items-center gap-1"
          >
            <div
              className="app_financial_segment_tooltip__indicator"
              style={{ background: item.color }}
            ></div>
            <p className="app_financial_segment_tooltip__text">
              {item.value} <span>{item.name}</span>
            </p>
          </div>
        ))}
      </div>
    </Fragment>
  )
}
