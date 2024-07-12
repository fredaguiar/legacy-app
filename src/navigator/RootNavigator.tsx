import useUserStore from '../store/useUserStore';
import MenuDrawer from './MenuDrawer';
import PublicStack from './PublicStack';

const RootNavigator = () => {
  const { user } = useUserStore();
  if (!user) {
    return <PublicStack />;
  }

  return <MenuDrawer />;
};

export default RootNavigator;
