import React, { useEffect } from "react";
import { RouteProps } from "react-router-dom";
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
import { setReload } from "../data/user/user.actions";

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

  useEffect(() => {
    setReload(true);
  },[]);

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
              <h2>{username}</h2>
            </div>
          )}
          userId:
          {userId && (
            <div className="ion-padding-top ion-text-center">
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
