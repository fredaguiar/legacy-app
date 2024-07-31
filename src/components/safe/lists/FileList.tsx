import { FlatList, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, CheckBox, makeStyles, useTheme } from '@rneui/themed';
import useSafeStore from '../../../store/useSafeStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useDownloadFiles from './useDownloadFiles';
import { deleteFileListApi, getFileInfoListApi } from '../../../services/filesApi';
import SpinnerUI from '../../ui/SpinnerUI';
import ErrorMessageUI from '../../ui/ErrorMessageUI';
import FileInfo from './FileInfo';
import RenameFileModal from './RenameFileModal';

const FileList = () => {
  const { safeId } = useSafeStore();
  const { renderFileItem, errorDownload, isPendingDownload } = useDownloadFiles();
  const queryClient = useQueryClient();
  const [checkAll, setCheckAll] = useState(false);
  const [enableEdit, setEnableEdit] = useState(true);
  const [dataFiles, setDataFiles] = useState<TFileInfoListResult>();
  const [selectedFile, setSelectedFile] = useState<TFileInfo>();
  const [enableDelete, setEnableDelete] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
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

  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: deleteFileListApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const handleCheckFile = (fileInfo: TFileInfo) => {
    const updatedDataFiles = dataFiles?.fileInfoList.map((file) => {
      if (file._id === fileInfo._id) {
        return { ...file, checked: !file.checked };
      }
      return { ...file };
    });
    setDataFiles({ fileInfoList: updatedDataFiles || [] });

    const notAllSelected = updatedDataFiles?.some((file) => file.checked === false);
    setCheckAll(!notAllSelected);
  };

  const handleCheckAll = () => {
    const updatedDataFiles = dataFiles?.fileInfoList.map((file) => {
      return { ...file, checked: !checkAll };
    });
    setDataFiles({ fileInfoList: updatedDataFiles || [] });
    setCheckAll(!checkAll);
  };

  const showEditModal = () => {
    setModalVisible(true);
  };

  const getSelectedFile = () => {
    return dataFiles?.fileInfoList.find((file) => file.checked === true);
  };

  useEffect(() => {
    if (data) {
      const updatedDataFiles = data?.fileInfoList.map((file) => {
        return { ...file, checked: false };
      });
      setDataFiles({ fileInfoList: updatedDataFiles || [] });
      setCheckAll(false);
    }
  }, [data]);

  useEffect(() => {
    const countSelected =
      dataFiles?.fileInfoList.filter((fileInfo) => {
        return fileInfo.checked === true;
      }).length || 0;
    setEnableEdit(countSelected === 1);
    setEnableDelete(countSelected > 0);
    setSelectedFile(countSelected === 1 ? getSelectedFile() : undefined);
  }, [dataFiles]);

  if (isPendingList || isPendingDownload || isPendingDelete) return <SpinnerUI />;

  // dataFiles?.fileInfoList.filter((fileInfo) => {
  //   console.log('🚀 ~ data?.fileInfoList.filter ~ fileInfo:', fileInfo.fileName, fileInfo.checked);
  // });

  return (
    <View style={{}}>
      <ErrorMessageUI display={errorDownload} message={errorDownload} />
      <ErrorMessageUI display={isErrorList} message={errorList?.message} />
      <ErrorMessageUI display={isErrorDelete} message={errorDelete?.message} />
      {dataFiles && dataFiles?.fileInfoList.length > 0 && (
        <View
          style={{
            alignItems: 'center',
            // alignSelf: 'flex-end',
            flexDirection: 'row',
            backgroundColor: colors.background1,
          }}>
          <ButtonUpdate
            title="Rename"
            iconName="lead-pencil"
            onPress={showEditModal}
            disabled={!enableEdit}
          />
          <ButtonUpdate
            title=""
            iconName="delete"
            disabled={!enableDelete}
            onPress={() => {
              const fileIds =
                dataFiles?.fileInfoList
                  .filter((fileInfo) => {
                    return fileInfo.checked === true;
                  })
                  .map((file) => file._id) || [];
              mutateDelete({ safeId: safeId || '', fileIds });
            }}
          />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <CheckBox
              style={{}}
              containerStyle={{ marginRight: 15, padding: 0 }}
              checked={checkAll}
              onPress={handleCheckAll}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="red"
            />
          </View>
        </View>
      )}
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEnabled={true}
        data={dataFiles?.fileInfoList}
        renderItem={({ item }) =>
          renderFileItem({
            item,
            fileInfo: (
              <FileInfo
                edit={true}
                fileInfo={item}
                onCheckFile={handleCheckFile}
                // isChecked={
                //   checkedFiles[item._id || ''] ? checkedFiles[item._id || ''].checked : false
                // }
                style={{ borderWidth: 1, borderColor: colors.divider1 }}
              />
            ),
          })
        }
        keyExtractor={(item) => item._id}
      />
      <RenameFileModal
        safeId={safeId || ''}
        isVisible={modalVisible}
        file={selectedFile}
        onClose={() => setModalVisible(false)}
        onRenameFileSuccess={(_result: boolean) => {
          setModalVisible(false);
          queryClient.invalidateQueries({ queryKey: ['files'] });
        }}
      />
    </View>
  );
};

const ButtonUpdate = ({
  onPress,
  title,
  iconName,
  style,
  containerStyle,
  disabled,
}: {
  onPress: () => void;
  title: string;
  iconName: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) => (
  <Button
    onPress={onPress}
    disabled={disabled}
    title={title}
    color="primary"
    style={style}
    containerStyle={[{ margin: 5, width: 'auto' }, containerStyle]}
    radius="5"
    icon={
      <MaterialCommunityIcons
        name={iconName}
        size={30}
        disabled={disabled}
        color={disabled ? 'gray' : 'black'}
      />
    }
    iconPosition="left"
    titleStyle={{
      color: 'black',
      fontWeight: 'normal',
    }}
  />
);

const useStyles = makeStyles((theme, props: {}) => ({
  buttonsContainer: {
    // flex: 1,
  },
}));

export default FileList;
