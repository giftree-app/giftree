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
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  return JSON.parse(res.value);
}
interface RouterProps extends RouteComponentProps {}

const AddGroup: React.FC<RouterProps> = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupAdded, setGroupAdded] = useState(false);

  // verification
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [groupNameError, setGroupNameError] = useState(false);

  useEffect(() => {
    const setValues = async () => {
      let userId = await getFromStorage("userId");
      let username = await getFromStorage("username");

      setUserId(userId);
      setUsername(username);
    };
    setValues();
  }, []);

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
      const token = await getFromStorage("ACCESS_TOKEN");
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };
      axios
        .post("/api/addGroup", groupObject, config)
        .then((res) => {
          console.log(res.data);
          setGroupAdded(true);
        })
        .catch((error) => {
          console.log(error);
        });
      return <Redirect to={"/tabs/grouplist"} />;
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
                <p className="ion-padding-start">Group name is required</p>
              </IonText>
            )}
          </IonList>
          <IonRow>
            <IonText>
              {groupAdded ? "Added [" + groupName + "] to groups!" : ""}
            </IonText>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">
                Add Group
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(AddGroup);
