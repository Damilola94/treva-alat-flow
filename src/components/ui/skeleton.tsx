import { cn } from '@/lib/utils'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string
}

function Skeleton (props: IProps) {
  const { className, height = 150, ...prop } = props
  return (
    <div className="app_skeleton">
      <div
        className={cn(
          'animate-pulse rounded-md bg-muted app_skeleton__bg',
          className
        )}
        {...prop}
        style={{ height: `${height}px` }}
      />
    </div>
  )
}

export { Skeleton }
