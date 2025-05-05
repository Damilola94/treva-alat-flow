import React, { type ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { type DialogProps } from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'

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
        className={` project_management_card  ${className} ${contentClassName}`}
      >
        <div className="project_management_card__bg">
                <Image src={projectManagement.topImage} alt="take a tour" className="w-full" />
              </div>
        <VisuallyHidden.Root>
          <DialogTitle className="DialogTitle" />
        </VisuallyHidden.Root>

        {handleClose && (
          <div className="app_modal__ctt__top">
            <div>{header}</div>
          </div>
        )}

        {children}
      </DialogContent>
    </Dialog>
  )
}
