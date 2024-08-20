import { type ReactNode } from 'react'

export interface IProps extends React.HTMLProps<HTMLInputElement> {
  children: ReactNode
  name: string
}

export function FileButton (props: IProps) {
  const { children, ...restProps } = props

  const htmlFor = restProps.name || restProps.id

  return (
    <label className="app_file_upload__label" htmlFor={htmlFor}>
      {children}

      <input id={htmlFor} type="file" accept="image/png, image/jpeg" {...restProps} />
    </label>
  )
}
