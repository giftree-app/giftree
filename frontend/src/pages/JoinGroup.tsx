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
import { setReload } from "../data/user/user.actions";
import './JoinGroup.scss'

// const BASE_URL = 'https://COP4331-1.herokuapp.com/';
// const ENDPOINT_URL = BASE_URL + 'api/addGroup';

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  username?: string;
  userId?: string;
  reload: boolean;
}

interface DispatchProps {
  setReload: typeof setReload;
}

interface JoinGroupProps extends OwnProps, StateProps, DispatchProps {}

const JoinGroup: React.FC<JoinGroupProps> = ({
  history,
  username,
  userId,
  setReload: setReloadAction,
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [joinedGroupCode, setJoinedGroupCode] = useState("");
  const [groupJoined, setGroupJoined] = useState(false);

  // verification
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [groupNameError, setGroupNameError] = useState(false);
  const [groupCodeError, setGroupCodeError] = useState(false);

  console.log("JoinGroup entry");

  const joinGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);

    if (!groupCode) {
      setGroupCodeError(true);
    }

    if (groupCode) {
      const groupObject = {
        groupCode: groupCode,
        userId: userId
      };

      axios
        .post("/api/userAddGroup", groupObject)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setJoinedGroupCode(groupCode);
      setGroupJoined(true);
      setGroupCode("");
      redirectToGroupList(e);
    }
  };

  const redirectToGroupList = async (e: React.FormEvent) => {
    setReloadAction(true);
    history.push("/tabs/GroupList", { direction: "none" });
  };

  return (
    <IonPage id="joingroup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Join a new group, {username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={joinGroup}>
          <IonList>
            <IonItem className= "joingroup-item">
              <IonLabel position="floating" color="black" className="joingroup-label">
                Group code:
              </IonLabel>
              <IonInput
                name="groupCode"
                className="joingroup-input"
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
                <p className="ion-padding-start">Group code is required</p>
              </IonText>
            )}
          </IonList>
          <IonRow>
            <IonText>
              {groupJoined ? "Joined [" + joinedGroupCode + "]!" : ""}
            </IonText>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">
                Join Group
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton href="/tabs/grouplist" expand="block">
                Done!
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    reload: state.user.reload
  }),
  mapDispatchToProps: {
    setReload
  },
  component: withRouter(JoinGroup),
});
