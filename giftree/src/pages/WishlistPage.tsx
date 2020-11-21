import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import AddGift from "../components/addgift.component";
import UpdateGift from "../components/updategift.component";
import Gifts from "../components/gifts.component";


function WishlistPage() {
  return (<Router>
    <div className="Wishlist">
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand">Wishlist</a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <Link className="nav-link" to={"/addgift"}>Add Gift</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/updategift"}>Update Gift</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/gifts"}>Gifts</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Switch>
              <Route exact path='/' component={AddGift} />
              <Route path="/addgift" component={AddGift} />
              <Route path="/gifts" component={Gifts} />
              <Route path="/updategift" component={UpdateGift} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  </Router>
  );
}

export default WishlistPage;
//*/
//////////////////////////////////////////////////////////////////////////////////////////
  /*
  gift = {
    "giftGot": "",
    "giftName": "",
    "giftPrice": ""
  };
*/
/*
const sendGetRequest = () => {
  return axios({
    url: ENDPOINT_URL,
    method: 'get'
  }).then(response => {
    console.log(response);
    return response.data;
  })
};

const sendPostRequest = async () => {
  try {
      const resp = await axios.post(ENDPOINT_URL, { userId: UserId }).then((response) => 
      {
        console.log(response);
        //gift = response.data;
      }, (error) => 
      {
        console.log(error);
      });        
  } catch (err) {
      // Handle Error Here
      console.error(err);
  }
};

  export default class WishlistPage extends React.Component {
    state = { gifts: [] as string[]
    }

    componentDidMount()
    {
      axios.post(ENDPOINT_URL).then(res => {
        const gifts = res.data;
        this.setState({gifts});
      })
    }
    render() {
      return (
        <ul>
          {this.state.gifts.map(gift => <li> {gift}</li>)}
        </ul>
      )
    }
  }
  */
/*
const WishlistPage: React.FunctionComponent = () => {

  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    sendPostRequest();
  }, []);
  
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Wishlist</IonTitle>
      </IonToolbar>
    </IonHeader>

  );
};

export default WishlistPage;
*/