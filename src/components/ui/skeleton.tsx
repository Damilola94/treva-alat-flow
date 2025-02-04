import { cn } from '@/lib/utils'

interface IProps extends React.HTMLAttributes<HTMLTableRowElement> {
  height?: number | string
  columns: number
}

function Skeleton (props: IProps) {
  const { className, columns, height = 50, ...prop } = props

  return (
    <tr className={cn('animate-pulse app_skeleton', className)} {...prop}>
      {[...Array(columns)].map((_, index) => (
        <td key={index} className="p-2">
          <div
            className="rounded-md bg-muted app_skeleton__bg w-full"
            style={{ height: `${height}px` }}
          />
        </td>
      ))}
    </tr>
  )
}

export { Skeleton }
