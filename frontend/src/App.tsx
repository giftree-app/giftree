import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Menu from "./components/Menu";

// Fonts
// import 'src/fonts';

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import MainTabs from "./pages/MainTabs";
import { connect } from "./data/connect";
import { AppContextProvider } from "./data/AppContext";
import {
  setIsLoggedIn,
  setUsername,
  setUserId,
  setGroupId,
  setReload,
  loadUserData,
} from "./data/user/user.actions";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Support from "./pages/Support";
import RedirectToLogin from "./components/RedirectToLogin";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  darkMode: boolean;
}

interface DispatchProps {
  loadUserData: typeof loadUserData;
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
  setUserId: typeof setUserId;
  setGroupId: typeof setGroupId;
  setReload: typeof setReload;
}

interface IonicAppProps extends StateProps, DispatchProps {}

const IonicApp: React.FC<IonicAppProps> = ({
  darkMode,
  setIsLoggedIn,
  setUsername,
  setUserId,
  setGroupId,
  setReload,
  loadUserData
}) => {
  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line
  }, []);

  const removeToken = async () => {
    try {
      await Storage.remove({ key: "ACCESS_TOKEN" });
      await Storage.remove({ key: "EXPIRES_IN" });
    } catch (err) {
      console.log(err);
    }
  };

  return 0 ? (
    <div></div>
  ) : (
    <IonApp className={`${darkMode ? "dark-theme" : ""}`}>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            {/*
                We use IonRoute here to keep the tabs state intact,
                which makes transitions between tabs and non tab pages smooth
                */}
            <Route path="/tabs" render={() => <MainTabs />} />
            <Route path="/account" component={Account} />
            <Route path="/" component={Login} exact />
            <Route path="/signup" component={Signup} />
            <Route path="/support" component={Support} />
            <Route
              path="/logout"
              render={() => {
                return (
                  <RedirectToLogin
                    setIsLoggedIn={setIsLoggedIn}
                    setUsername={setUsername}
                    setUserId={setUserId}
                    setGroupId={setGroupId}
                    setReload={setReload}
                    {...removeToken()}
                  />
                );
              }}
            />
            <Route path="/login" component={Login} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
  }),
  mapDispatchToProps: {
    loadUserData,
    setIsLoggedIn,
    setUsername,
    setUserId,
    setGroupId,
    setReload
  },
  component: IonicApp,
});
