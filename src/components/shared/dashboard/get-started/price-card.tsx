import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircleFilled } from '../../svgs'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { Formik } from 'formik'
import * as Yup from 'yup'

type BillingCycle = 'Monthly' | 'Yearly'

const features = [
  'Chat Widget',
  'SLA+Alerts',
  'Workflows',
  'Prioritizations & Queues',
  'Chat Widget',
  'SLA+Alerts',
  'Workflows',
  'Prioritizations & Queues'
]

const validationSchema = Yup.object().shape({
  // Define validation rules if necessary
})

const initialValues = {
  startTour: '',
  startTour2: ''
}

const PricingCards: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly')

  return (
    <div className="pricing-cards">
      <div className="billing-toggle">
        <button
          className={billingCycle === 'Monthly' ? 'active' : ''}
          onClick={() => { setBillingCycle('Monthly') }}
        >
          Monthly
        </button>
        <button
          className={billingCycle === 'Yearly' ? 'active' : ''}
          onClick={() => { setBillingCycle('Yearly') }}
        >
          Yearly
        </button>
      </div>
      <div className="plans">
        <PlanCard
          title="Free"
          price="Free"
          features={features}
          billingCycle={billingCycle}
          backgroundColor="primary-color-500"
        />
        <PlanCard
          title="NGN 5,000"
          price="5,000"
          features={features}
          billingCycle={billingCycle}
          backgroundColor="primary-color-200"
        />
      </div>
    </div>
  )
}

interface PlanCardProps {
  title: string
  price: string
  features: string[]
  billingCycle: BillingCycle
  backgroundColor: string
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  features,
  billingCycle,
  backgroundColor
}) => {
  const router = useRouter()

  const onSubmit = () => {
    router.push(routes.dashboard.getStarted.done.path)
  }

  return (
    <div className="plans__plan">
      <div className={`plans__plan-top-card bg-${backgroundColor}`}>
        <h2 className="plans__plan__title">{title}</h2>
        <p>per month billed {billingCycle.toLowerCase()}</p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {
          onSubmit()
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ul>
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircleFilled
                    fill={title === 'Free' ? '#A5A6F6' : '#00DAD9'}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              backgroundColor="primary-blue-500"
              size="lg"
              className="w-full"
              type="submit"
            >
              Buy plan
            </Button>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default PricingCards
