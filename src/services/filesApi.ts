import { AxiosResponse } from 'axios';
import RNFS from 'react-native-fs';
import axiosInstance, { headerFormData, headerJson } from './axiosInstance';
import AuthUtil from '../utils/AuthUtil';

export const uploadFilesApi = async ({
  name,
  type,
  uri,
  safeId,
  fileId,
}: TUploadFiles): Promise<TUploadFilesResult> => {
  const formData = new FormData();
  formData.append('file', { uri, name, type } as any);
  formData.append('safeId', safeId);
  formData.append('fileId', fileId || '');

  console.log('uploadFilesApi >>>>', formData);

  let json = { name: 'ddddd', type: 'buceta' };

  try {
    const response = await axiosInstance.post<
      FormData,
      AxiosResponse<TUploadFilesResult>,
      FormData
    >('private/uploadFiles', formData, { headers: headerFormData });

    json = response.data;
  } catch (error) {
    console.log('uploadFilesApi >>>>', error);
  }

  // console.log('uploadFilesApi >>>>', response.data);

  return json;
};

export const getFileInfoListApi = async (safeId: string): Promise<TFileInfoListResult> => {
  const response = await axiosInstance.get<
    TFileInfoList,
    AxiosResponse<TFileInfoListResult>,
    TFileInfoList
  >(`private/fileInfoList/${safeId}`, { headers: headerJson });

  return response.data;
};

export const downloadFilesApi = async ({
  safeId,
  fileId,
  fileName,
  mimetype,
}: TDownloadFiles): Promise<TDownloadFiles & { localFilePath: string }> => {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_SERVER_URI}/private/downloadFiles/${safeId}/${fileId}`;
    const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const bearerToken = await AuthUtil.getBearerToken();

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localFilePath,
      background: true,
      headers: { Authorization: bearerToken },
      begin: (res: any) => {
        console.log('Download has begun with jobId: ', res.jobId);
      },
      progress: (res: any) => {
        let progressPercent = (res.bytesWritten / res.contentLength) * 100;
        console.log('Download Progress: ', progressPercent.toFixed(2) + '%');
      },
    }).promise;

    if (result.statusCode !== 200) {
      throw new Error('File could not be downloaded');
    }

    return { safeId, fileName, fileId, mimetype, localFilePath };
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const searchApi = async ({
  searchValue,
  safeId,
}: {
  searchValue: string;
  safeId?: string;
}): Promise<TSafe[]> => {
  const path = safeId ? `private/search/${safeId}/${searchValue}` : `private/search/${searchValue}`;

  const response = await axiosInstance.get<string, AxiosResponse<TSafe[]>, string>(path, {
    headers: headerJson,
  });

  return response.data;
};

export const renameFileApi = async ({
  fileName,
  safeId,
  fileId,
}: TFileUpdate): Promise<boolean> => {
  const response = await axiosInstance.post<TFileUpdate, AxiosResponse<boolean>, TFileUpdate>(
    'private/renameFile',
    {
      fileName,
      safeId,
      fileId,
    },
    { headers: headerJson },
  );
  return response.data;
};

export const deleteFileListApi = async (files: TFileDelete): Promise<boolean> => {
  const response = await axiosInstance.post<TFileDelete, AxiosResponse<boolean>, TFileDelete>(
    'private/deleteFileList',
    files,
    { headers: headerJson },
  );
  return response.data;
};
