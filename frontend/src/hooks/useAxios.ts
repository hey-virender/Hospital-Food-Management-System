import { useMemo } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';




const useAxios = (): AxiosInstance => {
  const dispatch = useDispatch();
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: 'https://hospital-food-management-system-qs9c.onrender.com/',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable sending cookies
    });

    // You can add interceptors here if needed
    instance.interceptors.request.use(
      (config) => {
        // Modify request config here if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        // Handle response data here if needed
        return response;
      },
      (error) => {
        if (error.response.status === 403 || error.response.status === 401) {
          dispatch(logout());
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [dispatch]);

  return axiosInstance;
};

export default useAxios;
