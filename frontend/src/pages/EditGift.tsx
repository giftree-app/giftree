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
  IonAlert,
  IonCol,
} from "@ionic/react";
import { setGiftId, setReload } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps, withRouter } from "react-router";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
import "./EditGift.scss"

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

  const getToken = async () => {
    try {
      const result = await Storage.get({ key: "ACCESS_TOKEN" });
      if (result != null) {
        return JSON.parse(result.value);
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const deleteGift = async () => {
    //console.log('EditGift: in deleteGift');
    const token = await getToken();
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };

    axios
      .post("/api/deleteGift", { giftId: giftId }, config)
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

    const token = await getToken();
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };

    axios
      .post("/api/updateGift", giftObject, config)
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
      const getGift = async () => {
        //console.log('EditGift: in getGift');

        const token = await getToken();
        const config = {
          headers: { authorization: `Bearer ${token}` },
        };

        axios
          .post("/api/getGift", { giftId: giftId }, config)
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
                <IonLabel position="floating" color="black" className="editgift-label">
                  Gift:
                </IonLabel>
                <IonInput
                  className="editgift-input"
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
                <IonLabel position="floating" color="black" className="editgift-label">
                  Price:
                </IonLabel>
                <IonInput
                  className="editgift-input"
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
                <IonLabel position="floating" color="black" className="editgift-label">
                  Location:
                </IonLabel>
                <IonInput
                  className="editgift-input"
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
                <IonLabel position="floating" color="black" className="editgift-label">
                  Comment:
                </IonLabel>
                <IonInput
                  className="editgift-input"
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

            <IonRow className="editgift-buttons">
              <IonCol>
                <IonButton type="submit" expand="block">Update Gift</IonButton>
              </IonCol>
              <IonCol>
              <IonButton expand="block" onClick={() => setShowAlert(true)}>
                delete Gift
              </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="block" routerLink="/tabs/Wishlist">Wishlist</IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonContent>
        <IonAlert
          cssClass="delete-alert"
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
