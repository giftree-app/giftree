import React from "react";
import { Route, Switch } from "react-router-dom";
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
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App: React.FC = () => {
  return 0 ? (
    <div></div>
  ) : (
    <IonApp className="">
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonRouterOutlet id="main">
            <Switch>
              <Route path="/tabs" render={() => <MainTabs />} />
              <Route path="/account" component={Account} />
              <Route path="/" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/logout"></Route>
              <Route path="/login" component={Login} />
            </Switch>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
