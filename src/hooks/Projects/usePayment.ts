import { useGetMyWalletQuery, useGetWalletByIdQuery } from "@/services/paymentService";
import { useAppSelector } from "@/store";

interface IParams {
  accountNumber: number;
  availableBalance: number;
  bankName: string;
  currency: string;
  walletId: string;
}

const usePaymentService = (params: IParams) => {
  const { walletId } = params;
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const {
    data: myWalletData,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetMyWalletQuery( {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  const {
    data: myWalletByIdData,
  } = useGetWalletByIdQuery(walletId, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn || !walletId,
  });

  return {
    myWalletData,
    myWalletByIdData,
    loading: isFetching || isLoading,
    error,
    isError,
    refetch,
  };
};

export default usePaymentService;
