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
import { setGroupId, setMemberWishlistId, setReload } from "../data/user/user.actions";
import { GroupMember } from "../models/GroupMember";
import { connect } from "../data/connect";
import { RouteComponentProps, withRouter } from "react-router";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

// const BASE_URL = 'https://COP4331-1.herokuapp.com/';
// const ENDPOINT_GET = BASE_URL + 'api/getGroupInfo';
// const ENDPOINT_UPDATE = BASE_URL + 'api/updateGroupName';
// const ENDPOINT_DELETE = BASE_URL + 'api/deleteGroup';

interface GroupMembersProps {
  members: GroupMember[];
}

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  groupId?: string;
  userId?: string;
  reload: boolean;
}

interface DispatchProps {
  setGroupId: typeof setGroupId;
  setMemberWishlistId: typeof setMemberWishlistId;
  setReload: typeof setReload;
}

interface UpdateGroupProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    GroupMembersProps {}

const EditGroup: React.FC<UpdateGroupProps> = ({
  history,
  groupId,
  userId,
  setGroupId: setGroupIdAction,
  setReload: setReloadAction,
  setMemberWishlistId: setMemberWishlistIdAction
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showMemberAlert, setShowMemberAlert] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentMemberId, setCurrentMemberId] = useState("");
  const [currentMemberFirstName, setCurrentMemberFirstName] = useState("");
  const [currentMemberLastName, setCurrentMemberLastName] = useState("");

  //console.log("EditGroup entry");

  const deleteGroupMember = async () => {
    //console.log('EditGroup: in deleteGroup');
    const token = await getToken();
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
    //console.log('EditGroup: in deleteGroup');
    const token = await getToken();
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

    //console.log(giftObject);
    const token = await getToken();
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

  useEffect(() => {
    if (isLoading === false) {
      const getGroup = async () => {
        //console.log("EditGroup: in getGroup: groupId: " + groupId);
        //console.log("EditGroup: in getGroup: userId: " + userId);
        const token = await getToken();
        const config = {
          headers: { authorization: `Bearer ${token}` },
        };

        axios
          .post(
            "/api/getGroupInfo",
            { groupId: groupId, userId: userId },
            config
          )
          .then((res) => {
            //console.log(res);
            //console.log("EditGroup: in getGroup: groupName: " + groupName);
            //console.log("EditGroup: in getGroup: data: " + res.data);
            setGroupName(res.data.groupName);
            setGroupCode(res.data.groupCode);
            setMembers(res.data.members);
            setIsLoaded(true);
          })
          .catch(function (error) {
            console.log(error);
          });
      };

      getGroup();
      setIsLoading(true);
    }
    return () => {}
  }, [groupId, userId, isLoading]);

  const selectMember = (e: any) => {
    console.log("clicked on: " + e.member);
    //setMember(e.member);
    setCurrentMemberId(e.member.userId);
    setCurrentMemberFirstName(e.member.firstName);
    setCurrentMemberLastName(e.member.lastName);
    putInStorage("MEMBER_ID", e.member.userId);
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

  const redirectToGroupMemberList = async (e: React.FormEvent) => {
    setReloadAction(true);
    setGroupIdAction(undefined);
    //history.push("/tabs/EditGroup", { direction: "none" });
  };

  /*
  const getFromStorage = async () {
      const res = await Storage.get({ key: "userId" });
      if (res.value != null) setIsAuthorized(true);
    }
    checkAuthentication();
  }, []);
*/
  
const putInStorage = async (key: string, value: any) => {
    await Storage.set({
      key: key,
      value: JSON.stringify({
        value,
      }),
    });
  };

  //goToWishList(memberId: member.userId)
  const goToMemberWishList = async (e: any) => {
    let memberId = e.memberId;
    console.log('memberId: ' + currentMemberId);
    setReloadAction(true);
    setMemberWishlistId(memberId);
    setMemberWishlistIdAction(memberId);
    setGroupIdAction(groupId);
    putInStorage("LOAD_ON_ENTRY", 'true');
    //history.push("/tabs/memberwishlist", { direction: "none" });
  };

  if (isLoaded === false) {
    return <div> </div>;
  } else {
    let temp = members;//.filter((member) => (member.userId != userId? true : false));

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
              {temp &&
                temp.filter((member) => (member.userId !== userId? true : false)).map((member) => (
                  <IonCard className="groupmember-card" key={member.userId}>
                    <IonCardHeader key={member.userId}>
                      <IonCol size="6" size-md="4" key={member.userId}>
                        <IonItem
                          button
                          lines="none"
                          className="group-item"
                          detail={false}
                          key={member.userId}
                          onClick={() => selectMember({ member: member })}
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
              <IonButton routerLink="/tabs/memberwishlist" routerDirection="none" onClick={() => goToMemberWishList( { memberId: currentMemberId} )}>view {currentMemberFirstName} {currentMemberLastName} wishlist</IonButton>
            </IonRow>
            <IonRow>
              <IonButton onClick={() => setShowMemberAlert(true)}>
                delete member
              </IonButton>
            </IonRow>
            <IonRow>
              <IonButton onClick={() => setShowAlert(true)}>
                delete group
              </IonButton>
            </IonRow>
            <IonRow>
              <IonButton routerLink="/tabs/Grouplist">Groups</IonButton>
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
              handler: (data: any) => {
                deleteGroupMember();
                redirectToGroupMemberList(data);
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
              handler: (data: any) => {
                deleteGroup();
                redirectToGroupList(data);
              },
            },
          ]}
          onDidDismiss={() => setShowAlert(false)}
        />
      </IonPage>
    );
  }
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    groupId: state.user.groupId,
    userId: state.user.userId,
    reload: state.user.reload,
  }),
  mapDispatchToProps: {
    setGroupId,
    setMemberWishlistId,
    setReload,
  },
  component: withRouter(EditGroup),
});
