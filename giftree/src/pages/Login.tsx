import React, { useState } from "react";
import axios from 'axios';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonRow,
  IonCol,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
} from "@ionic/react";
import "./Login.scss";
import { setIsLoggedIn, setUsername } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface LoginProps extends OwnProps, DispatchProps {}

const Login: React.FC<LoginProps> = ({
  setIsLoggedIn,
  history,
  setUsername: setUsernameAction,
}) => {
  const BASE_URL = 'https://COP4331-1.herokuapp.com/';
  const app_name = 'cop4331-1';

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  function buildPath(route: any)
  {
    // look at using process.env.NODE_ENV
    if (true)//process.env.NODE_ENV === 'production')
    {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else
    {
      return 'http://localhost:8100/' + route;
    }
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!username) {
      setUsernameError(true);
    }
    if (!password) {
      setPasswordError(true);
    }

    if (username && password) {
      await setIsLoggedIn(true);
      await setUsernameAction(username);
      axios
        .post(buildPath('api/login'), {
          login: username,
          password: password,
        })
        .then(async function () {
          await setIsLoggedIn(true);
          await setUsernameAction(username);
          history.push("/tabs/Home", { direction: "none" });
        })
        .catch(function () {
          alert("Could not login. Please try again");
        });
      //history.push("/tabs/schedule", { direction: "none" });
    }
  };

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
        </div>
        <IonLabel>
          <h1 className= "header">LOG IN</h1>

        </IonLabel>

        <form noValidate onSubmit={login}>
          <IonList>
            <IonItem>
              <IonInput
                name="username"
                type="text"
                placeholder= "USERNAME"
                value={username}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => setUsername(e.detail.value!)}
                required

              ></IonInput>
            </IonItem>

            {formSubmitted && usernameError && (
              <IonText color="danger">
                <p className="ion-padding-start">Username is required</p>
              </IonText>
            )}

            <IonItem className= "passfield">
              <IonInput
                name="password"
                type="password"
                placeholder= "PASSWORD"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}

              ></IonInput>
            </IonItem>

            {formSubmitted && passwordError && (
              <IonText color="danger">
                <p className="ion-padding-start">Password is required</p>
              </IonText>
            )}
          </IonList>
          <div className= "reset">
          <a href="" className= "resetText">Forgot email? <b>Click here to reset.</b> </a>
          </div>
          <div className= "reset">
          <a href="" className= "resetText">Forgot password? <b>Click here to reset.</b> </a>
          </div>

              <IonButton type="submit" expand="block" className="loginbtn" >
                Go!
              </IonButton>

            {/* <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">
                Signup
              </IonButton>
            </IonCol> */}

        </form>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername,
  },
  component: Login,
});
