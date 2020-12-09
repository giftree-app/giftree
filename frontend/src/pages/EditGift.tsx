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

const EditGift: React.FC<RouterProps> = () => {
  const [giftId, setGiftId] = useState("");
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftLocation, setGiftLocation] = useState("");
  const [giftComment, setGiftComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const setValues = async () => {
      let giftId = await getFromStorage("currentGiftId");
      setGiftId(giftId);
    };
    const getGift = async () => {
      const token = await getFromStorage("ACCESS_TOKEN");
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };

      axios
        .post("/api/getGift", { giftId: giftId }, config)
        .then((res) => {
          setGiftName(res.data.giftName);
          setGiftPrice(res.data.giftPrice);
          setGiftLocation(res.data.giftLocation);
          setGiftComment(res.data.giftComment);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    setValues();
    getGift();
  }, [giftId]);

  const deleteGift = async () => {
    const token = await getFromStorage("ACCESS_TOKEN");
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

    const token = await getFromStorage("ACCESS_TOKEN");
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };

    axios
      .post("/api/updateGift", giftObject, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async function clearValues() {
    await Storage.remove({ key: "currentGiftId" });
  }

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
            <IonButton type="submit">Update Gift</IonButton>
          </IonRow>
          <IonRow>
            <IonButton onClick={() => setShowAlert(true)}>
              Delete Gift
            </IonButton>
          </IonRow>
          <IonRow>
            <IonButton
              onClick={() => {
                clearValues();
                return <Redirect to={"/tabs/wishlist"} />;
              }}
            >
              Back to Wishlist
            </IonButton>
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
            handler: () => {
              deleteGift();
              clearValues();
              return <Redirect to={"/tabs/wishlist"} />;
            },
          },
        ]}
        onDidDismiss={() => setShowAlert(false)}
      />
    </IonPage>
  );
};

export default withRouter(EditGift);
