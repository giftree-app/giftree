import React, { useEffect, useContext } from 'react';
import { IonRouterContext } from '@ionic/react';

interface RedirectToLoginProps {
  setIsLoggedIn: Function;
  setUsername: Function;
  setUserId: Function;
  setGroupId: Function;
  setReload: Function;
}

const RedirectToLogin: React.FC<RedirectToLoginProps> = ({ setIsLoggedIn, setUsername, setUserId, setGroupId, setReload }) => {
  const ionRouterContext = useContext(IonRouterContext);
  useEffect(() => {
    setIsLoggedIn(false);
    setUsername(undefined);
    setUserId(undefined);
    setGroupId(undefined);
    setReload(false);
    ionRouterContext.push('/login')
  }, [setIsLoggedIn, setUsername, setUserId, setGroupId, setReload, ionRouterContext]);
  return null;
};

export default RedirectToLogin;
