// ** addgift.component.tsx ** //

import React, { Component, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_URL = BASE_URL + 'api/addGift';
const USERID = '5faf3e7fbed65600178391bc';


export default class AddGift extends Component {
    userId: string;
    giftName: string;
    giftPrice: string;
    giftLocation: string;
    giftComment: string;

    constructor(props: any) {
        super(props)
        
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangeGift = this.onChangeGift.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            userId: this.userId,
            giftName: '',
            giftPrice: '',
            giftLocation: '',
            giftComment: ''
        }
        this.userId = USERID;
        this.giftName = '';
        this.giftPrice = '';
        this.giftLocation = '';
        this.giftComment = '';
    }

    onChangeUserId(e: any) {
        //this.setState({ userId: e.target.value })
        this.userId = e.target.value;
        this.setState({ userId:  e.target.value})
        //setUserId(USERID);
    }

    onChangeGift(e: any) {
        console.log(ENDPOINT_URL)
        console.log(this.state)
        this.giftName = e.target.value;
        this.setState({ giftName: e.target.value })
        //setGiftName(giftName);
    }

    onChangePrice(e: any) {
        this.giftPrice = e.target.value;
        this.setState({ giftPrice: e.target.value })
        //setGiftPrice(giftPrice);
    }

    onChangeLocation(e: any) {
        this.giftLocation = e.target.value;
        this.setState({ giftLocation: e.target.value })
        //setGiftLocation(giftLocation);
    }

    onChangeComment(e: any) {
        this.giftComment = e.target.value;
        this.setState({ giftComment: e.target.value })
        //setGiftComment(giftComment);
    }

    onSubmit(e: any) {
        e.preventDefault();

       //userId: this.state.userId,
        const giftObject = {
            userId: this.userId,
            giftName: this.giftName,
            giftPrice: this.giftPrice,
            giftLocation: this.giftLocation,
            giftComment: this.giftComment
        };

        console.log(giftObject);
        
        axios.post(ENDPOINT_URL, giftObject)
            .then((res) => {
                console.log(res.data)
            }).catch((error) => {
                console.log(error)
            });
        //this.setState({ userId: '', giftName: '', giftPrice: '', giftLocation: '', giftComment: '' })
    }

    render() {
        return (
            <div className="wrapper">
                <form>
                    <div className="form-group">
                        <label>Gift Name</label>
                        <input type="text" value={this.giftName} onChange={this.onChangeGift} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="text" value={this.giftPrice} onChange={this.onChangePrice} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" value={this.giftLocation} onChange={this.onChangeLocation} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Notes</label>
                        <input type="text" value={this.giftComment} onChange={this.onChangeComment} className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Add Gift" className="btn btn-success btn-block" onClick={this.onSubmit} />
                    </div>
                </form>
            </div>
        )
    }
}