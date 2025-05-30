import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '@/store/slices/userSlice';

export const useAuthPersistence = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          dispatch(loginUser({
            isLoggedIn: true,
            name: userData.name,
            email: userData.email,
            uid: userData.userId.toString()
          }));
        } else {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch(logoutUser());
      }
    };

    checkAuthStatus();
  }, [dispatch]);
};
