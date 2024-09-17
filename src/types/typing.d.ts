type TUploadFiles = {
  name: string;
  type: string;
  uri: string;
  safeId: string;
  fileId?: string;
};

type TFileType = 'photo' | 'video' | 'audio' | 'text' | 'file' | 'password';
type TFileTypeValues = { label: string; iconName: string };

type TSafe = {
  _id?: string;
  name?: string;
  description?: string;
  autoSharing?: boolean;
  searchMatch?: string;
  searchValue?: string;
  emails?: TContactInfo[];
  phones?: TContactInfo[];
  files?: TFileInfo[];
};

type TSafeUpdate = TSafe & {
  fieldToUpdate: 'name' | 'description' | 'autoSharing';
};

type TSafeIdList = {
  safeIdList: Array<string>;
};

type TGetSafe = {
  safeId: string;
};

type TUser = {
  firstName: string;
  lastName: string;
  language: string;
  country: string;
  timezone: string;
  email: string;
  phoneCountry: string;
  phone: string;
  password?: string;
  token: string;
  type: 'auth' | 'google';
  emailVerified: boolean;
  mobileVerified: boolean;
  introductionViewed?: boolean;
  storageQuotaInMB?: number;
  lifeCheck: {
    active?: boolean;
    shareTime?: string;
    shareWeekdays?: Array<TWeekdays>;
    shareCount?: number;
    shareCountType?: TShareCountType;
    shareCountNotAnswered?: number;
    notConfiguredYet?: boolean;
  };
  safes: TSafe[];
};

type TUserProfile = Omit<TUser, 'password' | 'token' | 'safes'>;

type TSignUp = Omit<TUser, 'type' | 'token' | 'emailVerified' | 'mobileVerified'>;

type TCredentials = Pick<TUser, 'email' | 'password'>;

type TShareCountType = 'week' | 'days';

type TUserUpdate = {
  firstName?: string;
  lastName?: string;
  language?: string;
  country?: string;
  timezone?: string;
  email?: string;
  phoneCountry?: string;
  phone?: string;
  type?: 'auth' | 'google';
  emailVerified?: boolean;
  mobileVerified?: boolean;
  introductionViewed?: boolean;
  storageQuotaInMB?: number;
  // lifeCheck: {
  //   active?: boolean;
  //   shareTime?: string;
  //   shareWeekdays?: Array<string>;
  //   shareCount?: number;
  //   shareCountType?: TShareCountType;
  //   shareCountNotAnswered?: number;
  // };
  fieldsToUpdate: TUserFieldsToUpdate[];
};

// type TUserProfileUpdate = Pick<
//   TUser,
//   'firstName' | 'lastName' | 'language' | 'country' | 'email' | 'phoneCountry' | 'phone'
// >;

type TUserLifeCheckUpdate = Pick<TUser, 'lifeCheck'>;

type TUserFieldsToUpdate =
  | 'firstName'
  | 'lastName'
  | 'language'
  | 'country'
  | 'timezone'
  | 'email'
  | 'phoneCountry'
  | 'phone'
  | 'type: '
  | 'emailVerified'
  | 'mobileVerified'
  | 'introductionViewed'
  | 'storageQuotaInMB'
  | 'lifeCheck.active'
  | 'lifeCheck.shareTime'
  | 'lifeCheck.shareWeekdays'
  | 'lifeCheck.shareCount'
  | 'lifeCheck.shareCountType'
  | 'lifeCheck.shareCountNotAnswered'
  | 'lifeCheck.notConfiguredYet';

type TUploadFilesResult = {
  name: string;
  type: string;
};

type TDownloadFiles = {
  safeId: string;
  fileId: string;
  fileName: string;
  mimetype: string;
};

type TDownloadFilesResult = {
  name: string;
};

type TFileInfo = {
  _id: string;
  fileName: string;
  length: number;
  uploadDate: Date;
  mimetype: string;
  searchMatch?: string;
  searchValue?: string;
  checked?: boolean;
};

type TFileUpdate = {
  fileName?: string;
  fileId: string;
  safeId: string;
};

type TFileDelete = {
  fileIds: Array<string>;
  safeId: string;
};

type TFileInfoList = {
  safeId: string;
};

type TFileInfoListResult = {
  fileInfoList: Array<TFileInfo>;
};

type TText = {
  title: string;
  text: string;
  fileId?: string;
};

type TTextTitle = {
  fileId: string;
  title: string;
  safeId: string;
};

type TAutoSharing = {
  autoSharing: boolean;
  safeId: string;
};

type TItem = {
  fileName: string;
  mimetype: string;
  username?: string;
  password?: string;
  notes?: string;
  safeId: string;
  fileId?: string;
};

type TGetPassword = {
  fileId: string;
  safeId: string;
};

type StorageInfo = {
  storageUsedInBytes: number;
  storageFileCount: number;
  storageQuotaInMB: number;
};

type TContactInfo = {
  _id?: string;
  name?: string;
  contact?: string;
  checked?: boolean;
  type?: TContactInfoType;
};

type TContactUpdate = {
  safeId: string;
  contactList: TContactInfo[];
  deleteContactList: string[];
  contactType: 'emails' | 'phones';
};

type TContactInfoType = 'email' | 'phone';

type TWeekdays = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

type TTimezone = { label: string; value: string };
type TCountryTimezones = { [key: string]: TTimezone[] };

type TPageLoadType = 'list' | 'dropdown' | 'none';

type TForgotPassword = {
  method?: 'email' | 'sms';
  email?: string;
  phone?: string;
  phoneCountry?: string;
  code?: number;
  password?: string;
};

type TForgotPasswordToken = {
  token: string;
};
