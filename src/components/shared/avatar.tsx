import Image, { type StaticImageData } from 'next/image'

export interface IProps {
  className?: string
  src: StaticImageData | string
  size?: number | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: { value: 32 },
  md: { value: 48 },
  lg: { value: 64 },
  xl: { value: 80 }
}

export function Avatar (props: IProps) {
  const { className, src, size = 'sm' } = props

  const sizeValue = typeof size === 'string' ? (sizeMap[size]?.value || 32) : size

  const sizeClassName = `app_user_avi--${sizeValue}`

  return (
    <div className={['app_user_avi', sizeClassName, className].join(' ')}>
      <Image height={sizeValue} width={sizeValue} src={src} alt="" unoptimized />

      <style type="text/css">{`
        .app_user_avi.${sizeClassName} {
          --avi-size: ${sizeValue}px;
        }
      `}</style>
    </div>
  )
}
