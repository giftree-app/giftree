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
import { connect } from "../data/connect";
import { RouteComponentProps, withRouter } from "react-router";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

interface StateProps {
  username?: string;
  userId?: string;
  isAuthenticated?: boolean;
}

interface OwnProps extends RouteComponentProps {}

interface ResetPassValidationProps extends OwnProps {}

const ResetPassValidation: React.FC<ResetPassValidationProps> = ({
  history,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [validateFormError, setValidateFormError] = useState(false);

  const resetPassRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidateFormError(false);
    setFormSubmitted(true);

    !username ? setUsernameError(true) : setUsernameError(false);
    !password ? setPasswordError(true) : setPasswordError(false);
    !code ? setCodeError(true) : setCodeError(false);

    if (username && password && code) {
      axios
        .post("/api/forgotPasswordReset", {
          login: username,
          password: password,
          validateCode: code,
        })
        .then(async (res) => {
          console.log(res);
          setUsername("");
          setPassword("");
          history.push("/login", { direction: "none" });
        })
        .catch(function (error) {
          setValidateFormError(true);
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
          <img src="assets/img/appicon.svg" alt="Giftree logo" />
        </div>
        <IonLabel>
          <h1 className="header">Password Reset</h1>
        </IonLabel>

        <form noValidate onSubmit={resetPassRequest}>
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
                placeholder="NEW PASSWORD"
                value={password}
                onIonChange={(e) => {
                  setPassword(e.detail.value!);
                  setPasswordError(false);
                }}
              ></IonInput>
            </IonItem>
            <IonItem className="passfield">
              <IonInput
                name="code"
                type="text"
                placeholder="VALIDATION CODE"
                value={code}
                onIonChange={(e) => {
                  setCode(e.detail.value!);
                  setCodeError(false);
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

          {formSubmitted && validateFormError && (
            <IonItem lines="none">
              <IonText color="danger">
                <p className="ion-padding-start">
                  There was an error submitting your validation code, please try
                  again.
                </p>
              </IonText>
            </IonItem>
          )}

          <IonButton type="submit" expand="block" className="loginbtn">
            Validate
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    isAuthenticated: state.user.isLoggedin,
  }),
  component: withRouter(ResetPassValidation),
});
