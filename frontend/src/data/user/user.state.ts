export interface UserState {
  isLoggedin: boolean;
  username?: string;
  userId?: string;
  memberWishlistId?: string;
  giftId?: string;
  groupId?: string;
  reload: boolean;
  darkMode: boolean;
  loading: boolean;
};
