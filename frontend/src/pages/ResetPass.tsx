import React, { useState } from "react";
import axios from "axios";
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
  IonItem,
  IonInput,
  IonText,
} from "@ionic/react";
import {
  setIsLoggedIn,
  setUsername,
  setUserId,
  setReload,
} from "../data/user/user.actions";
import { connect } from "../data/connect";
import "./ResetPass.scss";

interface StateProps {
  username?: string;
  userId?: string;
  isAuthenticated?: boolean;
}

interface OwnProps extends RouteComponentProps {}

interface ResetPassProps extends OwnProps {}

const ResetPass: React.FC<ResetPassProps> = ({ history }) => {
  //console.log('homepage entry: reload = ' + reload);

  const [username, setUsername] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [resetError, setResetError] = useState(false);

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setResetError(false);

    !username ? setUsernameError(true) : setUsernameError(false);

    if (username) {
      axios
        .post("/api/forgotPasswordRequest", {
          login: username,
        })
        .then(async (res) => {
          console.log(res);
          setUsername("");
          history.push("/tabs/reset-password-validation", {
            direction: "none",
          });
        })
        .catch(function (error) {
          setResetError(true);
          console.log(error);
        });
    }
  };

  return (
    <IonPage id="reset-password">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow className="resetpass-content ion-text-center">
          <p>
            {" "}
            Forgot your password? Type in your username below and we'll send you
            an email.
          </p>
        </IonRow>

        <form noValidate onSubmit={resetPassword}>
          <IonItem className="username-field">
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
          <IonButton type="submit" expand="block" className="resetpass-button">
            Reset my password!
          </IonButton>

          {formSubmitted && resetError && (
            <IonItem lines="none">
              <IonText color="danger">
                <p className="ion-padding-start">
                  Error resetting your password, please try again.
                </p>
              </IonText>
            </IonItem>
          )}
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
  component: withRouter(ResetPass),
});
