import { useGetCommonQuery } from "@/services/paymentService";
import { useAppSelector } from "@/store";

const useCommon = () => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const {
    data: myCommonData,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetCommonQuery({
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    myCommonData,
    loading: isFetching || isLoading,
    error,
    isError,
    refetch,
  };
};

export default useCommon
