import { useGetMessagesByChatIdQuery } from '@/services';
import { useAppSelector } from '@/store';

interface IParams {
  chatId: string;
  isRead?: boolean;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

const useMessages = (params: IParams) => {
  const { loggedIn } = useAppSelector((state) => state.auth);

  const {
    data: chatByIdData,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetMessagesByChatIdQuery(params, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    chatByIdData,
    loading: isFetching || isLoading,
    error,
    isError,
    refetch,
  };
};

export default useMessages;
