import { errorToast, successToast } from "@/services";
import {useAddWithdrawFundsMutation, useGetMyWalletQuery, useGetTransactionsQuery } from "@/services/paymentService";
import { useAppSelector } from "@/store";
import { ITrevaPaymentService } from "@/types";
import { getErrorMessage } from "@/utils";
import { useState } from "react";

interface IParams {
  accountNumber: number;
  availableBalance: number;
  bankName: string;
  currency: string;
  walletId: string;
}

interface IAddWithdraw {
  beneficiaryAccountNumber: string;
  amount: number;
  walletId?: string | null | undefined;
}

const usePaymentService = (params: IParams) => {
  const { walletId } = params;
  const { loggedIn } = useAppSelector((state) => state?.auth);
    const [addWithdrawResponse, setAddWithdrawResponse] =
      useState<ITrevaPaymentService["schemas"]["WalletModelBaseResponse"]>();
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

 const [triggerAddBeneficiary, { isLoading: addBeneficiaryLoading }] =
    useAddWithdrawFundsMutation();

 const addWithdrawFunds = async (payload: IAddWithdraw) => {
  try {
    const response = await triggerAddBeneficiary(payload).unwrap();

    if (response?.isSuccess) {
      successToast(response?.message || "Client added successfully");
      setAddWithdrawResponse(response);
      refetch();
    } else {
      errorToast(response?.message || "Something went wrong");
    }
  } catch (error) {
    const message = getErrorMessage(error);
    errorToast(message || "Something went wrong");
  }
};


  const {
    data: myTransactions,
  } = useGetTransactionsQuery(walletId, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn || !walletId,
  });

  return {
    addWithdrawResponse,
    addWithdrawFunds,
    myWalletData,
    myTransactions,
    loading: isFetching || isLoading || addBeneficiaryLoading,
    error,
    isError,
    refetch,
  };
};

export default usePaymentService;
