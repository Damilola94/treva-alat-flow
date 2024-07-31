import { getAvatar } from '@/lib/utils'
import queries from '@/services/queries/profile'
import Image from 'next/image'

export function Profile () {
  const { data } = queries.readOne()

  const fullName = `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim()
  const name = fullName || (data?.userName ?? '')

  return (
    <div className="app_dash_main__hdr__rgt__profile">
      <div className="app_user_avi">
        <Image width={33} height={33} src={getAvatar({ background: 'F6EAF4', name, length: fullName ? 2 : 1 })} alt="" />
      </div>

      <div className="flex flex-col">
        <p className='capitalize'>{name}</p>
        <span className="app_dash_main__hdr__rgt__profile__title">RM</span>
      </div>
    </div>
  )
}
