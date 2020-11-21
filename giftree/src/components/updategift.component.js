// ** updategift.component.js ** //

import React, { Component } from 'react';
import axios from 'axios';

const BASE_URL = 'https://COP4331-1.herokuapp.com/';
const ENDPOINT_GET = BASE_URL + 'api/getGift';
const ENDPOINT_UPDATE = BASE_URL + 'api/updateGift';
const USERID = '5faf3e7fbed65600178391bc';
const GIFTID= '5fb19756409de9a117b5bbf7';

export default class UpdateGift extends Component {

    constructor(props) {
        super(props)

        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangeGift = this.onChangeGift.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
        this.state = {
            userId: USERID,
            giftName: '',
            giftPrice: '',
            giftLocation: '',
            giftComment: ''
        }
    }
    
    componentDidMount() {
        console.log('in componentDidMount');

        let giftObject = {
            giftName: this.state.giftName,
            giftPrice: this.state.giftPrice,
            giftLocation: this.state.giftLocation,
            giftComment: this.state.giftComment,
            giftGot: ''
        };

        console.log(giftObject);
        axios.post(ENDPOINT_GET, {giftId: GIFTID} )
            .then(res => {
                console.log(res);
                this.setState({ giftObject: res.data });
                
                this.setState({
                    giftId: GIFTID,
                    giftName: res.data.giftName,
                    giftPrice: res.data.giftPrice,
                    giftLocation: res.data.giftLocation,
                    giftComment: res.data.giftComment
                })
            })
            .catch(function (error) {
                console.log(error);
        })
    }

    onChangeUserId(e) {
        //this.setState({ userId: e.target.value })
        this.setState({ userId:  e.target.value})
    }

    onChangeGift(e) {
        //console.log(ENDPOINT_URL)
        console.log(this.state)
        this.setState({ giftName: e.target.value })
    }

    onChangePrice(e) {
        this.setState({ giftPrice: e.target.value })
    }

    onChangeLocation(e) {
        this.setState({ giftLocation: e.target.value })
    }

    onChangeComment(e) {
        this.setState({ giftComment: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
/*
        const [userId, setUserId] = useState("");
        const [giftName, setGiftName] = useState("");
        const [giftPrice, setGiftPrice] = useState("");
        const [giftLocation, setGiftLocation] = useState("");
        const [giftComment, setGiftComment] = useState("");
  */
       //userId: this.state.userId,

        const giftObject = {
            giftId: GIFTID,
            giftName: this.state.giftName,
            giftPrice: this.state.giftPrice,
            giftLocation: this.state.giftLocation,
            giftComment: this.state.giftComment
        };

        console.log(giftObject);
        
        axios.post(ENDPOINT_UPDATE, giftObject)
            .then((res) => {
                console.log(res.data)
            }).catch((error) => {
                console.log(error)
            });
        this.setState({ userId: '', giftName: '', giftPrice: '', giftLocation: '', giftComment: '' })
    }

    render() {
        return (
            <div className="wrapper">
                <form>
                    <div className="form-group">
                        <label>Gift Name</label>
                        <input type="text" value={this.state.giftName} onChange={this.onChangeGift} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="text" value={this.state.giftPrice} onChange={this.onChangePrice} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" value={this.state.giftLocation} onChange={this.onChangeLocation} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Notes</label>
                        <input type="text" value={this.state.giftComment} onChange={this.onChangeComment} className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update Gift" className="btn btn-success btn-block" onClick={this.onSubmit} />
                    </div>
                </form>
            </div>
        )
    }
}