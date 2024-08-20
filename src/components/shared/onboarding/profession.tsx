import { Formik } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/onboarding'
import { Pill } from '@/components/shared'

enum Professions {
  Designer = 'Designer',
  Writer = 'Writer',
  Influencer = 'Influencer',
  Photographer = 'Photographer',
  Freelancer = 'Freelancer',
  Others = 'Others',
}

const validationSchema = Yup.object().shape({
  // password: Yup.string().min(8).required()
})

const initialValues = {
  accountType: Professions.Designer as `${Professions}`
}

export function Profession (props?: { onSubmit?: () => void }) {
  const rt = useRouter()
  const { isLoading } = queries.login()

  const onSubmit = () => { rt.push(routes.onboarding.emailVerification.path) }

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={props?.onSubmit ?? onSubmit}
            >
              {(props) => {
                const {
                  values,
                  setFieldValue,
                  handleSubmit
                } = props

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      What is your profession
                    </h3>
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(Professions).map(([label]) => (
                          <Pill
                            key={label}
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={async () => await setFieldValue('accountType', label)}
                            active={values.accountType === label}
                          >
                            {label}
                          </Pill>
                        ))}
                      </div>
                    </div>

                    <div className="">
                      <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="shark-950"
                        className="w-full app_auth_login__btn"
                      >
                        Next
                      </Button>
                    </div>
                  </form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}
