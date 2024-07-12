import { TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import FileViewer from 'react-native-file-viewer';
import useSafeStore from '../../../store/useSafeStore';
import { useMutation } from '@tanstack/react-query';
import { downloadFilesApi } from '../../../services/filesApi';
import { useEffect, useState } from 'react';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';

const useDownloadFiles = () => {
  const [errorDownload, setErrorDownload] = useState<string | undefined>();
  const { safeId } = useSafeStore();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  useEffect(() => {}, []);

  const { mutate: mutateDownload, isPending: isPendingDownload } = useMutation({
    mutationFn: downloadFilesApi,
    onSuccess: async (result) => {
      setErrorDownload(undefined);
      try {
        if (result.mimetype.startsWith('audio/')) {
          navigation.navigate('AudioRecord', {
            fileName: result.fileName,
            title: result.fileName,
            localFilePath: result.localFilePath,
            mode: 'audio',
          });
          return;
        }
        await FileViewer.open(result.localFilePath, { showAppsSuggestions: true });
      } catch (error: any) {
        setErrorDownload('File could not be open');
      }
    },
    onError: (err) => {
      setErrorDownload(err.message);
    },
  });

  const renderFileItem = ({ item, fileInfo }: { item: TFileInfo; fileInfo: JSX.Element }) => (
    <TouchableOpacity
      onPress={() => {
        setErrorDownload(undefined);
        if (item.mimetype === 'text/pass') {
          navigation.navigate('SavePassword', { fileId: item._id });
          return;
        }
        if (item.mimetype === 'text/editor') {
          navigation.navigate('TextEditor', { fileId: item._id });
          return;
        }
        mutateDownload({
          fileName: item.fileName,
          fileId: item._id,
          safeId: safeId as string,
          mimetype: item.mimetype,
        });
      }}>
      {fileInfo}
    </TouchableOpacity>
  );

  return { renderFileItem, isPendingDownload, errorDownload };
};

export default useDownloadFiles;
