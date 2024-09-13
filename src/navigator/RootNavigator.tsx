import ConfirmEmail from '../components/setup/ConfirmEmail';
import ConfirmMobile from '../components/setup/ConfirmMobile';
import Introduction from '../components/setup/Introduction';
import useUserStore from '../store/useUserStore';
import MenuDrawer from './MenuDrawer';
import PublicStack from './PublicStack';
import SetupStack from './SetupStack';

const RootNavigator = () => {
  const { user } = useUserStore();
  if (!user) {
    return <PublicStack />;
  }

  if (!user.mobileVerified) {
    return <SetupStack initialRouteName="ConfirmMobile" />;
  }

  if (!user.emailVerified) {
    return <SetupStack initialRouteName="ConfirmEmail" />;
  }

  if (!user.introductionViewed) {
    return <Introduction />;
  }

  return <MenuDrawer />;
};

export default RootNavigator;
