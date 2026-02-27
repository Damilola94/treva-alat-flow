'use client';
import { CheckCircle } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useProfile, useUsers } from '@/hooks/Users';
import routes from '@/lib/routes';
import { setOnboardingStatus } from '@/store/slices/auth';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

export default function Finish() {
  const rt = useRouter();
  const {
    saveCreativeOnboarding,
    loading,
  } = useUsers();
    const { refetch } = useProfile(); 
    const dispatch = useDispatch();


  //  useEffect(() => {
  //     if (saveOnboardingResponse?.isSuccess) {
  //       rt.push(routes.creatives.dashboard.entry.path);
  //     }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [saveOnboardingResponse]);

    // const handleNext = async () => {
    //   await saveCreativeOnboarding({ currentStep: 4 }); 
    //   await refetch(); 
  
    //   rt.push(routes.creatives.dashboard.entry.path); 
    // };

      const handleNext = async () => {
    try {
      // 4. Save to API
      await saveCreativeOnboarding({ currentStep: 4 }); 
      
      // 5. Update Redux immediately
      // This changes the 'isOnboardingCompleted' state in your Slice to true
      dispatch(setOnboardingStatus(true)); 

      // 6. Force a refetch of the profile data for consistency
      await refetch(); 
  
      // 7. Redirect
      rt.push(routes.creatives.dashboard.entry.path); 
    } catch (error) {
      console.error("Failed to complete onboarding", error);
    }
  };

  return (
    <div className="app_get_started_professional_details app_get_started_done py-6 px-4 h-full flex">
      <div className="flex-1 flex flex-col items-center justify-center gap-11">
        <CheckCircle width={58} height={58} />

        <div className="flex flex-col gap-9">
          <p className="app_get_started_done__text">All done</p>

          <div className="">
            <Button
              size="xl"
              backgroundColor="primary-blue-500"
              className="w-full py-3 px-12"
              //  onClick={() => saveCreativeOnboarding({ currentStep: 4 })}
              onClick={handleNext}
              isLoading={loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
