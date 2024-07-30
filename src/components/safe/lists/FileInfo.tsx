import { StyleProp, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Text, makeStyles, CheckBox } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { FileTypeUtil } from '../../../utils/FileTypeUtil';
import HighlightedTextUI from '../../ui/SelectTextUI';

const formatBytes = (bytes: number) => {
  //  GridFS length is stored in bytes
  if (bytes < 1024) return '1 KB';
  return `${(bytes / 1024).toFixed(2)} KB`;
};

const formatDate = (date: Date) => {
  return moment().format('MMMM DD, YYYY h:mm a');
};

const FileInfo = ({
  fileInfo,
  style,
  edit,
  onCheckFile,
}: // isChecked = false,
{
  fileInfo: TFileInfo;
  style?: StyleProp<ViewStyle>;
  onCheckFile?: (fileInfo: TFileInfo) => void;
  // isChecked?: boolean;
  edit: boolean;
}) => {
  const styles = useStyles();

  return (
    <View style={[{}, style]}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        <MaterialCommunityIcons
          name={FileTypeUtil.getFileTypeIcon(fileInfo.mimetype)}
          size={50}
          style={{ marginHorizontal: 4 }}
        />
        <View>
          <Text style={{ width: 300 }}>{fileInfo.fileName}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={[styles.fontStyles, { marginEnd: 20 }]}>
              {formatBytes(fileInfo.length)}
            </Text>
            <Text style={[styles.fontStyles, { marginEnd: 12 }]}>
              {FileTypeUtil.getFileTypeSimple(fileInfo.mimetype)}
            </Text>
          </View>
          <Text style={[styles.fontStyles, { marginEnd: 12 }]}>
            {formatDate(fileInfo.uploadDate)}
          </Text>
        </View>
        <View>
          {edit && (
            <CheckBox
              containerStyle={{ marginLeft: 5 }}
              checked={fileInfo.checked || false}
              onPress={() => {
                // fileInfo.checked = !isChecked;
                console.log(' FILEID', fileInfo._id);
                if (onCheckFile) onCheckFile(fileInfo);
              }}
            />
          )}
        </View>
      </View>
      {fileInfo.searchMatch && fileInfo.searchValue && (
        <View style={{ marginLeft: 10 }}>
          <HighlightedTextUI
            text={fileInfo.searchMatch}
            highlightedText={fileInfo.searchValue}
            style={styles.fontStyles}
            highlightedTextStyle={[styles.fontStyles, { color: 'red' }]}
          />
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  fontStyles: {
    fontSize: 16,
    color: theme.colors.text2,
  },
}));

export default FileInfo;
