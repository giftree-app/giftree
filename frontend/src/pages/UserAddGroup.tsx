import React, { useState } from "react";
import axios from "axios";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import { connect } from "../data/connect";
import { RouteComponentProps, withRouter } from "react-router";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

// const BASE_URL = 'https://COP4331-1.herokuapp.com/';
// const ENDPOINT_URL = BASE_URL + 'api/addGroup';

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  username?: string;
  userId?: string;
}

interface UserAddGroupProps extends OwnProps, StateProps {}

const UserAddGroup: React.FC<UserAddGroupProps> = ({
  history,
  username,
  userId,
}) => {
  const [groupName, setGroupName] = useState("");
  const [addedGroupName, setAddedGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [groupAdded, setGroupAdded] = useState(false);

  // verification
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [groupNameError, setGroupNameError] = useState(false);
  const [groupCodeError, setGroupCodeError] = useState(false);

  const addGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);

    //console.log('in addgift now');

    if (!groupName) {
      setGroupNameError(true);
    }

    if (!groupCode) {
      setGroupCodeError(true);
    }

    if (groupName && groupCode) {
      const giftObject = {
        userId: userId,
        groupName: groupName,
        groupCode: groupCode,
      };

      const token = await getToken();
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };

      //console.log(giftObject);
      //console.log(history);
      axios
        .post("/api/addGroup", giftObject, config)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setAddedGroupName(groupName);
      setGroupAdded(true);
      setGroupName("");
      setGroupCode("");
    }
  };

  const ShowResult = async (e: React.FormEvent) => {
    //history.push('Wishlist', { direction: "none" });
  };

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

  return (
    <IonPage id="addgroup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Add Gift, {username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={addGroup}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">
                Gift:
              </IonLabel>
              <IonInput
                name="groupName"
                type="text"
                value={groupName}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => setGroupName(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>

            {formSubmitted && groupNameError && (
              <IonText color="danger">
                <p className="ion-padding-start">Gift name is required</p>
              </IonText>
            )}

            <IonItem>
              <IonLabel position="stacked" color="primary">
                Price:
              </IonLabel>
              <IonInput
                name="groupCode"
                type="text"
                value={groupCode}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => setGroupCode(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>

            {formSubmitted && groupCodeError && (
              <IonText color="danger">
                <p className="ion-padding-start">Gift price is required</p>
              </IonText>
            )}
          </IonList>
          <IonRow>
            <IonText>
              {groupAdded ? "Added [" + addedGroupName + "] to wishlist!" : ""}
            </IonText>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">
                Add Group
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton href="/tabs/grouplist" expand="block">
                Groups
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default connect<StateProps, {}, OwnProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    groupId: state.user.groupId,
  }),
  component: withRouter(UserAddGroup),
});
