import React, { useState } from 'react';
import axios from 'axios';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonLabel, IonList, IonItem, IonInput, IonRow, IonCol } from '@ionic/react';
import { connect } from '../data/connect';


const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_URL = BASE_URL + 'api/addGift';


interface StateProps {
  username?: string;
  userId?: string;
}

const AddGift: React.FC<StateProps> = ({ 
  username,
  userId
 }) => {
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftLocation, setGiftLocation] = useState("");
  const [giftComment, setGiftComment] = useState("");
  const [giftAdded, setGiftAdded] = useState(false);

  const addGift = async (e: React.FormEvent) => {
    e.preventDefault();
    const giftObject = {
        userId: userId,
        giftName: giftName,
        giftPrice: giftPrice,
        giftLocation: giftLocation,
        giftComment: giftComment
    };

    //console.log(giftObject);
    
    axios.post(ENDPOINT_URL, giftObject)
        .then((res) => {
            console.log(res.data)
        }).catch((error) => {
            console.log(error)
        });
    setGiftName('');
    setGiftPrice('');
    setGiftLocation('');
    setGiftComment('');
    setGiftAdded(true);
  };

  if (giftAdded)
  {
    return (
      <IonRow>
        <IonCol>
          <IonButton routerLink="/tabs/AddGift" expand="block">
            Add another gift
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton routerLink="/tabs/Wishlist" expand="block">
            Wishlist
          </IonButton>
        </IonCol>
      </IonRow>
    )
  }
  else
  {
    return (
      <IonPage id="addgift-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Add Gift, {username}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form noValidate onSubmit={addGift}>
            <IonList>
              <IonItem>
                <IonLabel position="stacked" color="primary">
                  Gift:
                </IonLabel>
                <IonInput
                  name="giftName"
                  type="text"
                  value={giftName}
                  spellCheck={false}
                  autocapitalize="off"
                  onIonChange={(e) => setGiftName(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked" color="primary">
                  Price:
                </IonLabel>
                <IonInput
                  name="giftPrice"
                  type="text"
                  value={giftPrice}
                  spellCheck={false}
                  autocapitalize="off"
                  onIonChange={(e) => setGiftPrice(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked" color="primary">
                  Location:
                </IonLabel>
                <IonInput
                  name="giftLocation"
                  type="text"
                  value={giftLocation}
                  spellCheck={false}
                  autocapitalize="off"
                  onIonChange={(e) => setGiftLocation(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked" color="primary">
                  Comment:
                </IonLabel>
                <IonInput
                  name="giftComment"
                  type="text"
                  value={giftComment}
                  spellCheck={false}
                  autocapitalize="off"
                  onIonChange={(e) => setGiftComment(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

            </IonList>

            <IonRow>
              <IonCol>
                <IonButton type="submit" expand="block">
                  Add Gift
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton routerLink="/tabs/Wishlist" expand="block">
                  Wishlist
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonContent>
      </IonPage>
    );
  }
};

export default connect<StateProps, {}>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    giftId: state.user.giftId
  }),
  component: AddGift
});