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
  IonAlert,
  IonCard,
  IonCardHeader,
  IonCol,
} from "@ionic/react";
import { GroupMember } from "../models/GroupMember";
import { Plugins } from "@capacitor/core";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
const { Storage } = Plugins;

async function getFromStorage(key: string) {
  const res = await Storage.get({ key: key });
  if (res == null) return "";
  return JSON.parse(res.value);
}

interface RouterProps extends RouteComponentProps {}

const EditGroup: React.FC<RouterProps> = () => {
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showMemberAlert, setShowMemberAlert] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentMemberFirstName, setCurrentMemberFirstName] = useState("");
  const [currentMemberLastName, setCurrentMemberLastName] = useState("");

  useEffect(() => {
    const setValues = async () => {
      let groupId = await getFromStorage("currentGroupId");
      setGroupId(groupId);
    };
    const getGroup = async () => {
      const token = await getFromStorage("ACCESS_TOKEN");
      const userId = await getFromStorage("userId");
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };

      axios
        .post("/api/getGroupInfo", { groupId: groupId, userId: userId }, config)
        .then((res) => {
          console.log(res);
          setGroupName(res.data.groupName);
          setGroupCode(res.data.groupCode);
          setMembers(res.data.members);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    setValues();
    getGroup();
  }, [groupId]);

  const deleteGroupMember = async () => {
    const token = await getFromStorage("ACCESS_TOKEN");
    const currentMemberId = await getFromStorage("currentMemberId");
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };

    axios
      .post(
        "/api/deleteGroupMember",
        { groupId: groupId, userId: currentMemberId },
        config
      )
      .then((res) => {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteGroup = async () => {
    const token = await getFromStorage("ACCESS_TOKEN");
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };

    axios
      .post("/api/deleteGroup", { groupId: groupId }, config)
      .then((res) => {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    const groupObject = {
      groupId: groupId,
      groupName: groupName,
    };

    const token = await getFromStorage("ACCESS_TOKEN");
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };

    axios
      .post("/api/updateGroupName", groupObject, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setCurrentMember = (member: GroupMember) => {
    setCurrentMemberFirstName(member.firstName);
    setCurrentMemberLastName(member.lastName);
  };

  async function clearValues() {
    await Storage.remove({ key: "currentGroupId" });
  }

  return (
    <IonPage id="editgroup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>
            {groupName} - {groupCode}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={updateGroup}>
          <IonItem>
            <IonLabel position="stacked" color="primary">
              Edit Group name:
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
          <IonList lines="none">
            {members &&
              members.length > 0 &&
              members.map((member) => (
                <IonCard className="groupmember-card" key={member.userId}>
                  <IonCardHeader key={member.userId}>
                    <IonCol size="12" size-md="6" key={member.userId}>
                      <IonItem
                        button
                        lines="none"
                        className="group-item"
                        detail={false}
                        key={member.userId}
                        onClick={() => setCurrentMember(member)}
                      >
                        <IonLabel>
                          <h3>
                            {member.firstName} {member.lastName}
                          </h3>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonCardHeader>
                </IonCard>
              ))}
          </IonList>
          <IonRow>
            <IonButton type="submit">Update Group</IonButton>
          </IonRow>
          <IonRow>
            <IonButton onClick={() => setShowMemberAlert(true)}>
              Delete Member
            </IonButton>
          </IonRow>
          <IonRow>
            <IonButton onClick={() => setShowAlert(true)}>
              Delete Group
            </IonButton>
          </IonRow>
          <IonRow>
            <IonButton
              onClick={() => {
                clearValues();
                return <Redirect to={"/tabs/grouplist"} />;
              }}
            >
              Back to Groups
            </IonButton>
          </IonRow>
        </form>
      </IonContent>
      <IonAlert
        isOpen={showMemberAlert}
        header="Delete member?"
        inputs={[
          {
            type: "text",
            name: "member",
            value: currentMemberFirstName + " " + currentMemberLastName,
            placeholder: "",
          },
        ]}
        buttons={[
          "No",
          {
            text: "Yes",
            handler: () => {
              deleteGroupMember();
            },
          },
        ]}
        onDidDismiss={() => setShowMemberAlert(false)}
      />
      <IonAlert
        isOpen={showAlert}
        header="Delete Group?"
        buttons={[
          "No",
          {
            text: "Yes",
            handler: () => {
              deleteGroup();
              return <Redirect to={"/tabs/grouplist"} />;
            },
          },
        ]}
        onDidDismiss={() => setShowAlert(false)}
      />
    </IonPage>
  );
};

export default withRouter(EditGroup);
