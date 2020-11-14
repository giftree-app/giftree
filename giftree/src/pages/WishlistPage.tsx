import React from 'react';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const Tab1: React.FC = () => {
  return (
    <IonPage id="wishlist">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Wishlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Placeholder wishlist page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Wishlist page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
