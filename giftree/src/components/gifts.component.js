// ** gifts.component.js ** //

import React, { Component } from 'react';
import axios from 'axios';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import { gift } from 'ionicons/icons';



const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_URL = BASE_URL + 'api/getWishlist';
const USERID = '5faf3e7fbed65600178391bc';

export default class Gifts extends Component {

    constructor(props){
        super(props);
        this.state = { Gifts: []}
    }

    componentDidMount() {
        axios.post(ENDPOINT_URL, {userId: USERID} )
            .then(res => {
                console.log(res);
                this.setState({ Gifts: res.data.gifts });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <div className="wrapper-users">
                <div className="container">
                    <IonList lines="none">
                        {this.state.Gifts.map(gift => (
                        <IonItem detail={false} routerLink={`/components/updategift/${gift.giftId}`} key={gift.giftId}>
                            <IonLabel>
                            <h3>{gift.giftName}</h3>
                            </IonLabel>
                        </IonItem>
                        ))}
                    </IonList>
                </div>
            </div>
        )
    }
}