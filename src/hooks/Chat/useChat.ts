import { useGetAllChatsQuery } from '@/services';
import { useAppSelector } from '@/store';

interface IParams {
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

const useChat = (params: IParams) => {
  const { loggedIn } = useAppSelector((state) => state.auth);

  const {
    data: chatData,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetAllChatsQuery(params, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    chatData,
    loading: isFetching || isLoading,
    error,
    isError,
    refetch,
  };
};

export default useChat;
