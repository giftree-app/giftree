import { UserActions } from './user.actions';
import { UserState } from './user.state';

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-username':
      return { ...state, username: action.username };
    case 'set-userid':
      return { ...state, userId: action.userId };
      case 'set-memberwishlistid':
        return { ...state, userId: action.memberWishlistId };
    case 'set-giftid':
      return { ...state, giftId: action.giftId };
    case 'set-groupid':
        return { ...state, groupId: action.groupId };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    case 'set-is-loggedin':
      return { ...state, isLoggedin: action.loggedIn };
    case 'set-reload':
      return { ...state, reload: action.reload };
  }
}