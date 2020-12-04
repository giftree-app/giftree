import React, { useState } from "react";
import axios from "axios";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonRow,
  IonCol,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
} from "@ionic/react";
import "./Login.scss";
import { setIsLoggedIn, setUsername } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface LoginProps extends OwnProps, DispatchProps {}

const Login: React.FC<LoginProps> = ({
  setIsLoggedIn,
  history,
  setUsername: setUsernameAction,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [address1Error, setAddress1Error] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);

    if (!username) {
      setUsernameError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
    if (!email) {
      setEmailError(true);
    }
    if (!firstName) {
      setFirstNameError(true);
    }
    if (!lastName) {
      setLastNameError(true);
    }
    if (!address1) {
      setAddress1Error(true);
    }
    if (!address2) {
      setAddress2Error(true);
    }

    if (username && password && firstName && lastName && email && address1) {
      let url = "https://cop4331-1.herokuapp.com/api/register";

      const req = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: password,
        email: email,
        address1: address1,
        address2: address2,
      };

      axios
        .post(url, req)
        .then(async function () {
          await setIsLoggedIn(true);
          await setUsernameAction(username);
          history.push("/tabs/login", { direction: "none" });
        })
        .catch(function () {
          alert("Could not create account. Please try again");
        });
    }
  };

  return (
    <IonPage id="signup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle><img src="assets/img/appicon.svg" className="toolbar-logo" /></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
        </div>
        <IonLabel>
          <h1 className= "header">SIGN UP</h1>

        </IonLabel>

        <form noValidate onSubmit={login}>
          <IonList>
            <IonItem className="signup-fields">
              <IonInput
                name="firstName"
                type="text"
                placeholder= "FIRST NAME"
                value={firstName}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => {
                  setFirstName(e.detail.value!);
                  setFirstNameError(false);
                }}
                required
              ></IonInput>
                            <IonInput
                name="lastName"
                type="text"
                placeholder= "LAST NAME"
                value={lastName}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => {
                  setLastName(e.detail.value!);
                  setLastNameError(false);
                }}
                required
              ></IonInput>
            </IonItem >

            {formSubmitted && firstNameError && (
              <IonText color="danger">
                <p className="ion-padding-start">First name is required</p>
              </IonText>
            )}

            {formSubmitted && lastNameError && (
              <IonText color="danger">
                <p className="ion-padding-start">Last name is required</p>
              </IonText>
            )}

            <IonItem className="signup-fields">
              <IonInput
                name="email"
                type="text"
                placeholder= "EMAIL"
                value={email}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => {
                  setEmail(e.detail.value!);
                  setEmailError(false);
                }}
                required
              ></IonInput>
            </IonItem>

            {formSubmitted && emailError && (
              <IonText color="danger">
                <p className="ion-padding-start">Email is required</p>
              </IonText>
            )}


            <IonItem className="signup-fields">
              <IonInput
                name="username"
                type="text"
                placeholder= "USERNAME"
                value={username}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => {
                  setUsername(e.detail.value!);
                  setUsernameError(false);
                }}
                required
              ></IonInput>
            <IonInput
              name="password"
              type="password"
              placeholder= "PASSWORD"
              value={password}
              onIonChange={(e) => {
                setPassword(e.detail.value!);
                setPasswordError(false);
              }}
              ></IonInput>
            </IonItem>

            {formSubmitted && usernameError && (
              <IonText color="danger">
                <p className="ion-padding-start">Username is required</p>
              </IonText>
            )}



            {formSubmitted && passwordError && (
              <IonText color="danger">
                <p className="ion-padding-start">Password is required</p>
              </IonText>
            )}


            <IonItem className="signup-fields">
              <IonInput
                name="address1"
                type="text"
                placeholder= "ADDRESS LINE 1"
                value={address1}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => {
                  setAddress1(e.detail.value!);
                  setAddress1Error(false);
                }}
                required
              ></IonInput>
            </IonItem>

            {formSubmitted && address1Error && (
              <IonText color="danger">
                <p className="ion-padding-start">Address is required</p>
              </IonText>
            )}

            <IonItem className="signup-fields">
              <IonInput
                name="address2"
                type="text"
                placeholder= "ADDRESS LINE 2"
                value={address2}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => {
                  setAddress2(e.detail.value!);
                  setAddress2Error(false);
                }}
                ></IonInput>
            </IonItem>
              {formSubmitted && address1Error && (
                <IonText color="danger">
                  <p className="ion-padding-start">Address is required</p>
                </IonText>
              )}
          </IonList>


              <IonButton type="submit" className="loginbtn" expand="block" style={{borderRadius:"40px"}}>
                Go!
              </IonButton>

        </form>
        <div className= "reset" style={{paddingTop:"40px"}}>
          <a href="login" className= "resetText" >Already have a Giftree account? <b>Log in!</b> </a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername,
  },
  component: Login,
});
