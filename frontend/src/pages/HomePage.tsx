import React from 'react';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar, IonCol, IonRow, IonButton } from '@ionic/react';
import { connect } from '../data/connect';


interface StateProps {
  username?: string;
  userId?: string;
}

const HomePage: React.FC<StateProps> = ({ username, userId }) =>
{
  //console.log('homepage entry: reload = ' + reload);

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
            <h2>{ username }</h2>
          </div>)
        }
        userId:
        {userId &&
          (<div className="ion-padding-top ion-text-center">            
            <h2>{ userId }</h2>
          </div>)
        }
        <IonCol>
          <IonRow>
            <IonButton routerLink="/tabs/Grouplist">Groups</IonButton>
            <IonButton routerLink="/tabs/wishlist">Wishlist</IonButton>
          </IonRow>
        </IonCol>
      </IonContent>
    </IonPage>
  );
};

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    reload: state.user.reload
  }),
  component: HomePage
})
