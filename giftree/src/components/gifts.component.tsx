// ** gifts.component.js ** //

import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import {Gifts} from '../models/Gift';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import AddGift from './addgift.component';
import UpdateGift from './updategift.component';
//import { gift } from 'ionicons/icons';



const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_URL = BASE_URL + 'api/getWishlist';
const USERID = '5faf3e7fbed65600178391bc';


interface GiftProps{
    gifts: Gifts[];
}

class Wishlist extends React.Component{
    state = {isLoading: true };

    gifts: Gifts[];

    getList = () => {
        axios.post(ENDPOINT_URL, {userId: USERID} )
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
                <header>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <a className="navbar-brand">Wishlist</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <IonList lines="none">
                                {this.gifts && this.gifts.map(gift => (
                                <IonItem detail={false} routerLink={`/components/updategift/${gift.giftId}`} key={gift.giftId}>
                                    <IonLabel>
                                    <h3>{gift.giftName}</h3>
                                    </IonLabel>
                                </IonItem>
                                ))}
                            </IonList>
                            <li className="nav-item active">
                                <Link className="nav-link" to={"/addgift"}>Add Gift</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/updategift"}>Update Gift</Link>
                            </li>
                        </ul>
                    </div>
                    </nav>
                </header>
                <div className="container">
                    
                    <Switch>
                        <Route exact path='/' component={AddGift} />
                        <Route path="/addgift" component={AddGift} />
                        <Route path="/updategift" component={UpdateGift} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Wishlist;
/*
export default class Wishlist extends Component implements GiftProps{
    gifts: Gifts[];
    
    // similar to componentDidMount()
    // however, this gets called after the initial render!!!
    constructor(props: any){
        super(props);
    }
    

    componentDidMount()
    {
        axios.post(ENDPOINT_URL, {userId: USERID} )
            .then(res => {
                console.log(res);
                this.gifts = res.data.gifts;
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
                        {this.gifts?this.gifts.map(gift => (
                        <IonItem detail={false} routerLink={`/components/updategift/${gift.giftId}`} key={gift.giftId}>
                            <IonLabel>
                            <h3>{gift.giftName}</h3>
                            </IonLabel>
                        </IonItem>
                        )):"loading..."}
                    </IonList>
                </div>
            </div>
        )
    }
}
*/
////////////////////////////////////////////////////////////

/*
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
*/