class Trade {
  name: string;
  place: string;
  price: number;
  fee: number;
  title: string;
  created_at: Date;
  requester_id: string;
  id: string;
  catched: boolean;
  constructor(
    id: string,
    name: string,
    place: string,
    price: number,
    fee: number,
    title: string,
    created_at: Date,
    requester_id: string,
    catched: boolean
  ) {
    this.name = name;
    this.place = place;
    this.price = price;
    this.fee = fee;
    this.title = title;
    this.created_at = created_at;
    this.requester_id = requester_id;
    this.id = id;
    this.catched = catched;
  }
}
const Converter = {
  toFirestore: function (trade: Trade) {
    return {
      name: trade.name,
      place: trade.place,
      price: trade.price,
      fee: trade.fee,
      title: trade.title,
      created_at: trade.created_at,
      requester_id: trade.requester_id,
      id: trade.id,
      catched: trade.catched,
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
      data.created_at.toDate() as Date,
      data.requester_id,
      data.catched
    );
  },
};

export { Trade as Class, Converter };
