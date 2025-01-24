import React, { type ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { type DialogProps } from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Multiply } from '.'

interface IProps extends DialogProps {
  handleClose?: () => void
  children: ReactNode
  trigger?: ReactNode
  header?: ReactNode
  className?: string
  contentClassName?: string
}

export function Modal (props: IProps) {
  const {
    handleClose,
    children,
    trigger,
    className = '',
    contentClassName = '',
    header,
    ...restProps
  } = props

  return (
    <Dialog {...restProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        aria-describedby=""
        className={`sm:max-w-[590px] app_img_dialog app_modal__ctt ${className} ${contentClassName}`}
      >
        <VisuallyHidden.Root>
          <DialogTitle className="DialogTitle" />
        </VisuallyHidden.Root>

        {handleClose && (
          <div className="app_modal__ctt__top">
            <div>{header}</div>

            <button onClick={handleClose}>
              <Multiply />
            </button>
          </div>
        )}

        {children}
      </DialogContent>
    </Dialog>
  )
}
