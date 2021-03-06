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
import { connect } from "../data/connect";
import "./GroupList.scss";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { Group } from "../models/Group";
import {
  setUserId,
  setUsername,
  setGroupId,
  setReload,
} from "../data/user/user.actions";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

// const BASE_URL = 'https://COP4331-1.herokuapp.com/';
// const ENDPOINT_URL = BASE_URL + 'api/getGroups';

interface GroupProps {
  groups: Group[];
}

interface StateProps {
  username?: string;
  userId?: string;
  groupId?: string;
  reload: boolean;
}

interface DispatchProps {
  setUsername: typeof setUsername;
  setUserId: typeof setUserId;
  setGroupId: typeof setGroupId;
  setReload: typeof setReload;
}

interface ListLoadingState {
  isListLoading: boolean;
  isListLoaded: boolean;
}
/////////////////////////////////////

interface GroupListProps
  extends StateProps,
    DispatchProps {}
/////////////////////////////////////

const GroupList: React.FC<GroupListProps> = ({
  userId,
  reload,
  setGroupId: setGroupIdAction,
  setReload: setReloadAction,
}) => {
  const [isListLoading, setIsListLoading] = useState(false);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setIsListLoaded(false);
    if (isListLoading === false) {
      //console.log('GroupList->useEffect: reload = ' + {setReload});

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

      const getList = async () => {
        //console.log('in getList()');
        const token = await getToken();
        const config = {
          headers: { authorization: `Bearer ${token}` },
        };
        axios
          .post("/api/getGroups", { userId: userId }, config)
          .then(async (res) => {
            console.log(res);
            await setGroups(res.data.groups);
            await setIsListLoaded(true);
          })
          .catch(function (error) {
            console.log(error);
          });
      };
      getList();
      setIsListLoading(true);
      setReloadAction(false);
    }
    return () => {
      //setIsListLoading(false);
      //setReloadAction(true);
      //setIsListLoaded(false);
    }
  }, [userId, isListLoading, setIsListLoaded, setReloadAction, reload]);

  const onClick = (e: any) => {
    setGroupIdAction(e.groupId);
  };
  ////////////////////////////////

  const goToAddGroup = (e: any) => {
    setIsListLoaded(false);
    setReloadAction(false);
  };
  ////////////////////////////////

  const goToJoinGroup = (e: any) => {
    setIsListLoaded(false);
    setReloadAction(false);
  };
  ////////////////////////////////

  if (isListLoaded === false) {
    return <div />;
  } else {
    // assigning groups to a local temp variable in order to prevent a warning... weird react behavior?
    let temp = groups;
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
              {temp &&
                temp.map((group) => (
                  <IonCard className="group-card" key={group.groupId}>
                    <IonCardHeader key={group.groupId}>
                      <IonCol size="6" size-md="4" key={group.groupId}>
                        <IonItem
                          button
                          lines="none"
                          className="group-item"
                          detail={false}
                          href="/tabs/editgroup"
                          routerDirection="none"
                          key={group.groupId}
                          onClick={() => onClick({ groupId: group.groupId })}
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
                    href="/tabs/addgroup"
                    routerDirection="none"
                    onClick={() => goToAddGroup(true)}
                  >
                    Add Group!
                  </IonItem>
                  <IonItem
                    button
                    color="medium"
                    href="/tabs/joingroup"
                    routerDirection="none"
                    onClick={() => goToJoinGroup(true)}
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
  }
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    userId: state.user.userId,
    groupId: state.user.groupId,
    reload: state.user.reload,
  }),
  mapDispatchToProps: {
    setUsername,
    setUserId,
    setGroupId,
    setReload,
  },
  component: GroupList,
});
