import { errorToast, successToast } from "@/services";
import {
  useAddBeneficiaryMutation,
  useGetBeneficiaryQuery,
} from "@/services/paymentService";
import { useAppSelector } from "@/store";
import { ITrevaPaymentService } from "@/types";
import { getErrorMessage } from "@/utils";
import { useMemo, useState } from "react";

interface IParams {
  accountNumber: number;
  bankCode: number;
  name: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

interface IAddBeneficiary {
  accountNumber: string;
  bankCode: string;
  name: string;
}

const useBeneficiaryManagement = (params?: IParams) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const [addBeneficiaryResponse, setAddBeneficiaryResponse] =
    useState<ITrevaPaymentService["schemas"]["BeneficiaryModelBaseResponse"]>();

  const filteredParams = useMemo(() => {
    return Object.fromEntries(
      Object.entries(params ?? {}).filter(
        ([, value]) => value !== null && value !== "" && value !== 0
      )
    );
  }, [params]);

  const {
    data: beneficiaryData,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetBeneficiaryQuery(filteredParams, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  const [triggerAddBeneficiary, { isLoading: addBeneficiaryLoading }] =
    useAddBeneficiaryMutation();

 const addBeneficiary = async (payload: IAddBeneficiary) => {
  try {
    const response = await triggerAddBeneficiary(payload).unwrap();

    if (response?.isSuccess) {
      successToast(response?.message || "Client added successfully");
      setAddBeneficiaryResponse(response);
      refetch();
    } else {
      errorToast(response?.message || "Something went wrong");
    }
  } catch (error) {
    const message = getErrorMessage(error);
    errorToast(message || "Something went wrong");
  }
};

  return {
    addBeneficiaryResponse,
    addBeneficiary,
    beneficiaryData,
    loading: isFetching || isLoading || addBeneficiaryLoading,
    error,
    isError,
    refetch,
  };
};

export default useBeneficiaryManagement;
