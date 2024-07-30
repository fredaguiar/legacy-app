import { FlatList, StyleProp, TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
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

const FileList = () => {
  const { safeId } = useSafeStore();
  const { renderFileItem, errorDownload, isPendingDownload } = useDownloadFiles();
  const queryClient = useQueryClient();
  const [checkAll, setCheckAll] = useState(false);
  const [enableEdit, setEnableEdit] = useState(true);
  const [selectedFile, setSelectedFile] = useState<TFileInfo>();
  const [dataFiles, setDataFiles] = useState<TFileInfoListResult>();
  const [enableDelete, setEnableDelete] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useStyles({});
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

  const getSelectedFiles = () => {
    // const selectedKey = Object.keys(checkedFiles).filter(
    //   (key) => checkedFiles[key].checked === true,
    // )[0];
    // const file = checkedFiles[selectedKey];
    const file = data?.fileInfoList.filter((fileInfo) => {
      return fileInfo.checked === true;
      // checkedFilesCurrent[fileInfo._id] = fileInfo;
    });

    return file;
  };

  const showEditModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    // const countSelected = Object.values(checkedFiles).filter(
    //   (file) => file.checked === true,
    // ).length;
    console.log('🚀 ~ useEffect 1111111111111 ~ data:', data);
    if (data) {
      const updatedDataFiles = data?.fileInfoList.map((file) => {
        return { ...file, checked: false };
      });
      setDataFiles({ fileInfoList: updatedDataFiles || [] });
      setCheckAll(false);
    }
  }, [data]);

  useEffect(() => {
    console.log('🚀 ~ useEffect 2222222222222222 ~ data:');
    const countSelected =
      dataFiles?.fileInfoList.filter((fileInfo) => {
        return fileInfo.checked === true;
      }).length || 0;
    console.log('🚀 ~ useEffect ~ countSelected:', countSelected);
    setEnableEdit(countSelected === 1);
    setEnableDelete(countSelected > 0);
    // setSelectedFile(countSelected === 1 ? getSelectedFiles() : undefined);
  }, [dataFiles]);

  if (isPendingList || isPendingDownload || isPendingDelete) return <SpinnerUI />;

  // Object.values(checkedFiles).forEach((item) => {
  //   console.log('🚀 ~ FileList ~ checkedFiles:', item.fileName, item.checked);
  // });

  dataFiles?.fileInfoList.filter((fileInfo) => {
    console.log('🚀 ~ data?.fileInfoList.filter ~ fileInfo:', fileInfo.fileName, fileInfo.checked);
  });

  return (
    <View>
      <ErrorMessageUI display={errorDownload} message={errorDownload} />
      <ErrorMessageUI display={isErrorList} message={errorList?.message} />
      <View style={{ alignItems: 'center', alignSelf: 'flex-end', flexDirection: 'row' }}>
        <ButtonUpdate
          title="Rename"
          iconName="lead-pencil"
          onPress={showEditModal}
          disabled={!enableEdit}
        />
        <ButtonUpdate
          title=""
          iconName="delete"
          onPress={() => {
            // const fileIds: string[] = Object.values(checkedFiles)
            //   .filter((file) => file.checked === true)
            //   .map((file) => file._id);

            const fileIds =
              dataFiles?.fileInfoList
                .filter((fileInfo) => {
                  return fileInfo.checked === true;
                })
                .map((file) => file._id) || [];

            console.log('🚀 ~ FileList ~ fileIds:', fileIds);
            // mutateDelete({ safeId: safeId || '', fileIds });
          }}
          disabled={!enableDelete}
        />

        <CheckBox
          style={{}}
          containerStyle={{ marginRight: 15 }}
          checked={checkAll}
          onPress={handleCheckAll}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="red"
        />
      </View>
      <FlatList
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
