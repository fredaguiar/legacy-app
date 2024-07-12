import { useEffect, useState } from 'react';
import moment from 'moment';
import { CameraOptions, MediaType, launchCamera } from 'react-native-image-picker';
import { useMutation } from '@tanstack/react-query';
import { uploadFilesApi } from '../services/filesApi';
import useSafeStore from '../store/useSafeStore';
import { FileTypeUtil } from '../utils/FileTypeUtil';

const useCamera = () => {
  const [error, setError] = useState<string | undefined>();
  const [cameraData, setCameraData] = useState<TUploadFilesResult>();
  const { safeId } = useSafeStore();

  useEffect(() => {
    setError(undefined);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFilesApi,
    onSuccess: (result: TUploadFilesResult) => {
      setError(undefined);
      setCameraData(result);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const launchCameraDevice = async (mediaType: MediaType) => {
    try {
      let media = undefined;

      if (mediaType === 'photo') {
        const options: CameraOptions = {
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        };
        media = await launchCamera(options);
      }

      if (mediaType === 'video') {
        const options: CameraOptions = {
          mediaType: 'video',
          cameraType: 'back',
        };
        media = await launchCamera(options);
      }

      if (!media) {
        setError('No camera type has been defined');
        return;
      }

      if (media.errorMessage) {
        setError(media.errorMessage);
        return;
      }
      if (!media || !media.assets || media.didCancel) {
        console.log('media.assets media.didCancel', media.assets?.length, media.didCancel);
        setError('Camera canceled');
        return;
      }
      const asset = media.assets[0];

      const split = asset.fileName?.split('.') || [];
      const now = moment().format('MMMM-DD-YYYY-h:mm:ssa');
      const name = `${FileTypeUtil.getFileType(asset.type)}-${now}.${split[split.length - 1]}`;

      mutate({
        name,
        type: asset.type || '',
        uri: asset.uri || '',
        safeId: safeId as string,
      });

      setError(undefined);
    } catch (err: any) {
      console.error('CAMERA ERROR', err);
      setError(err.message);
    }
  };

  return { launchCameraDevice, cameraData, isPendingCamera: isPending, errorCamera: error };
};

export default useCamera;
