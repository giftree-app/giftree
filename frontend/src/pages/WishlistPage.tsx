import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import axios from "axios";
import { Gift } from "../models/Gift";
import { Plugins } from "@capacitor/core";
import { Redirect } from "react-router-dom";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  else return res.value;
}

async function putInStorage(key: string, value: any) {
  await Storage.set({
    key: key,
    value: value,
  });
}

const Wishlist: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    const setValues = async () => {
      let id = await getFromStorage("userId");
      console.log(id);
      debugger;
      await setUserId(userId);
      console.log(userId);
      debugger;
    };

    const getList = async () => {
      const token = await getFromStorage("ACCESS_TOKEN");
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };

      axios
        .post("/api/getWishlist", { userId: userId }, config)
        .then(async (res) => {
          await console.log(res);
          await setGifts(res.data.gifts);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    setValues();
    getList();
  }, []);

  async function selectGift(gift: Gift) {
    await putInStorage("currentGiftId", gift.giftId);
    return <Redirect to={"tabs/editgift"} />;
  }

  return (
    <div className="wishlist">
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
          <IonList lines="none">
            {gifts &&
              gifts.length > 0 &&
              gifts.map((gift) => (
                <IonItem
                  detail={false}
                  key={gift.giftId}
                  onClick={() => {
                    selectGift(gift);
                  }}
                >
                  <IonLabel>
                    <h3>{gift.giftName}</h3>
                  </IonLabel>
                </IonItem>
              ))}
          </IonList>
          <br />
          <IonCard className="wishlist-button-card">
            <IonCardHeader>
              <IonCol size="12" size-md="6">
                <IonItem
                  button
                  color="medium"
                  onClick={() => {
                    return <Redirect to={"/tabs/addgift"} />;
                  }}
                >
                  Add Gift!
                </IonItem>
              </IonCol>
            </IonCardHeader>
          </IonCard>
          <br />
        </IonContent>
      </IonPage>
    </div>
  );
};

export default Wishlist;
