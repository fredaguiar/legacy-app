import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, makeStyles, useTheme } from '@rneui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';
import ContactList from './ContactList';
import AddContactModal from './AddContactModal';
import ConfirmModalUI from '../../ui/ConfirmModalUI';
import { getSafeApi, updateContactsApi } from '../../../services/safeApi';
import SpinnerUI from '../../ui/SpinnerUI';
import ErrorMessageUI from '../../ui/ErrorMessageUI';

const ContactListUpdate = () => {
  const {
    params: { safeId, type },
  } = useRoute<RouteProp<MenuDrawerParams, 'ContactListUpdate'>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [enableEdit, setEnableEdit] = useState(true);
  const [enableDelete, setEnableDelete] = useState(true);
  const [selectedContact, setSelectedContact] = useState<TContactInfo>();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: TContactInfo }>({});
  const queryClient = useQueryClient();
  const styles = useStyles({});
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    const countSelected = Object.values(checkedItems).filter(
      (contact) => contact.checked === true,
    ).length;
    setEnableEdit(countSelected === 1);
    setSelectedContact(countSelected === 1 ? getSelectedContact() : undefined);
    setEnableDelete(countSelected > 0);
  }, [checkedItems]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['contactList', safeId],
    queryFn: () => getSafeApi({ safeId }),
  });

  const contactList = type === 'email' ? data?.emails || [] : data?.phones || [];

  const showAddModal = () => {
    setSelectedContact(undefined);
    setModalVisible(true);
  };

  const showEditModal = () => {
    setModalVisible(true);
  };

  const showDeleteModal = () => {
    setModalDeleteVisible(true);
  };

  const handleCheckChange = (contact: TContactInfo) => {
    const id = contact._id || '';
    setCheckedItems((prev) => ({ ...prev, [id]: contact }));
  };

  const getSelectedContact = () => {
    const selectedKey = Object.keys(checkedItems).filter(
      (key) => checkedItems[key].checked === true,
    )[0];
    const contact = checkedItems[selectedKey];
    return contact;
  };

  const {
    mutate,
    isPending: isPendingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: updateContactsApi,
    onSuccess: () => {
      setModalDeleteVisible(false);
      queryClient.invalidateQueries({ queryKey: ['contactList', safeId] });
    },
  });

  const onConfirmDelete = () => {
    const contacts = Object.values(checkedItems).filter((contact) => contact.checked === true);
    mutate({
      safeId,
      contactType: 'emails',
      contactList: [],
      deleteContactList: contacts.map((contact) => contact._id || ''),
    });
  };

  if (isPending || isPendingDelete) return <SpinnerUI />;

  return (
    <View style={{ backgroundColor: colors.background1, flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <ErrorMessageUI display={isError} message={error?.message} />
        <ErrorMessageUI display={isErrorDelete} message={errorDelete?.message} />

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <ButtonAddContact
            title="Add"
            iconName={type === 'email' ? 'email-plus-outline' : 'phone-plus-outline'}
            onPress={showAddModal}
            containerStyle={styles.buttonsContainer}
          />
          <ButtonAddContact
            title="Edit"
            iconName="lead-pencil"
            onPress={showEditModal}
            disabled={!enableEdit}
            containerStyle={styles.buttonsContainer}
          />
          <ButtonAddContact
            title="Delete"
            iconName="delete"
            onPress={showDeleteModal}
            disabled={!enableDelete}
            containerStyle={styles.buttonsContainer}
          />
        </View>
        <AddContactModal
          safeId={safeId}
          isVisible={modalVisible}
          contact={selectedContact}
          onClose={() => setModalVisible(false)}
          type={type}
          onAddContactSuccess={(_result: boolean) => {
            // setContacList({ contactList: result.emails, safeId, type:'emails' });
            setModalVisible(false);
            queryClient.invalidateQueries({ queryKey: ['contactList', safeId] });
          }}
        />
        <ConfirmModalUI
          isVisible={modalDeleteVisible}
          onCancel={() => setModalDeleteVisible(false)}
          onConfirm={onConfirmDelete}
        />

        <View
          style={[{ flexDirection: 'row', marginBottom: 25, marginHorizontal: 5, height: '90%' }]}>
          <ContactList
            edit={true}
            type={type}
            contactList={contactList}
            handleCheckChange={handleCheckChange}
            checkedItems={checkedItems}
          />
        </View>
      </View>
    </View>
  );
};

const ButtonAddContact = ({
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
        style={{ marginRight: 5 }}
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
    flex: 1,
  },
}));

export default ContactListUpdate;

// const testList: TContactInfo[] = [
//   { _id: '1', name: '1', contact: '1', type: 'email' },
//   { _id: '1a', name: '1', contact: '1', type: 'email' },
//   { _id: '2', name: '1', contact: '1', type: 'email' },
//   { _id: '3', name: '1', contact: '1', type: 'email' },
//   { _id: '4', name: '1rt', contact: '1', type: 'email' },
//   { _id: '5', name: '1', contact: '1', type: 'email' },
//   { _id: '6', name: '11', contact: '1', type: 'email' },
//   { _id: '64343', name: '1', contact: '1', type: 'email' },
//   { _id: '8fadfad', name: '1', contact: '1', type: 'email' },
//   { _id: '8', name: '1d', contact: '1', type: 'email' },
//   { _id: '10', name: '1dd', contact: '1', type: 'email' },
//   { _id: '11', name: '1rtr', contact: '1', type: 'email' },
//   { _id: '1eadfadfr2', name: '1rt', contact: '1', type: 'email' },
//   { _id: '1e2dffad', name: '1rt', contact: '1', type: 'email' },
//   { _id: '1et2', name: '1rt44444', contact: '1', type: 'email' },
//   { _id: '1rtrt2', name: '1rt22', contact: '1', type: 'email' },
// ];
