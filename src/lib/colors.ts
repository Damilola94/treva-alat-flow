export const rootColors = {
  'green-200': '#BCF0DA',
  'green-500': '#0E9F6E',
  'green-900': '#26A17B',

  'grey-600': '#475367',

  'heather-200': '#D7DEE6',
  'heather-950': '#2E323D',

  'red-200': '#FBD5D5',

  'yellow-200': '#FCE96A',

  white: '#fff',

  'primary-color': '#fafafa',
  'primary-color-200': '#00DAD9',
  'primary-color-500': '#A5A6F6',

  'wema-purple': '#9A1A87',

  'text-color': '#222222',

  'neutral-colours-nc-100': '#FAFAFA',

  'neutral-colours-white': '#fff',

  'iris-60': '#A5A6F6',

  'treva-purple-50': '#EFF1FE',
  'treva-purple-100': '#E2E4FD',

  'text-color-100': '#F1F1F1',
  'text-color-200': '#E7E7E7',
  'text-color-400': '#808080',
  'text-color-500': '#333333',
  'text-color-900': '#262626',

  'shark-40': '#d1d5db',
  'shark-50': '#f6f6f6',
  'shark-100': '#e7e7e7',
  'shark-200': '#d1d1d1',
  'shark-300': '#b0b0b0',
  'shark-400': '#888',
  'shark-500': '#6d6d6d',
  'shark-600': '#5d5d5d',
  'shark-700': '#4f4f4f',
  'shark-800': '#454545',
  'shark-900': '#3d3d3d',
  'shark-950': '#262626',

  'primary-blue-500': '#7B37F0'
}

export type Color = ReturnType<() => typeof rootColors>

export default function generateColorsCss () {
  let css = ''
  let rootVariables = ''

  Object.entries(rootColors).forEach(([key, value]) => {
    css += `.${key} {
      color: var(--${key}) !important;
    }`

    css += `.bg-${key} {
      background-color: var(--${key}) !important;  
    }`

    rootVariables += `--${key}: ${value};`
  })

  return `${css} :root { ${rootVariables} }`
}
