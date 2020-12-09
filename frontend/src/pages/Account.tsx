import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonAlert,
} from "@ionic/react";
import "./Account.scss";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  else return res.value;
}

async function getUserValues() {
  let firstName = await getFromStorage("ACCESS_TOKEN");
  let lastName = await getFromStorage("firstName");
  let email = await getFromStorage("lastName");
  let userId = await getFromStorage("userId");
  let username = await getFromStorage("userId");

  let ret = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    userId: userId,
    username: username,
  };

  return ret;
}

interface RouterProps extends RouteComponentProps {}

const Account: React.FC<RouterProps> = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function setUserValues() {
      let token = await getFromStorage("ACCESS_TOKEN");
      if (token != "") {
        let values = await getUserValues();

        await setUserId(values.userId);
        await setUsername(values.username);
        await setFirstName(values.firstName);
        await setLastName(values.lastName);
        await setEmail(values.email);

        await setIsAuthenticated(true);
      } else setIsAuthenticated(false);
    }
    setUserValues();
  }, []);

  function clearValues() {
    setUserId("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmail("");
  }

  if (!isAuthenticated) {
    return <Redirect to={"/login"} />;
  }

  return (
    <IonPage id="account-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>
            <img src="assets/img/appicon.svg" className="toolbar-logo" />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isAuthenticated && (
          <div className="ion-padding-top ion-text-center">
            <h1 style={{ paddingTop: "40px" }}>{userId}</h1>
            <IonList inset>
              <IonItem>Change Username</IonItem>
              <IonItem style={{ paddingTop: "20px" }}>Change Password</IonItem>
              <IonItem
                onClick={() => {
                  clearValues();
                  setIsAuthenticated(false);
                }}
                style={{ paddingTop: "20px" }}
              >
                Logout
              </IonItem>
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Account);
