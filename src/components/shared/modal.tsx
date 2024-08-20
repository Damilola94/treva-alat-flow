import React, { type ReactNode } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { type DialogProps } from '@radix-ui/react-dialog'
import { CloseSquare } from '.'

interface IProps extends DialogProps {
  handleClose?: () => void
  children: ReactNode
  trigger?: ReactNode
  className?: string
}

export function Modal (props: IProps) {
  const {
    handleClose,
    children,
    trigger,
    className = '',
    ...restProps
  } = props

  return (
    <Dialog {...restProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`sm:max-w-[590px] app_img_dialog app_modal__ctt ${className}`}
      >
        {handleClose && (
          <div className="app_modal__ctt__close">
            <button onClick={handleClose}>
              <CloseSquare />
            </button>
          </div>
        )}

        {children}
      </DialogContent>
    </Dialog>
  )
}
