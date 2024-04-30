import { useInfiniteQuery } from '@tanstack/react-query';
import fetchUsers from '../services/users';
import { User } from '../types';

export const useUsers = () => {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery<{
      users: User[];
      nextCursor?: number;
    }>({
      queryKey: ['users'], // Key de la informacion
      queryFn: fetchUsers, // Funcion que trae la informacion
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    //   refetchOnWindowFocus: false,
    });

  return {
    isLoading,
    isError,
    users: data?.pages?.flatMap((page) => page.users) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage,
  };
};
