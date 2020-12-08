import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonItem, IonAlert } from '@ionic/react';
import './Account.scss';
import { setUserId, setUsername } from '../data/user/user.actions';
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';

interface OwnProps extends RouteComponentProps { }

interface StateProps {
  username?: string;
  userId?: string;
}

interface DispatchProps {
  setUsername: typeof setUsername;
  setUserId: typeof setUserId;
}

interface AccountProps extends OwnProps, StateProps, DispatchProps { }

const Account: React.FC<AccountProps> = ({ setUsername, username, setUserId, userId }) => {

  const [showAlert, setShowAlert] = useState(false);

  const clicked = (text: string) => {
    console.log(`Clicked ${text}`);
  }

  return (
    <IonPage id="account-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle><img src="assets/img/appicon.svg" className="toolbar-logo" /></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {username &&
          (<div className="ion-padding-top ion-text-center">
            <h1 style={{ paddingTop: "40px" }}>{ username }</h1>
            <IonList inset>
              <IonItem onClick={() => setShowAlert(true)}>Change Username</IonItem>
              <IonItem onClick={() => clicked('Change Password')} style={{ paddingTop: "20px" }}>Change Password</IonItem>
              <IonItem routerLink="/logout" routerDirection="none" style={{ paddingTop: "20px" }}>Logout</IonItem>
            </IonList>
          </div>)
        }
      </IonContent>
      <IonAlert
        isOpen={showAlert}
        header="Change Username"
        buttons={[
          'Cancel',
          {
            text: 'Ok',
            handler: (data) => {
              setUsername(data.username);
            }
          }
        ]}
        inputs={[
          {
            type: 'text',
            name: 'username',
            value: username,
            placeholder: 'username'
          }
        ]}
        onDidDismiss={() => setShowAlert(false)}
      />
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId
  }),
  mapDispatchToProps: {
    setUsername,
    setUserId
  },
  component: Account
})
