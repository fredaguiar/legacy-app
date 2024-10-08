import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFilesApi } from '../services/filesApi';
import useSafeStore from '../store/useSafeStore';

const useUploadFiles = () => {
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<TUploadFilesResult>();
  const { safeId } = useSafeStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    setError(undefined);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFilesApi,
    onSuccess: (result: TUploadFilesResult) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setError(undefined);
      setData(result);
      // TODO: DELETE FILES!
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const uploadFiles = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true, // ???? Ensures a local URI is provided for upload
      });
      if (!document || document.canceled) {
        setError('Import canceled');
        return;
      }

      const asset = document.assets[0];
      mutate({
        name: asset.name,
        type: asset.mimeType || '',
        uri: asset.uri,
        safeId: safeId as string,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { uploadFiles, data, isPending, error };
};

export default useUploadFiles;
