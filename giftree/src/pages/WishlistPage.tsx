
import React, { Component, useState, useEffect } from 'react';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import axios from 'axios';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import {Gifts} from '../models/Gift';
//import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import AddGift from '../components/addgift.component';
import UpdateGift from '../components/updategift.component';
//import { gift } from 'ionicons/icons';
import { setUsername } from '../data/user/user.actions';
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';




const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_URL = BASE_URL + 'api/getWishlist';
const USERID = '5faf3e7fbed65600178391bc';


interface GiftProps{
    gifts: Gifts[];
}

interface OwnProps extends RouteComponentProps { }

interface StateProps {
  username?: string;
  userId?: string;
}

interface DispatchProps {
  setUsername: typeof setUsername;
}

interface WishlistProps extends StateProps, DispatchProps { }

class Wishlist extends React.Component<WishlistProps>{
    username?: string;
    userId?: string;
    setUsername: (username?: string) => (dispatch: React.Dispatch<any>) => Promise<{ readonly type: 'set-username'; readonly username: string; }>;
    setUserId: (userId?: string) => (dispatch: React.Dispatch<any>) => Promise<{ readonly type: 'set-userid'; readonly userid: string; }>;

    state = {isLoading: true };

    gifts: Gifts[];

    constructor(props: WishlistProps)
    {
      super(props);
      this.username = props.username;
      this.userId = props.userId;
    }
    
    getList = () => {
        axios.post(ENDPOINT_URL, {userId: this.userId})
            .then(res => {
                console.log(res);
                this.gifts = res.data.gifts;
                this.setState({isLoading: false});
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    componentDidMount() {
        this.getList();
    }

    render()
    {
        const {isLoading} = this.state;
        
        if (isLoading)
        {
            return null;
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
                    {this.gifts && this.gifts.map(gift => (
                    <IonItem detail={false} routerLink={`/components/updategift/${gift.giftId}`} key={gift.giftId}>
                        <IonLabel>
                        <h3>{gift.giftName}</h3>
                        </IonLabel>
                    </IonItem>
                    ))}
                  </IonList>
                </IonContent>
              </IonPage>
            </div>
        )
    }
}

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId
  }),
  component: Wishlist
})

