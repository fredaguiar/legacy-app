import ConfirmEmail from '../components/setup/ConfirmEmail';
import ConfirmMobile from '../components/setup/ConfirmMobile';
import Introduction from '../components/setup/Introduction';
import useUserStore from '../store/useUserStore';
import MenuDrawer from './MenuDrawer';
import PublicStack from './PublicStack';

const RootNavigator = () => {
  const { user, skipEmailConfirm } = useUserStore();

  if (!user) {
    return <PublicStack />;
  }

  if (!user.mobileVerified) {
    return <ConfirmMobile />;
  }

  if (!user.emailVerified && !skipEmailConfirm) {
    return <ConfirmEmail />;
  }

  if (!user.introductionViewed) {
    return <Introduction />;
  }

  return <MenuDrawer />;
};

export default RootNavigator;
