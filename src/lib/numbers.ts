export function numberFormat (number?: number, options?: Intl.NumberFormatOptions) {
  if (typeof number !== 'number') return null

  const { style = 'currency', currency = 'NGN', maximumFractionDigits = 2 } = options ?? {}

  return Intl.NumberFormat('en-NG', {
    ...options, style, currency, maximumFractionDigits
  }).format(number)
}

export function getParseFloat (value: any) {
  if (Number.isNaN(Number.parseFloat(value))) {
    return 0
  }

  return parseFloat(value)
}
