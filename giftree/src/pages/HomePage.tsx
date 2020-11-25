import React from 'react';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
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

interface HomePageProps extends StateProps { }

const HomePage: React.FC<HomePageProps> = ({ username, userId }) => {

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
      <IonContent>
        username:
        {username &&
          (<div className="ion-padding-top ion-text-center">
            <img src="https://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
            <h2>{ username }</h2>
          </div>)
        }
        userId:
        {userId &&
          (<div className="ion-padding-top ion-text-center">
            <img src="https://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
            <h2>{ userId }</h2>
          </div>)
        }
      </IonContent>
    </IonPage>
  );
};

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId
  }),
  component: HomePage
})
