import { StyleProp, View, ViewStyle } from 'react-native';
import { Text, makeStyles, useTheme } from '@rneui/themed';
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

const FileInfo = ({ fileInfo, style }: { fileInfo: TFileInfo; style?: StyleProp<ViewStyle> }) => {
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
          style={{ marginHorizontal: 4, alignSelf: 'flex-start' }}
        />
        <View>
          <Text style={{ width: 350 }}>{fileInfo.fileName}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.fontStyles}>{formatBytes(fileInfo.length)}</Text>
            <Text style={[styles.fontStyles, { marginEnd: 12 }]}>
              {FileTypeUtil.getFileTypeSimple(fileInfo.mimetype)}
            </Text>
            <Text style={[styles.fontStyles, { marginEnd: 12 }]}>
              {formatDate(fileInfo.uploadDate)}
            </Text>
          </View>
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
