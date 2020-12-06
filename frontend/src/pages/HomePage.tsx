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
} from "@ionic/react";
import { connect } from "../data/connect";

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
