import React, { useEffect, useContext } from 'react';
import { IonRouterContext } from '@ionic/react';

interface RedirectToGroupListProps {
}

const RedirectToGroupList: React.FC<RedirectToGroupListProps> = () => {
  const ionRouterContext = useContext(IonRouterContext);
  useEffect(() => {
    ionRouterContext.push('/tabs/grouplist')
  }, [ionRouterContext]);
  return null;
};

export default RedirectToGroupList;
