export interface Demographic {
  category: string
  data: Datum[]
}

export interface Datum {
  key: string
  value: number | string
  metric: Metric
}

export enum Metric {
  Percent = 'percent',
  Unit = 'unit',
}
