import routes from '@/lib/routes'
import Link from 'next/link'
import { Logo } from '../svgs'

export function Header () {
  return (
    <div className="app_auth_login_container__header flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Logo />
      </div>
      <div className="flex items-center gap-2">
        <p className="app_auth_login_container__header__account">
          Already have an account?
        </p>
        <Link href={routes.auth.signIn.path}>
          <p className="app_auth_login_container__header__signin">Sign in</p>
        </Link>
      </div>
    </div>
  )
}
