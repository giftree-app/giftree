import React, { useState } from "react";
import axios from "axios";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
} from "@ionic/react";
import "./Login.scss";
import {
  setIsLoggedIn,
  setUsername,
  setUserId,
  setReload,
} from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
  setUserId: typeof setUserId;
  setReload: typeof setReload;
}

interface LoginProps extends OwnProps, DispatchProps {}

const Login: React.FC<LoginProps> = ({
  setIsLoggedIn,
  history,
  setUsername: setUsernameAction,
  setUserId: setUserIdAction,
  setReload: setReloadAction,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    setFormSubmitted(true);

    !username ? setUsernameError(true) : setUsernameError(false);
    !password ? setPasswordError(true) : setPasswordError(false);

    if (username && password) {
      await setIsLoggedIn(true);
      await setUsernameAction(username);

      axios
        .post("/api/login", {
          login: username,
          password: password,
        })
        .then(async (res) => {
          await Storage.set({
            key: "ACCESS_TOKEN",
            value: JSON.stringify(res.data.accessToken),
          });
          await Storage.set({
            key: "EXPIRES_IN",
            value: res.data.expiresIn,
          });
          await setIsLoggedIn(true);
          await setUsernameAction(username);
          await setUserIdAction(res.data.userId);
          await setReloadAction(true);
          setUsername("");
          setPassword("");
          history.push("/tabs/home", { direction: "none" });
        })
        .catch(function (error) {
          setLoginError(true);
          console.log(error);
        });
    }
  };

  return (
    <IonPage id="login-page">
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
        <div className="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
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
            <a href="/signup" className="resetText">
              Don't have an account? <b>Click here to sign up.</b>{" "}
            </a>
          </div>
          <div className="reset">
            <a href="" className="resetText">
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

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername,
    setUserId,
    setReload,
  },
  component: Login,
});
