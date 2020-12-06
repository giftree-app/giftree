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
  IonCheckbox,
} from "@ionic/react";
import axios from "axios";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { Gifts } from "../models/Gift";
import {
//  setGroupId,
  setMemberWishlistId,
  setReload,
} from "../data/user/user.actions";
import { connect } from "../data/connect";
import { Plugins } from "@capacitor/core";
import { RouteComponentProps, withRouter } from "react-router";
const { Storage } = Plugins;

// const BASE_URL = "https://COP4331-1.herokuapp.com/";
// const ENDPOINT_URL = BASE_URL + "api/getWishlist";

interface GiftProps {
  gifts: Gifts[];
}

interface StateProps {
  groupId?: string;
  memberWishlistId?: string;
  reload: boolean;
}

interface DispatchProps {
  setMemberWishlistId: typeof setMemberWishlistId;
//  setGroupId: typeof setGroupId;
  setReload: typeof setReload;
}

interface OwnProps extends RouteComponentProps {}

interface ListLoadingState {
  isListLoading: boolean;
  isListLoaded: boolean;
}
/////////////////////////////////////

interface WishlistProps
  extends OwnProps,
    StateProps,
    DispatchProps {}
/////////////////////////////////////

const MemberWishlist: React.FC<WishlistProps> = ({
  history,
  groupId,
  reload,
  memberWishlistId,
  setReload: setReloadAction
}) => {
  const [isListLoading, setIsListLoading] = useState(false);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [fullName, setFullName] = useState('');
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
        //console.log('memberWishlist->memberId: '+ memberWishlistId);
        const token = await getToken();
        const config = {
          headers: { authorization: `Bearer ${token}` },
        };
        // get user name from db
        axios
          .post("/api/getUser", { userId: memberWishlistId }, config)
          .then(async (res) => {
            await console.log(res);
            await setFullName(res.data.firstName + ' ' + res.data.lastName);
            setIsListLoaded(true);
          })
          .catch(function (error) {
            console.log(error);
          });
        
        // get user wishlist
        axios
          .post("/api/getWishlist", { userId: memberWishlistId }, config)
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
  }, [memberWishlistId, isListLoading, setReloadAction, reload]);

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

  const gotGift = async (e: any) => {
    //e.preventDefault();

    const giftObject = {
      giftId: e.giftId
    };

    //console.log(giftObject);
    const token = await getToken();
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };

    axios
      .post("/api/gotGift", giftObject, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClick = (e: any) => {
    //console.log('clicked on: ' + e.giftId);
    //setGiftIdAction(e.giftId);
  };
  ////////////////////////////////

  const onGiftGot = (e: any) => {
    // we have to toggle giftGot here, since we're passing in the value that is currently in the DB
    let giftGot = !e.giftGot;
    console.log('onGiftGot: ' + giftGot);
    gotGift(e.giftId);
    //setGiftIdAction(e.giftId);
  };
  ////////////////////////////////

  const goBackToGroup = (e: any) => {
    console.log("groupId: " + groupId);
    setReloadAction(true);
    history.push("/tabs/EditGroup", { direction: "none" });
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
              <IonTitle>{fullName}'s Wishlist</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonList lines="none">
              {temp &&
                temp.map((gift) => (
                  <IonItem
                    detail={false}
                    key={gift.giftId}
                    onClick={() => onClick({ giftId: gift.giftId })}
                  >
                    <IonCheckbox checked={gift.giftGot} onIonChange={ e => onGiftGot(gift)} />
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
                    onClick={() => goBackToGroup(true)}
                  >
                    Back to group!
                  </IonItem>
                </IonCol>
              </IonCardHeader>
            </IonCard>
            <br />
          </IonContent>
        </IonPage>
      </div>
    );
  }
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    groupId: state.user.groupId,
    memberWishlistId: state.user.memberWishlistId,
    reload: state.user.reload,
  }),
  mapDispatchToProps: {
    setMemberWishlistId,
//    setGroupId,
    setReload
  },
  component: withRouter(MemberWishlist),
});
