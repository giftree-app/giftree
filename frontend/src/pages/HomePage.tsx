import React, { useEffect } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { connect } from "../data/connect";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

interface StateProps {
  username?: string;
  userId?: string;
}

interface HomePageProps extends StateProps, RouteProps {}

const HomePage: React.FC<HomePageProps> = ({ username, userId, ...rest }) => {
  //console.log('homepage entry: reload = ' + reload);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (Storage.get({ key: "_cap_ACCESS_TOKEN" }) != null) {
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
              <IonContent>
                username:
                {username && (
                  <div className="ion-padding-top ion-text-center">
                    <img
                      src="https://www.gravatar.com/avatar?d=mm&s=140"
                      alt="avatar"
                    />
                    <h2>{username}</h2>
                  </div>
                )}
                userId:
                {userId && (
                  <div className="ion-padding-top ion-text-center">
                    <img
                      src="https://www.gravatar.com/avatar?d=mm&s=140"
                      alt="avatar"
                    />
                    <h2>{userId}</h2>
                  </div>
                )}
              </IonContent>
            </IonPage>
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
  }),
  component: HomePage,
});
