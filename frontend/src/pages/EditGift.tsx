import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonRow,
  IonCol,
  IonAlert,
} from "@ionic/react";
import { setGiftId, setReload } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps, withRouter } from "react-router";

// const BASE_URL = 'https://COP4331-1.herokuapp.com/';
// const ENDPOINT_GET = BASE_URL + 'api/getGift';
// const ENDPOINT_UPDATE = BASE_URL + 'api/updateGift';
// const ENDPOINT_DELETE = BASE_URL + 'api/deleteGift';

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  giftId?: string;
  reload: boolean;
}

interface DispatchProps {
  setGiftId: typeof setGiftId;
  setReload: typeof setReload;
}

interface UpdateGiftProps extends OwnProps, StateProps, DispatchProps {}

const EditGift: React.FC<UpdateGiftProps> = ({
  history,
  giftId,
  setReload: setReloadAction,
}) => {
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftLocation, setGiftLocation] = useState("");
  const [giftComment, setGiftComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const deleteGift = () => {
    //console.log('EditGift: in deleteGift');
    axios
      .post("/api/deleteGift", { giftId: giftId })
      .then((res) => {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateGift = async (e: React.FormEvent) => {
    e.preventDefault();

    const giftObject = {
      giftId: giftId,
      giftName: giftName,
      giftPrice: giftPrice,
      giftLocation: giftLocation,
      giftComment: giftComment,
    };

    //console.log(giftObject);

    axios
      .post("/api/updateGift", giftObject)
      .then((res) => {
        console.log(res.data);
        redirectToWishList(e);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const redirectToWishList = async (e: React.FormEvent) => {
    setReloadAction(true);
    history.push("/tabs/wishlist", { direction: "none" });
  };

  useEffect(() => {
    //console.log('EditGift: in useEffect');
    if (isLoading === false) {
      //console.log('EditGift: in useEffect: setting isListLoading to true');
      const getGift = () => {
        //console.log('EditGift: in getGift');
        axios
          .post("/api/getGift", { giftId: giftId })
          .then((res) => {
            //console.log(res);
            setGiftName(res.data.giftName);
            setGiftPrice(res.data.giftPrice);
            setGiftLocation(res.data.giftLocation);
            setGiftComment(res.data.giftComment);
            setIsLoaded(true);
          })
          .catch(function (error) {
            console.log(error);
          });
      };

      getGift();
      setIsLoading(true);
    }
  }, [giftId, isLoading]);

  if (isLoaded === false) {
    return <div> loading ...</div>;
  } else {
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
                <IonButton type="submit">Update Gift</IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={() => setShowAlert(true)}>
                  delete Gift
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton routerLink="/tabs/Wishlist">Wishlist</IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonContent>
        <IonAlert
          isOpen={showAlert}
          header="Delete Gift?"
          buttons={[
            "No",
            {
              text: "Yes",
              handler: (data: any) => {
                //setUsername(data.username);
                deleteGift();
                redirectToWishList(data);
              },
            },
          ]}
          onDidDismiss={() => setShowAlert(false)}
        />
      </IonPage>
    );
  }
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    giftId: state.user.giftId,
    reload: state.user.reload,
  }),
  mapDispatchToProps: {
    setGiftId,
    setReload,
  },
  component: withRouter(EditGift),
});
