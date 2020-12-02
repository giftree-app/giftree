
export interface Gift {
  giftId: number;
  giftName?: string;
  giftPrice?: number;
  giftLocation?: string;
  giftComment?: string;
  giftGot?: boolean;
}

export type Gifts = {
  giftId?: number;
  giftName?: string;
  giftPrice?: number;
  giftLocation?: string;
  giftComment?: string;
  giftGot?: boolean;
}