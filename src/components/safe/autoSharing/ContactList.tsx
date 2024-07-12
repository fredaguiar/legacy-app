import { FlatList, TouchableOpacity, View } from 'react-native';
import { Text, makeStyles, useTheme, ListItem } from '@rneui/themed';

const ContactInfo = ({
  contact,
  onCheckChange,
  isChecked = false,
  edit,
}: {
  contact: TContactInfo;
  onCheckChange?: (contact: TContactInfo) => void;
  isChecked?: boolean;
  edit: boolean;
}) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  return (
    <View
      style={{
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: colors.divider1,
        backgroundColor: isChecked ? colors.background2 : colors.background,
        padding: 5,
      }}>
      <View style={{ width: '90%' }}>
        <Text style={styles.fileInfo}>{contact.name}</Text>
        <Text style={styles.fileInfo}>{contact.contact}</Text>
      </View>
      {edit && (
        <ListItem.CheckBox
          checked={isChecked}
          onPress={() => {
            contact.checked = !isChecked;
            if (onCheckChange) onCheckChange(contact);
          }}
        />
      )}
    </View>
  );
};

const ContactList = ({
  contactList,
  type,
  edit,
  handleCheckChange,
  checkedItems,
}: {
  contactList: TContactInfo[];
  type: TContactInfoType;
  edit: boolean;
  handleCheckChange?: (contact: TContactInfo) => void;
  checkedItems?: any;
}) => {
  const {
    theme: { colors },
  } = useTheme();

  console.log('checkedItems', checkedItems);

  const renderItem = ({ item }: { item: TContactInfo }) => (
    <TouchableOpacity onPress={() => {}}>
      <ContactInfo
        contact={item}
        onCheckChange={handleCheckChange}
        isChecked={
          edit && checkedItems[item._id || ''] ? checkedItems[item._id || ''].checked : false
        }
        edit={edit}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.divider1,
        width: '100%',
      }}>
      {!contactList || contactList.length === 0 ? (
        <Text>No {type} added</Text>
      ) : (
        <FlatList
          data={contactList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || ''}
        />
      )}
    </View>
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  fileInfo: {
    fontSize: 20,
    color: theme.colors.text1,
  },
}));

export default ContactList;
