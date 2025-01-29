export const genderData = [
  {
    name: 'MA',
    fullLabel: 'Male',
    percent: 70,
    max: 100,
    index: 1,
    fill: '#00C213'
  },

  {
    name: 'FE',
    fullLabel: 'Female',
    percent: 30,
    max: 100,
    index: 2,
    fill: '#D70000'
  }
]

export const religionData = [
  {
    name: 'CHS',
    fullLabel: 'Christianity',
    percent: 70,
    max: 100,
    index: 1,
    fill: '#00C213'
  },

  {
    name: 'ISM',
    fullLabel: 'Islam',
    percent: 30,
    max: 100,
    index: 2,
    fill: '#D70000'
  }
]

export const employmentData = [
  {
    name: 'MA',
    fullLabel: 'Employed Customers',
    percent: 60,
    max: 100,
    index: 1,
    fill: '#9A1A87'
  },

  {
    name: 'FE',
    fullLabel: 'Unemployed Customers',
    percent: 20,
    max: 100,
    index: 2,
    fill: '#2688F3'
  },

  {
    name: 'SE',
    fullLabel: 'Self-employed Customers',
    percent: 10,
    max: 100,
    index: 3,
    fill: '#F29855'
  },

  {
    name: 'ST',
    fullLabel: 'Stundents',
    percent: 10,
    max: 100,
    index: 3,
    fill: '#C29855'
  }
]

export const maritalData = [
  {
    name: 'MA',
    fullLabel: 'Married Customers',
    percent: 40,
    max: 100,
    index: 1,
    fill: '#9A1A87'
  },

  {
    name: 'FE',
    fullLabel: 'Single Customers',
    percent: 40,
    max: 100,
    index: 2,
    fill: '#2688F3'
  },

  {
    name: 'SE',
    fullLabel: 'Divorced Customers',
    percent: 10,
    max: 100,
    index: 3,
    fill: '#F29855'
  },

  {
    name: 'UN',
    fullLabel: 'Unknown',
    percent: 10,
    max: 100,
    index: 3,
    fill: '#C29855'
  }
]

export type IGenderData = ReturnType<() => (typeof genderData)[0]>
