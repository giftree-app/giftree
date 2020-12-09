import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
} from "@ionic/react";
import "./Login.scss";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const putInStorage = async (key: string, value: any) => {
  await Storage.set({
    key: key,
    value: value,
  });
};

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      const res = await Storage.get({ key: "ACCESS_TOKEN" });
      if (res.value != null) setIsAuthorized(true);
    }
    checkAuthentication();
  }, [isAuthorized]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    setFormSubmitted(true);

    if (username && password) {
      axios
        .post("api/login", {
          login: username,
          password: password,
        })
        .then(async (res) => {
          await putInStorage("ACCESS_TOKEN", res.data.accessToken);
          await putInStorage("userId", res.data.userId);
          await putInStorage("firstName", res.data.firstName);
          await putInStorage("lastName", res.data.lastName);
          await putInStorage("username", username);
          setIsAuthorized(true);
        })
        .catch(function (error) {
          setLoginError(true);
          console.log(error);
        });
    }
  };

  if (isAuthorized) {
    return <Redirect push to={"/tabs/home"} />;
  }

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <img
              src="assets/img/appicon.svg"
              className="toolbar-logo"
              alt="Giftree logo"
            />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="login-logo">
          <img src="assets/img/appicon.svg" alt="Giftree logo" />
        </div>
        <IonLabel>
          <h1 className="header">LOG IN</h1>
        </IonLabel>

        <form noValidate onSubmit={login}>
          <IonList>
            <IonItem>
              <IonInput
                name="username"
                type="text"
                placeholder="USERNAME"
                value={username}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => {
                  setUsername(e.detail.value!);
                  setUsernameError(false);
                }}
                required
              ></IonInput>
            </IonItem>

            {formSubmitted && usernameError && (
              <IonItem lines="none">
                <IonText color="danger">
                  <p className="ion-padding-start">Username is required</p>
                </IonText>
              </IonItem>
            )}

            <IonItem className="passfield">
              <IonInput
                name="password"
                type="password"
                placeholder="PASSWORD"
                value={password}
                onIonChange={(e) => {
                  setPassword(e.detail.value!);
                  setPasswordError(false);
                }}
              ></IonInput>
            </IonItem>
          </IonList>

          {formSubmitted && passwordError && (
            <IonItem lines="none">
              <IonText color="danger">
                <p className="ion-padding-start">Password is required</p>
              </IonText>
            </IonItem>
          )}

          {formSubmitted && loginError && (
            <IonItem lines="none">
              <IonText color="danger">
                <p className="ion-padding-start">
                  Login error, please try again.
                </p>
              </IonText>
            </IonItem>
          )}

          <div className="reset" style={{ paddingTop: "50px" }}>
            <a href="/" className="resetText">
              Don't have an account? <b>Click here to sign up.</b>{" "}
            </a>
          </div>
          <div className="reset">
            <a href="/" className="resetText">
              Forgot password? <b>Click here to reset.</b>{" "}
            </a>
          </div>

          <IonButton type="submit" expand="block" className="loginbtn">
            Go!
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
