import React, { useEffect, useState } from "react";
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
import { Plugins } from "@capacitor/core";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  return JSON.parse(res.value);
}

interface RouterProps extends RouteComponentProps {}

const JoinGroup: React.FC<RouterProps> = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [groupJoined, setGroupJoined] = useState(false);

  // verification
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [groupCodeError, setGroupCodeError] = useState(false);

  useEffect(() => {
    const setValues = async () => {
      let userId = await getFromStorage("userId");
      let username = await getFromStorage("username");
      setUsername(username);
      setUserId(userId);
    };
    setValues();
  }, []);

  const joinGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);

    if (!groupCode) {
      setGroupCodeError(true);
    }

    if (groupCode) {
      const groupObject = {
        groupCode: groupCode,
        userId: userId,
      };

      axios
        .post("/api/userAddGroup", groupObject)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setGroupJoined(true);
      setGroupCode("");
    }
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
            <IonItem>
              <IonLabel position="stacked" color="primary">
                Group code:
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
                <p className="ion-padding-start">Group code is required</p>
              </IonText>
            )}
          </IonList>
          <IonRow>
            <IonText>
              {groupJoined ? "Joined [" + groupCode + "]!" : ""}
            </IonText>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">
                Join Group
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={() => {
                  return <Redirect to={"/tabs/grouplist"} />;
                }}
                expand="block"
              >
                Done!
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(JoinGroup);
