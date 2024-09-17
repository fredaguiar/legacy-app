import axios, { AxiosResponse } from 'axios';
import axiosInstance, { headerJson } from './axiosInstance';

export const testApi = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get('public/test');
    console.log('response test', response.data);
  } catch (err: any) {
    console.log('Test API err test', err.stack);
  }
};

export const loginApi = async (credentials: TCredentials): Promise<TUser> => {
  const response = await axiosInstance.post<TUser, AxiosResponse<TUser>, TCredentials>(
    'public/login',
    credentials,
    { headers: headerJson },
  );
  console.log('loginApi user:', response.data.firstName);

  return response.data;
};

export const signupApi = async (singup: TSignUp): Promise<TUser> => {
  const response = await axiosInstance.post<TSignUp, AxiosResponse<TUser>, TCredentials>(
    'public/signup',
    singup,
    { headers: headerJson },
  );
  return response.data;
};

export const forgotPasswordApi = async (data: TForgotPassword): Promise<boolean> => {
  const response = await axiosInstance.post<
    TForgotPassword,
    AxiosResponse<boolean>,
    TForgotPassword
  >('public/forgotPassword', data, { headers: headerJson });

  return response.data;
};

export const forgotPasswordResetCodeApi = async (
  data: TForgotPassword,
): Promise<TForgotPasswordToken> => {
  const response = await axiosInstance.post<
    TForgotPassword,
    AxiosResponse<TForgotPasswordToken>,
    TForgotPassword
  >('public/forgotPasswordResetCode', data, { headers: headerJson });

  return response.data;
};

export const forgotPasswordConfirmApi = async (data: TForgotPassword): Promise<boolean> => {
  const response = await axiosInstance.post<
    TForgotPassword,
    AxiosResponse<boolean>,
    TForgotPassword
  >('public/forgotPasswordConfirm', data, { headers: headerJson });

  return response.data;
};
