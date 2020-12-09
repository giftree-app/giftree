import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonCol,
  IonCardHeader,
  IonCard,
} from "@ionic/react";
import "./GroupList.scss";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { Group } from "../models/Group";
import { Plugins } from "@capacitor/core";
import { Redirect } from "react-router-dom";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  return JSON.parse(res.value);
}

async function putInStorage(key: string, value: any) {
  await Storage.set({
    key: key,
    value: JSON.stringify({
      value,
    }),
  });
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getList = async () => {
      const token = await getFromStorage("ACCESS_TOKEN");
      const userId = await getFromStorage("userId");

      const config = {
        headers: { authorization: `Bearer ${token}` },
      };

      axios
        .post("/api/getGroups", { userId: userId }, config)
        .then(async (res) => {
          console.log(res);
          await setGroups(res.data.groups);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getList();
  }, []);

  async function selectGroup(group: Group) {
    await putInStorage("currentGroupId", group.id);
    return <Redirect to={"/tabs/editgroup"} />;
  }

  return (
    <div className="grouplist">
      <IonPage id="grouplist">
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Groups</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList lines="none">
            {groups &&
              groups.length > 0 &&
              groups.map((group) => (
                <IonCard className="group-card" key={group.groupId}>
                  <IonCardHeader key={group.groupId}>
                    <IonCol size="10" size-md="4" key={group.groupId}>
                      <IonItem
                        button
                        lines="none"
                        className="group-item"
                        detail={false}
                        key={group.groupId}
                        onClick={() => {
                          selectGroup(group);
                        }}
                      >
                        <IonLabel>
                          <h1>{group.groupName}</h1>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonCardHeader>
                </IonCard>
              ))}
          </IonList>
          <br />
          <IonCard className="group-button-card">
            <IonCardHeader>
              <IonCol size="12" size-md="6">
                <IonItem
                  button
                  color="medium"
                  onClick={() => {
                    return <Redirect to={"/tabs/addgroup"} />;
                  }}
                >
                  Add Group!
                </IonItem>
                <IonItem
                  button
                  color="medium"
                  onClick={() => {
                    return <Redirect to={"/tabs/joingroup"} />;
                  }}
                >
                  Join Group!
                </IonItem>
              </IonCol>
            </IonCardHeader>
          </IonCard>
        </IonContent>
      </IonPage>
    </div>
  );
};

export default GroupList;
