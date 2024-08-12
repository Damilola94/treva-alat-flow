import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { type Color } from '@/lib/colors'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  backgroundColor?: keyof Color
  color?: keyof Color
  fontWeight?: string
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className: cnString, children, variant, size, asChild = false, backgroundColor, color, fontWeight = 'font-semibold', isLoading, ...restProps } = props

    const Comp = asChild ? Slot : 'button'

    const bg = `bg-${backgroundColor}`

    const className = ['app_button', bg, color, fontWeight, cnString].join(' ')

    const chd = (
      <>
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {children}
      </>
    )

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...restProps}
      >
        {chd}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
