import React, { useState } from "react";
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
import { connect } from "../data/connect";
import { RouteComponentProps, withRouter } from "react-router";
import "./AddGift.scss";

// const BASE_URL = 'https://COP4331-1.herokuapp.com/';
// const ENDPOINT_URL = BASE_URL + 'api/addGift';

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  username?: string;
  userId?: string;
}

interface AddGiftProps extends OwnProps, StateProps {}

const AddGift: React.FC<AddGiftProps> = ({ history, username, userId }) => {
  const [giftName, setGiftName] = useState("");
  const [addedGiftName, setAddedGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftLocation, setGiftLocation] = useState("");
  const [giftComment, setGiftComment] = useState("");
  const [giftAdded, setGiftAdded] = useState(false);

  // verification
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [giftNameError, setGiftNameError] = useState(false);
  const [giftPriceError, setGiftPriceError] = useState(false);
  const [giftLocationError, setGiftLocationError] = useState(false);

  const addGift = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);

    //console.log('in addgift now');

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

      //console.log(giftObject);
      //console.log(history);
      axios
        .post("/api/addGift", giftObject)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setAddedGiftName(giftName);
      setGiftAdded(true);
      setGiftName("");
      setGiftPrice("");
      setGiftLocation("");
      setGiftComment("");
      ShowResult(e);
    }
  };

  const ShowResult = async (e: React.FormEvent) => {
    history.push("Wishlist", { direction: "none" });
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
              <IonLabel position="floating" color="black" className="addgift-label">
                Gift:
              </IonLabel>
              <IonInput
                className="addgift-input"
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
              <IonLabel position="floating" color="black" className="addgift-label">
                Price:
              </IonLabel>
              <IonInput
                className="addgift-input"
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
              <IonLabel position="floating" color="black" className="addgift-label">
                Location:
              </IonLabel>
              <IonInput
                className="addgift-input"
                color="black"
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
              <IonLabel position="floating" color="black" className="addgift-label">
                Comment:
              </IonLabel>
              <IonInput
                className="addgift-input"
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
              {giftAdded ? "Added [" + addedGiftName + "] to wishlist!" : ""}
            </IonText>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">
                Add Gift
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton href="/tabs/wishlist" expand="block">
                Wishlist
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId
  }),
  component: withRouter(AddGift),
});
