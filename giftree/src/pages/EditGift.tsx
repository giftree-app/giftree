import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonLabel, IonList, IonItem, IonInput, IonRow, IonCol, IonAlert, IonText } from '@ionic/react';
import { setGiftId } from '../data/user/user.actions';
import { connect } from '../data/connect';


const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_GET = BASE_URL + 'api/getGift';
const ENDPOINT_UPDATE = BASE_URL + 'api/updateGift';
const ENDPOINT_DELETE = BASE_URL + 'api/deleteGift';

interface StateProps {
  giftId?: string;
}

interface DispatchProps {
  setGiftId: typeof setGiftId;
}

interface UpdateGiftProps extends StateProps, DispatchProps {}


const EditGift: React.FC<UpdateGiftProps> = ({
    giftId,
    setGiftId
  }) => {
  
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftLocation, setGiftLocation] = useState("");
  const [giftComment, setGiftComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const deleteGift = () => {
    //console.log('EditGift: in deleteGift');
    axios.post(ENDPOINT_DELETE, {giftId: giftId} )
        .then(res => {
            console.log(res);
            setIsDeleted(true);
        })
        .catch(function (error) {
            console.log(error);
    })
  };

  const updateGift = async (e: React.FormEvent) => {
    e.preventDefault();

    const giftObject = {
        giftId: giftId,
        giftName: giftName,
        giftPrice: giftPrice,
        giftLocation: giftLocation,
        giftComment: giftComment
    };

    //console.log(giftObject);
  
    axios.post(ENDPOINT_UPDATE, giftObject)
      .then((res) => {
          console.log(res.data)
      }).catch((error) => {
          console.log(error)
      }); 
  };

  
  const backToWishlist = () => {

  }


  useEffect(() => {
    //console.log('EditGift: in useEffect');
    if(isLoading === false)
    {
      //console.log('EditGift: in useEffect: setting isListLoading to true');
      const getGift = () => {
        //console.log('EditGift: in getGift');
        axios.post(ENDPOINT_GET, {giftId: giftId} )
            .then(res => {
                //console.log(res);
                setGiftName(res.data.giftName);
                setGiftPrice(res.data.giftPrice);
                setGiftLocation(res.data.giftLocation);
                setGiftComment(res.data.giftComment);
                setIsLoaded(true);
            })
            .catch(function (error) {
                console.log(error);
        })
      };
    
      getGift();
      setIsLoading(true);
    }
    
  }, [giftId, isLoading]);


  if (isLoaded === false)
  {
      return <div> loading ...</div>;
  }
  else if (isDeleted === true)
  {
    return (
      <IonPage id="editgift-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Edit Gift</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <br/>
          <br/>
          <br/>
          <IonRow>
              <IonText>{'[' + giftName + '] deleted!'}</IonText>
          </IonRow>
          <br/>
          <br/>
          <br/>
          <IonButton routerLink="/tabs/Wishlist" >
            Wishlist
          </IonButton>
        </IonContent>
      </IonPage>
    )
  }
  else
  {
    return (
      <IonPage id="editgift-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Edit Gift</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form noValidate onSubmit={updateGift}>
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
                <IonButton type="submit" >
                  Update Gift
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={() => setShowAlert(true)}>
                  delete Gift
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton routerLink="/tabs/Wishlist" >
                  Wishlist
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonContent>
        <IonAlert
          isOpen={showAlert}
          header="Delete Gift?"
          buttons={[
            'No',
            {
              text: 'Yes',
              handler: (data:any) => {
                //setUsername(data.username);
                deleteGift();
                backToWishlist();
              }
            }
          ]}
          onDidDismiss={() => setShowAlert(false)}
        />
      </IonPage>
    );
  }
};

export default connect<StateProps, {}, DispatchProps>({
  mapStateToProps: (state) => ({
    giftId: state.user.giftId
  }),
  mapDispatchToProps: {
    setGiftId
  },
  component: EditGift
});