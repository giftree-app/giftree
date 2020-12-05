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
import { setGroupId, setReload } from "../data/user/user.actions";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

// const BASE_URL = 'https://COP4331-1.herokuapp.com/';
// const ENDPOINT_URL = BASE_URL + 'api/addGroup';

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  username?: string;
  userId?: string;
  groupId?: string;
  reload: boolean;
}

interface DispatchProps {
  setGroupId: typeof setGroupId;
  setReload: typeof setReload;
}

interface AddGroupProps extends OwnProps, StateProps, DispatchProps {}

const AddGroup: React.FC<AddGroupProps> = ({
  history,
  username,
  userId,
  setGroupId: setGroupIdAction,
  setReload: setReloadAction,
}) => {
  const [groupName, setGroupName] = useState("");
  const [addedGroupName, setAddedGroupName] = useState("");
  const [groupAdded, setGroupAdded] = useState(false);

  // verification
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [groupNameError, setGroupNameError] = useState(false);

  console.log("AddGroup entry");

  const addGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);

    if (!groupName) {
      setGroupNameError(true);
    }

    if (groupName) {
      const groupObject = {
        userId: userId,
        groupName: groupName,
      };
      const token = await getToken();
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };
      axios
        .post("/api/addGroup", groupObject, config)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setAddedGroupName(groupName);
      setGroupAdded(true);
      setGroupName("");
      setGroupIdAction("");
      setReloadAction(true);
      redirectToGroupList(e);
    }
  };

  const redirectToGroupList = async (e: React.FormEvent) => {
    setReloadAction(true);
    history.push("/tabs/GroupList", { direction: "none" });
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
          <IonTitle>Add a new group, {username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={addGroup}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">
                Group name:
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
    groupId: state.user.groupId,
    reload: state.user.reload,
  }),
  mapDispatchToProps: {
    setGroupId,
    setReload,
  },
  component: withRouter(AddGroup),
});
