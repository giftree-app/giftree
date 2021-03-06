import React from "react";
import { RouteComponentProps, withRouter, useLocation } from "react-router";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonToggle,
} from "@ionic/react";
import {
  calendarOutline,
  moonOutline,
  help,
  informationCircleOutline,
  logIn,
  logOut,
  listOutline,
  peopleOutline,
  person,
  personAdd,
} from "ionicons/icons";

import { connect } from "../data/connect";
import { setDarkMode } from "../data/user/user.actions";

import "./Menu.css";

const routes = {
  loggedInPages: [
    { title: "Home", path: "/tabs/home", icon: calendarOutline },
    { title: "Groups", path: "/tabs/grouplist", icon: peopleOutline },
    { title: "Wishlist", path: "/tabs/wishlist", icon: listOutline },
    { title: "Account", path: "/account", icon: person },
    { title: "Support", path: "/support", icon: help },
    { title: "Logout", path: "/logout", icon: logOut },
  ],
  loggedOutPages: [
    { title: "Home", path: "/tabs/home", icon: calendarOutline },
    { title: "Login", path: "/login", icon: logIn },
    { title: "Signup", path: "/signup", icon: personAdd },
    { title: "Support", path: "/support", icon: help },
  ],
};

interface Pages {
  title: string;
  path: string;
  icon: string;
  routerDirection?: string;
}
interface StateProps {
  darkMode: boolean;
  isAuthenticated: boolean;
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode;
}

interface MenuProps extends RouteComponentProps, StateProps, DispatchProps {}

const Menu: React.FC<MenuProps> = ({
  darkMode,
  history,
  isAuthenticated,
  setDarkMode,
}) => {
  const location = useLocation();

  function renderlistItems(list: Pages[]) {
    return list
      .filter((route) => !!route.path)
      .map((p) => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem
            detail={false}
            routerLink={p.path}
            routerDirection="none"
            className={
              location.pathname.startsWith(p.path) ? "selected" : undefined
            }
          >
            <IonIcon slot="start" icon={p.icon} />
            <IonLabel>{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu type="overlay" contentId="main">
      <IonContent forceOverscroll={false}>
        <IonList lines="none">
          <IonListHeader>GIFTREE</IonListHeader>
          {isAuthenticated
            ? renderlistItems(routes.loggedInPages)
            : renderlistItems(routes.loggedOutPages)}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    isAuthenticated: state.user.isLoggedin,
  }),
  mapDispatchToProps: {
    setDarkMode,
  },
  component: withRouter(Menu),
});
