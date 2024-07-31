export const rootColors = {
  'green-200': '#BCF0DA',
  'green-500': '#0E9F6E',

  'grey-600': '#475367',

  'heather-200': '#D7DEE6',
  'heather-950': '#2E323D',

  'red-200': '#FBD5D5',

  'yellow-200': '#FCE96A',

  white: '#fff',

  'primary-color': '#FFE1FB',

  'wema-purple': '#9A1A87',

  'text-color': '#222222',

  'neutral-colours-nc-100': '#FAFAFA',

  'neutral-colours-white': '#fff'
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
