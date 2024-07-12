import { FlatList, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@rneui/themed';
import useSafeStore from '../../../store/useSafeStore';
import useDownloadFiles from './useDownloadFiles';
import { getFileInfoListApi } from '../../../services/filesApi';
import SpinnerUI from '../../ui/SpinnerUI';
import ErrorMessageUI from '../../ui/ErrorMessageUI';
import FileInfo from './FileInfo';

const FileList = () => {
  const { safeId } = useSafeStore();
  const { renderFileItem, errorDownload, isPendingDownload } = useDownloadFiles();
  const {
    theme: { colors },
  } = useTheme();

  const {
    data,
    isPending: isPendingList,
    isError: isErrorList,
    error: errorList,
  } = useQuery({
    queryKey: ['files'],
    queryFn: () => getFileInfoListApi(safeId as string),
  });

  if (isPendingList || isPendingDownload) return <SpinnerUI />;

  return (
    <View>
      <ErrorMessageUI display={errorDownload} message={errorDownload} />
      <ErrorMessageUI display={isErrorList} message={errorList?.message} />

      <FlatList
        data={data?.fileInfoList}
        renderItem={({ item }) =>
          renderFileItem({
            item,
            fileInfo: (
              <FileInfo fileInfo={item} style={{ borderWidth: 1, borderColor: colors.divider1 }} />
            ),
          })
        }
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default FileList;
