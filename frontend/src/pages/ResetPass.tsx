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
  IonRow,
  IonCol,
  IonButton,
  IonItem,
  IonInput,
} from "@ionic/react";
import { connect } from "../data/connect";
import "./ResetPass.scss";

interface StateProps {
  username?: string;
  userId?: string;
  isAuthenticated?: boolean;
}

interface ResetPassProps extends StateProps, RouteProps {}

const ResetPass: React.FC<ResetPassProps> = ({
  username,
  userId,
  isAuthenticated,
}) => {
  //console.log('homepage entry: reload = ' + reload);

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
          <p> Forgot your password? Type in your username below and we'll send you an email.
          </p>
        </IonRow>

        <IonItem className="username-field">
          <IonInput
            name="username"
            type="text"
            placeholder="USERNAME"
            value={username}
            spellCheck={false}
            autocapitalize="off"
          ></IonInput>
        </IonItem>
        <IonButton type="submit" expand="block" className="resetpass-button">
          Reset my password!
        </IonButton>
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
  component: ResetPass,
});
