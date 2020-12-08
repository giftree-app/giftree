import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCol,
} from "@ionic/react";
import axios from "axios";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { Gifts } from "../models/Gift";
import {
  setUserId,
  setUsername,
  setGiftId,
  setReload,
} from "../data/user/user.actions";
import { connect } from "../data/connect";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
import "./WishlistPage.scss";

// const BASE_URL = "https://COP4331-1.herokuapp.com/";
// const ENDPOINT_URL = BASE_URL + "api/getWishlist";

interface GiftProps {
  gifts: Gifts[];
}

interface StateProps {
  username?: string;
  userId?: string;
  giftId?: string;
  reload: boolean;
}

interface DispatchProps {
  setUsername: typeof setUsername;
  setUserId: typeof setUserId;
  setGiftId: typeof setGiftId;
  setReload: typeof setReload;
}

interface ListLoadingState {
  isListLoading: boolean;
  isListLoaded: boolean;
}
/////////////////////////////////////

interface WishlistProps
  extends StateProps,
    DispatchProps {}
/////////////////////////////////////

const Wishlist: React.FC<WishlistProps> = ({
  userId,
  reload,
  setGiftId: setGiftIdAction,
  setReload: setReloadAction,
}) => {
  const [isListLoading, setIsListLoading] = useState(false);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    //console.log('in useEffect');
    if (isListLoading === false) {
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

      //console.log('in useEffect: setting isListLoading to true');
      const getList = async () => {
        //console.log('in getList()');
        const token = await getToken();
        const config = {
          headers: { authorization: `Bearer ${token}` },
        };
        axios
          .post("/api/getWishlist", { userId: userId }, config)
          .then(async (res) => {
            await console.log(res);
            await setGifts(res.data.gifts);
            setIsListLoaded(true);
          })
          .catch(function (error) {
            console.log(error);
          });
      };
      getList();
      setIsListLoading(true);
      setReloadAction(false);
    }
  }, [userId, isListLoading, setReloadAction, reload]);

  const onClick = (e: any) => {
    //console.log('clicked on: ' + e.giftId);
    setGiftIdAction(e.giftId);
  };
  ////////////////////////////////

  const goToAddGift = (e: any) => {
    setIsListLoaded(false);
    setReloadAction(false);
  };
  ////////////////////////////////

  if (isListLoaded === false) {
    return <div> loading ...</div>;
  } else {
    let temp = gifts;
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
          <IonItem id = "wishlist-title" lines="none">
            <p> Your <strong>Gifts</strong> </p>
          </IonItem>
          <IonContent fullscreen>
            <IonList lines="full" id="wishlist-list">
              {temp &&
                temp.map((gift) => (
                  <IonItem
                    id = "wishlist-gifts"
                    detail={false}
                    href="/tabs/editgift"
                    routerDirection="none"
                    key={gift.giftId}
                    onClick={() => onClick({ giftId: gift.giftId })}
                  >
                  {gift.giftName}
                  </IonItem>
                ))}
            </IonList>
            <br />
              <IonButton
                id="wishlist-add-button"
                expand="block"
                href="/tabs/addgift"
                routerDirection="none"
                onClick={() => goToAddGift(true)}
              >
                Add Gift
              </IonButton>
            <br />
          </IonContent>
        </IonPage>
      </div>
    );
  }
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    giftId: state.user.giftId,
    reload: state.user.reload,
  }),
  mapDispatchToProps: {
    setUsername,
    setUserId,
    setGiftId,
    setReload,
  },
  component: Wishlist,
});
