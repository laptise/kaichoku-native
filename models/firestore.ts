/**Trades */
export class Trade {
  name: string;
  place: string;
  price: number;
  fee: number;
  title: string;
  created_at: Date;
  requester_id: string;
  constructor(
    name: string,
    place: string,
    price: number,
    fee: number,
    title: string,
    created_at: Date,
    requester_id: string
  ) {
    this.name = name;
    this.place = place;
    this.price = price;
    this.fee = fee;
    this.title = title;
    this.created_at = created_at;
    this.requester_id = requester_id;
  }
}
export const TradeConverter = {
  toFirestore: function (trade: Trade) {
    return {
      name: trade.name,
      place: trade.place,
      price: trade.price,
      fee: trade.fee,
      title: trade.title,
      created_at: trade.created_at,
      requester_id: trade.requester_id,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data: Trade = snapshot.data(options);
    return new Trade(
      data.name,
      data.place,
      data.price,
      data.fee,
      data.title,
      data.created_at,
      data.requester_id
    );
  },
};
/**User */
export class User {
  comment: string;
  countryCode: number;
  email: string;
  entryDate: Date;
  nickname: string;
  constructor(
    comment: string,
    countryCode: number,
    email: string,
    entryDate: Date,
    nickname: string
  ) {
    this.comment = comment;
    this.countryCode = countryCode;
    this.email = email;
    this.entryDate = entryDate;
    this.nickname = nickname;
  }
}
export const UserConverter = {
  toFirestore: function (user: User) {
    return {
      comment: user.comment,
      countryCode: user.countryCode,
      email: user.email,
      entryDate: user.entryDate,
      nickname: user.nickname,
    };
  },
  fromFirestore: function (snapshot, options) {
    const user: User = snapshot.data(options);
    return new User(
      user.comment,
      user.countryCode,
      user.email,
      user.entryDate,
      user.nickname
    );
  },
};
