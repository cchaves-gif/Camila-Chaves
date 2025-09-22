
export enum GameStatus {
  SETUP,
  PLAYING,
  WON,
  LOST,
}

export enum CardStatus {
  HIDDEN,
  VISIBLE,
  MATCHED,
}

export interface CardInfo {
  id: number;
  imageId: number;
  imageUrl: string;
  status: CardStatus;
}

export interface UserData {
  name: string;
  email: string;
  university: string;
}
