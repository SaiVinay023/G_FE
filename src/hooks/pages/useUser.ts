import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser as useClerkUser } from '@clerk/nextjs';

import { User } from 'src/models';
import { AppDispatch } from 'src/store';
import { UserActions } from 'src/store/slices/userSlice';
import { selectUser, selectUserError, selectUserLoading, selectUserShopId } from 'src/store/selectors/userSelectors';
import { userApi } from 'src/api/userApi';

type UseUserContext = {
  user?: User | null;
  shopId?: string | null;
  loading: boolean;
  error: string | null;
  createUser: (userData: User) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
};

export const useUser = (): UseUserContext => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const shopId = useSelector(selectUserShopId);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useClerkUser();
  const hasFetchedRef = useRef(false);

  // Fetch user data when Clerk user is loaded
  useEffect(() => {
    if (isClerkLoaded && clerkUser && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(UserActions.fetchUserByClerkId(clerkUser.id));
    }
  }, [dispatch, isClerkLoaded, clerkUser]);

  const createUser = useCallback(
    async (userData: User): Promise<User> => {
      try {
        const result = await dispatch(userApi.endpoints.createUser.initiate(userData));

        if ('data' in result) {
          dispatch(UserActions.createUserSuccess(result.data as User));
          return result.data as User;
        }

        throw result.error;
      } catch (error: any) {
        dispatch(UserActions.createUserFailure(error.message || 'Failed to create user'));
        throw error;
      }
    },
    [dispatch],
  );

  const updateUser = useCallback(
    (id: string, userData: Partial<User>) => {
      dispatch(UserActions.updateUser({ id, data: userData }));
    },
    [dispatch],
  );

  const deleteUser = useCallback(
    (id: string) => {
      dispatch(UserActions.deleteUser(id));
    },
    [dispatch],
  );

  return { user, shopId, loading, error, createUser, updateUser, deleteUser };
};
