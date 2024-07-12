import { AxiosResponse } from 'axios';
import axiosInstance, { headerFormData, headerJson } from './axiosInstance';

export const createSafeApi = async (name: string): Promise<TSafe> => {
  const response = await axiosInstance.post<TSafe, AxiosResponse<TSafe>, { name: string }>(
    'private/createSafe',
    { name },
    { headers: headerJson },
  );
  return response.data;
};

export const getSafeApi = async ({ safeId }: TGetSafe): Promise<TSafe> => {
  const response = await axiosInstance.get<TGetSafe, AxiosResponse<TSafe>, TGetSafe>(
    `private/getSafe/${safeId}`,
    { headers: headerJson },
  );
  return response.data;
};

export const updateSafeApi = async ({
  fieldToUpdate,
  name,
  _id,
  description,
  autoSharing,
  emails,
  phones,
}: TSafeUpdate): Promise<TSafeUpdate> => {
  const response = await axiosInstance.post<TSafeUpdate, AxiosResponse<TSafe>, TSafeUpdate>(
    'private/updateSafe',
    { fieldToUpdate, name, _id, description, autoSharing, emails, phones },
    { headers: headerJson },
  );
  return { ...response.data, fieldToUpdate };
};

export const updateContactsApi = async ({
  contactType,
  safeId,
  contactList,
  deleteContactList,
}: TContactUpdate): Promise<boolean> => {
  const response = await axiosInstance.post<TContactUpdate, AxiosResponse<boolean>, TContactUpdate>(
    'private/updateContacts',
    { contactType, safeId, contactList, deleteContactList },
    { headers: headerJson },
  );
  return response.data;
};

export const deleteSafeListApi = async ({ safeIdList }: TSafeIdList): Promise<TSafeIdList> => {
  const response = await axiosInstance.post<TSafeIdList, AxiosResponse<TSafeIdList>, TSafeIdList>(
    'private/deleteSafeList',
    { safeIdList },
    { headers: headerJson },
  );
  return response.data;
};

export const saveTextTitleApi = async ({ title, safeId, fileId }: TTextTitle): Promise<boolean> => {
  console.log('saveTextTitleApi', safeId, fileId, title);

  const response = await axiosInstance.post<TTextTitle, AxiosResponse<boolean>, TTextTitle>(
    'private/saveTextTitle',
    { title, safeId, fileId },
    { headers: headerJson },
  );
  return response.data;
};

export const saveItemApi = async ({
  fileName,
  username,
  password,
  notes,
  safeId,
  fileId,
  mimetype,
}: TItem): Promise<boolean> => {
  const response = await axiosInstance.post<TItem, AxiosResponse<boolean>, TItem>(
    'private/saveItem',
    { fileName, username, password, notes, safeId, fileId, mimetype },
    { headers: headerJson },
  );
  return response.data;
};

export const getItemApi = async ({ fileId, safeId }: TGetPassword): Promise<TItem> => {
  const response = await axiosInstance.get<TGetPassword, AxiosResponse<TItem>, TGetPassword>(
    `private/getItem/${safeId}/${fileId}`,
    { headers: headerJson },
  );

  console.log('getPasswordApi', response.data);

  return response.data;
};
