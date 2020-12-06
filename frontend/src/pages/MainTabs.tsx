import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router";
import { calendar, location, informationCircle, people } from "ionicons/icons";
import HomePage from "./HomePage";
import GroupList from "./GroupList";
import AddGroup from "./AddGroup";
import EditGroup from "./EditGroup";
import Wishlist from "./WishlistPage";
import About from "./About";
import AddGift from "./AddGift";
import EditGift from "./EditGift";
import JoinGroup from "./JoinGroup";

interface MainTabsProps {}

const MainTabs: React.FC<MainTabsProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/tabs/home" />
        {/*
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
        <Route path="/tabs/home" render={() => <HomePage />} exact={true} />
        <Route
          path="/tabs/grouplist"
          render={() => <GroupList />}
          exact={true}
        />
        <Route path="/tabs/addgroup" render={() => <AddGroup />} exact={true} />
        <Route
          path="/tabs/editgroup"
          render={() => <EditGroup />}
          exact={true}
        />
        <Route
          path="/tabs/joingroup"
          render={() => <JoinGroup />}
          exact={true}
        />
        <Route path="/tabs/wishlist" render={() => <Wishlist />} exact={true} />
        <Route path="/tabs/about" render={() => <About />} exact={true} />
        <Route path="/tabs/addgift" render={() => <AddGift />} exact={true} />
        <Route path="/tabs/editgift" render={() => <EditGift />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={calendar} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="groups" href="/tabs/grouplist">
          <IonIcon icon={people} />
          <IonLabel>Groups</IonLabel>
        </IonTabButton>
        <IonTabButton tab="wishlist" href="/tabs/wishlist">
          <IonIcon icon={location} />
          <IonLabel>Wishlist</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href="/tabs/about">
          <IonIcon icon={informationCircle} />
          <IonLabel>About</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
