import axios, { AxiosResponse } from 'axios';
import axiosInstance, { headerJson } from './axiosInstance';

export const updateUserProfileApi = async ({
  fieldsToUpdate,
  firstName,
  lastName,
  language,
  country,
  timezone,
  email,
  phoneCountry,
  phone,
  emailVerified,
  mobileVerified,
  introductionViewed,
  storageQuotaInMB,
}: TUserUpdate): Promise<TUserUpdate> => {
  const response = await axiosInstance.post<TUserUpdate, AxiosResponse<TUserUpdate>, TUserUpdate>(
    'private/updateUserProfile',
    {
      fieldsToUpdate,
      firstName,
      lastName,
      language,
      country,
      timezone,
      email,
      phoneCountry,
      phone,
      emailVerified,
      mobileVerified,
      introductionViewed,
      storageQuotaInMB,
    },
    { headers: headerJson },
  );
  return response.data;
};

export const updateLifeCheckApi = async ({
  lifeCheck: {
    active,
    shareTime,
    shareWeekdays,
    shareCount,
    shareCountType,
    shareCountNotAnswered,
  },
}: TUserLifeCheckUpdate): Promise<TUserLifeCheckUpdate> => {
  const response = await axiosInstance.post<
    TUserLifeCheckUpdate,
    AxiosResponse<TUserLifeCheckUpdate>,
    TUserLifeCheckUpdate
  >(
    'private/updateLifeCheck',
    {
      lifeCheck: {
        active,
        shareTime,
        shareWeekdays,
        shareCount,
        shareCountType,
        shareCountNotAnswered,
      },
    },
    { headers: headerJson },
  );
  return response.data;
};

export const getUserProfile = async (): Promise<TUserProfile> => {
  const response = await axiosInstance.get<undefined, AxiosResponse<TUserProfile>, undefined>(
    'private/getUserProfile',
    { headers: headerJson },
  );
  return response.data;
};

export const getStorageInfoApi = async (): Promise<StorageInfo> => {
  const response = await axiosInstance.get<undefined, AxiosResponse<StorageInfo>, undefined>(
    `private/getStorageInfo`,
  );
  return response.data;
};

export const confirmLifeCheckApi = async (): Promise<boolean> => {
  const response = await axiosInstance.post<undefined, AxiosResponse<boolean>, undefined>(
    `private/confirmLifeCheck`,
  );
  return response.data;
};

export const confirmMobileApi = async ({ code }: { code: number }): Promise<boolean> => {
  const response = await axiosInstance.post<
    { code: number },
    AxiosResponse<boolean>,
    { code: number }
  >('private/confirmMobile', { code }, { headers: headerJson });
  return response.data;
};
