
import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import axios from 'axios';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import {Gifts} from '../models/Gift';
import { setUserId, setUsername, setGiftId } from '../data/user/user.actions';
import { connect } from '../data/connect';


const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_URL = BASE_URL + 'api/getWishlist';


interface GiftProps{
    gifts: Gifts[];
}

interface StateProps {
  username?: string;
  userId?: string;
  giftId?: string;
}

interface DispatchProps {
  setUsername: typeof setUsername;
  setUserId: typeof setUserId;
  setGiftId: typeof setGiftId;
}

interface ListLoadingState {
  isListLoading: boolean
  isListLoaded: boolean;
}
/////////////////////////////////////

interface WishlistProps extends StateProps, DispatchProps, GiftProps, ListLoadingState { }
/////////////////////////////////////

const Wishlist: React.FC<WishlistProps> = ({
  setUsername,
  username,
  setUserId,
  userId,
  setGiftId: setGiftIdAction
 }) => {

const [isListLoading, setIsListLoading] = useState(false)
const [isListLoaded, setIsListLoaded] = useState(false)
const [gifts, setGifts] = useState([]);


useEffect(() => {
  //console.log('in useEffect');
  if(isListLoading === false)
  {
    //console.log('in useEffect: setting isListLoading to true');
    const getList = () => {
      //console.log('in getList()');
      axios.post(ENDPOINT_URL, {userId: userId})
          .then(async res => {
              await console.log(res);
              await setGifts(res.data.gifts);
              setIsListLoaded(true);
          })
          .catch(function (error) {
              console.log(error);
          })
    };
    getList();
    setIsListLoading(true);
  }
}, [userId, isListLoading]);




const onClick = (e: any) => {
  //console.log('clicked on: ' + e.giftId);
  setGiftIdAction(e.giftId);
};
////////////////////////////////
  if (isListLoaded === false)
  {
      return <div> loading ...</div>;
  }
  else
  {
    let temp = gifts;
    //console.log(temp);

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
            <IonList lines="none" >
              {
                temp &&
                temp.map(gift => (<IonItem detail={false} href='/tabs/editgift' routerDirection="none" key={gift.giftId} onClick={ () => onClick({giftId: gift.giftId}) } >
                  <IonLabel>
                    <h3>{gift.giftName}</h3>
                  </IonLabel>
                </IonItem>))
              }
            </IonList>
            <br/>
            
            <IonButton href='/tabs/addgift' routerDirection="none" >
              <IonLabel>Add Gift</IonLabel>
            </IonButton>
          </IonContent>
        </IonPage>
      </div>
    );
  }
}

export default connect<StateProps, {}, DispatchProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    giftId: state.user.giftId
  }),
  mapDispatchToProps: {
    setUsername,
    setUserId,
    setGiftId
  },
  component: Wishlist
});