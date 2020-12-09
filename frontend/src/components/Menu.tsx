import React, { useEffect, useState } from "react";
import { RouteComponentProps, useLocation, withRouter } from "react-router";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";
import {
  calendarOutline,
  help,
  informationCircleOutline,
  logIn,
  logOut,
  listOutline,
  peopleOutline,
  person,
  personAdd,
} from "ionicons/icons";
import "./Menu.css";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const routes = {
  loggedInPages: [
    { title: "Home", path: "/tabs/home", icon: calendarOutline },
    { title: "Groups", path: "/tabs/grouplist", icon: peopleOutline },
    { title: "Wishlist", path: "/tabs/wishlist", icon: listOutline },
    { title: "Account", path: "/account", icon: person },
    { title: "Logout", path: "/logout", icon: logOut },
  ],
  loggedOutPages: [
    { title: "Home", path: "/tabs/home", icon: calendarOutline },
    { title: "Login", path: "/login", icon: logIn },
    { title: "Signup", path: "/signup", icon: personAdd },
    { title: "About", path: "/tabs/about", icon: informationCircleOutline },
  ],
};

interface Pages {
  title: string;
  path: string;
  icon: string;
  routerDirection?: string;
}

interface MenuProps extends RouteComponentProps {}

const Menu: React.FC<MenuProps> = ({}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      const res = await Storage.get({ key: "userId" });
      if (res.value != null) setIsAuthenticated(true);
    }
    checkAuthentication();
  }, []);

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

export default withRouter(Menu);
