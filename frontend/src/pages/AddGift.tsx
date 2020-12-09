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
  IonText,
} from "@ionic/react";
import { Plugins } from "@capacitor/core";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  return JSON.parse(res.value);
}

interface RouterProps extends RouteComponentProps {}

const AddGift: React.FC<RouterProps> = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftLocation, setGiftLocation] = useState("");
  const [giftComment, setGiftComment] = useState("");
  const [giftAdded, setGiftAdded] = useState(false);

  // verification
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [giftNameError, setGiftNameError] = useState(false);
  const [giftPriceError, setGiftPriceError] = useState(false);
  const [giftLocationError, setGiftLocationError] = useState(false);

  useEffect(() => {
    const setValues = async () => {
      let userId = await getFromStorage("userId");
      let username = await getFromStorage("username");

      setUserId(userId);
      setUsername(username);
    };
    setValues();
  }, []);

  const addGift = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);

    if (!giftName) {
      setGiftNameError(true);
    }

    if (!giftPrice) {
      setGiftPriceError(true);
    }

    if (!giftLocation) {
      setGiftLocationError(true);
    }

    if (giftName && giftPrice && giftLocation) {
      const giftObject = {
        userId: userId,
        giftName: giftName,
        giftPrice: giftPrice,
        giftLocation: giftLocation,
        giftComment: giftComment,
      };

      const token = await getFromStorage("ACCESS_TOKEN");
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };
      axios
        .post("/api/addGift", giftObject, config)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setGiftAdded(true);
      setGiftName("");
      setGiftPrice("");
      setGiftLocation("");
      setGiftComment("");
    }
  };

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
                Gift Name:
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

            {formSubmitted && giftNameError && (
              <IonText color="danger">
                <p className="ion-padding-start">Gift name is required</p>
              </IonText>
            )}

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

            {formSubmitted && giftPriceError && (
              <IonText color="danger">
                <p className="ion-padding-start">Gift price is required</p>
              </IonText>
            )}

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

            {formSubmitted && giftLocationError && (
              <IonText color="danger">
                <p className="ion-padding-start">Gift location is required</p>
              </IonText>
            )}

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
              ></IonInput>
            </IonItem>
          </IonList>
          <IonRow>
            <IonText>
              {giftAdded && giftName
                ? "Added [" + giftName + "] to wishlist!"
                : ""}
            </IonText>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">
                Add Gift
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                expand="block"
                onClick={() => {
                  return <Redirect to={"/tabs/wishlist"} />;
                }}
              >
                Back to Wishlist
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(AddGift);
