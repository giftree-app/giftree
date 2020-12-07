import React from "react";
import { Route, RouteProps } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
} from "@ionic/react";
import { connect } from "../data/connect";
import "./HomePage.scss";

interface StateProps {
  username?: string;
  userId?: string;
  isAuthenticated?: boolean;
}

interface HomePageProps extends StateProps, RouteProps {}

const HomePage: React.FC<HomePageProps> = ({
  username,
  userId,
  isAuthenticated,
}) => {
  //console.log('homepage entry: reload = ' + reload);

  return (
    <IonPage id="homepage">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      {isAuthenticated ? (
        <IonContent>
        <div className="homepage-logo">
          <img src="assets/img/appicon.svg" alt="Giftree logo" />
        </div>
          <IonRow className="homepage-content ion-text-center">
            <p>Your holiday app for family, friends, and coworkers to share wishlists & gift ideas.</p>
          </IonRow>
          <IonRow className="homepage-sub text-center">
            <p>Welcome back, {username}.</p>
          </IonRow>
        </IonContent>
      ) : (
        <IonContent></IonContent>
      )}
    </IonPage>
  );
};

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    isAuthenticated: state.user.isLoggedin,
  }),
  component: HomePage,
});
