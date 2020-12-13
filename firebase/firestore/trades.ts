class Message {
  _id: string;
  createdAt: Date;
  text: string;
  user: any;
  viewd: string[];
  constructor(
    _id: string,
    createdAt: Date,
    text: string,
    user: any,
    viewd: string[]
  ) {
    this._id = _id;
    this.createdAt = createdAt;
    this.text = text;
    this.user = user;
    this.viewd = viewd;
  }
}
class Trade {
  name: string;
  place: string;
  price: number;
  fee: number;
  title: string;
  created_at: Date;
  requester_id: string;
  id: string;
  catcher: string;
  images: string[];
  messages: Message[];
  constructor(
    id: string,
    name: string,
    place: string,
    price: number,
    fee: number,
    title: string,
    created_at: Date,
    requester_id: string,
    catcher: string,
    images: string[],
    messages?: Message[]
  ) {
    this.id = id;
    this.name = name;
    this.place = place;
    this.price = price;
    this.fee = fee;
    this.title = title;
    this.created_at = created_at;
    this.requester_id = requester_id;
    this.catcher = catcher;
    this.images = images;
    this.messages = messages;
  }
}
const Converter = {
  toFirestore: function (trade: Trade) {
    return {
      id: trade.id,
      name: trade.name,
      place: trade.place,
      price: trade.price,
      fee: trade.fee,
      title: trade.title,
      created_at: trade.created_at,
      requester_id: trade.requester_id,
      catcher: trade.catcher,
      images: trade.images,
    };
  },
  fromFirestore: function (
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Trade {
    const data = snapshot.data(options);
    return new Trade(
      data.id,
      data.name,
      data.place,
      data.price,
      data.fee,
      data.title,
      data.created_at.toDate(),
      data.requester_id,
      data.catcher,
      data.images,
      data.messages
    );
  },
};

export { Trade as Class, Converter, Message };
