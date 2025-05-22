import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircleFilled } from '../../svgs';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useGetAllSubsQuery } from '@/services';
import { useAppSelector } from '@/store';
import { useUsers } from '@/hooks/Users';

const validationSchema = Yup.object().shape({
  // Define validation rules if necessary
});

const initialValues = {
  startTour: '',
  startTour2: '',
};

const PricingCards: React.FC = () => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>(
    'Monthly',
  );

  const {
    data: allSubs,
    isLoading,
    isFetching,
  } = useGetAllSubsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    skip: !loggedIn,
  });

  const subscriptions = useMemo(() => allSubs?.data || [], [allSubs?.data]);

  const filteredSubscriptions = subscriptions?.filter(
    (subs) => subs?.period === billingCycle,
  );

  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex  gap-12">
          <div
            className="flex justify-center items-center"
            style={{ minHeight: 200 }}
          >
            <span className="txxx_loader" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-cards">
      <div className="billing-toggle">
        <button
          className={
            billingCycle === 'Monthly'
              ? 'bg-black !text-white'
              : 'bg-white !text-black'
          }
          onClick={() => setBillingCycle('Monthly')}
        >
          Monthly
        </button>
        <button
          className={
            billingCycle === 'Yearly'
              ? 'bg-black !text-white'
              : 'bg-white !text-black'
          }
          onClick={() => setBillingCycle('Yearly')}
        >
          Yearly
        </button>
      </div>

      <div className="plans">
        {filteredSubscriptions?.map((subs) => (
          <PlanCard
            key={subs.id}
            subId={subs.id}
            title={subs.title}
            price={subs.amount}
            features={subs.features ?? []}
            billingCycle={subs.period}
            backgroundColor={subs.color}
          />
        ))}
      </div>
    </div>
  );
};

interface PlanCardProps {
  subId: string | undefined;
  title?: string | null | undefined;
  price: number | undefined;
  features:
    | {
        id?: string | undefined;
        name?: string | null | undefined;
        description?: string | null | undefined;
      }[]
    | null
    | undefined;
  billingCycle: string | null | undefined;
  backgroundColor: string | null | undefined;
}

const PlanCard: React.FC<PlanCardProps> = ({
  subId,
  title,
  features,
  billingCycle,
  backgroundColor,
}) => {
  const router = useRouter();

  const { saveCreativeOnboarding, saveOnboardingResponse, loading } =
    useUsers();

  const onSubmit = (id: string) => {
    const payload = {
      subscriptionId: id,
      currentStep: 4,
    };
    saveCreativeOnboarding(payload);
  };

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.creatives.dashboard.getStarted.done.path);
    }
  }, [router, saveOnboardingResponse]);

  return (
    <div className="plans__plan flex flex-col h-full">
      {' '}
      {/* 1. Make it flex + full height */}
      <div
        className={`plans__plan-top-card bg-${backgroundColor}`}
        style={{ backgroundColor: backgroundColor ?? '' }}
      >
        <h2 className="plans__plan__title">{title}</h2>
        <p>per month billed {billingCycle?.toLowerCase()}</p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => onSubmit(subId ?? '')}
      >
        {({ handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-grow justify-between gap-4"
          >
            <div className="overflow-auto flex-grow">
              <ul className="flex flex-col gap-2">
                {features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircleFilled fill={backgroundColor ?? ''} />
                    {feature?.name}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              backgroundColor="primary-blue-500"
              size="lg"
              className="w-full"
              type="submit"
              isLoading={loading}
            >
              Buy plan
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default PricingCards;
