import { Text } from '@rneui/themed';

const getSafe = (user?: TUser | null, safeId?: string | null) => {
  if (!user || !safeId) return null;
  return user?.safes.filter((curr) => safeId === curr._id)[0];
};

type SetSafeIdProps = {
  safeId: string | null;
  user: TUser | undefined;
};

const getSafeId = ({ safeId, user }: SetSafeIdProps) => {
  if (safeId) {
    return safeId;
  }
  if (user?.safes && user?.safes.length > 0) {
    return user.safes[0]._id;
  }
};

const SafeUtil = {
  getSafe,
  getSafeId,
};

export { SafeUtil };
