import React, { useEffect, useState } from "react";
import {
  Route,
  RouteComponentProps,
  RouteProps,
  withRouter,
} from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import "./HomePage.scss";
import { Redirect } from "react-router-dom";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  return JSON.parse(res.value);
}

interface RouterProps extends RouteComponentProps {}

const HomePage: React.FC<RouterProps> = ({}) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   async function setUserValues() {
  //     let token = await getFromStorage("ACCESS_TOKEN");
  //     if (token != "") await setIsAuthenticated(true);
  //     else setIsAuthenticated(false);
  //   }
  //   setUserValues();
  // }, []);

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
      {/* {isAuthenticated ? ( */}
      <IonContent>
        <div className="homepage-logo">
          <img src="assets/img/appicon.svg" alt="Giftree logo" />
        </div>
        <IonRow className="homepage-content ion-text-center">
          <p>
            Your holiday app for family, friends, and coworkers to share
            wishlists & gift ideas.
          </p>
        </IonRow>
      </IonContent>
      {/* ) : (
        <IonContent>
          <div className="homepage-logo">
            <img src="assets/img/appicon.svg" alt="Giftree logo" />
          </div>
          <IonRow className="homepage-content ion-text-center">
            <p>
              Your holiday app for family, friends, and coworkers to share
              wishlists & gift ideas.
            </p>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => {
                  return <Redirect to={"/login"} />;
                }}
                expand="block"
              >
                Log In
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={() => {
                  return <Redirect to={"/signup"} />;
                }}
                expand="block"
              >
                Sign Up
              </IonButton>
            </IonCol>
          </IonRow>
        </IonContent>
      )} */}
    </IonPage>
  );
};

export default withRouter(HomePage);
