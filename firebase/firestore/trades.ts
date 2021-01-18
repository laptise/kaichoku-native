import { PlaceInformation } from "../../components/modals/PlaceSetter";

export class Step {
  at: Date;
  constructor(at: Date) {
    this.at = at;
  }
}

class Steps {
  0: Step;
  1?: Step;
  2?: Step;
  3?: Step;
  4?: Step;
  5?: Step;
  6?: Step;
  7?: Step;
  8?: Step;
  9?: Step;
  constructor(steps: Step[]) {
    steps.forEach((step, index) => {
      const object = this as any;
      object[index] = step;
    });
  }

  get length() {
    let length = 0;
    for (const [key, value] of Object.entries(this)) {
      length = Number(key);
    }
    return length;
  }
}

class Message {
  _id: string;
  createdAt: Date;
  text: string;
  user: any;
  viewd: string[];
  constructor(_id: string, createdAt: Date, text: string, user: any, viewd: string[]) {
    this._id = _id;
    this.createdAt = createdAt;
    this.text = text;
    this.user = user;
    this.viewd = viewd;
  }
}

export class TradeStatus {
  at: Date;
  action: string;
  step: number;
  constructor(at: Date, action: string, step: number) {
    this.at = at;
    this.action = action;
    this.step = step;
  }
}

export const tradeStatusConverter = {
  toFirestore: (tradeStatus: TradeStatus) => {
    return {
      at: tradeStatus.at,
      action: tradeStatus.action,
      step: tradeStatus.step,
    };
  },
  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): TradeStatus => {
    const data = snapshot.data(options);
    return new TradeStatus(data.at.toDate(), data.action, data.step);
  },
};

function stepsConverter(steps: any) {
  let stepArray = [] as Step[];
  if (steps)
    for (const [key, value] of Object.entries(steps)) {
      const step = steps[key];
      const newStep = new Step(step["at"].toDate()) as any;
      for (const [stepKey, stepValue] of Object.entries(steps[key])) {
        if (stepKey !== "at") {
          newStep[stepKey] = stepValue;
        }
      }
      stepArray.push(newStep);
    }
  return stepArray.length > 0 ? new Steps(stepArray) : null;
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
  requesterUnread: number;
  catcherUnread: number;
  steps: Steps;
  placeInfo: PlaceInformation;
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
    messages: Message[],
    requesterUnread: number,
    catcherUnread: number,
    steps: Steps,
    placeInfo: PlaceInformation
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
    this.requesterUnread = requesterUnread;
    this.catcherUnread = catcherUnread;
    this.steps = steps;
    this.placeInfo = placeInfo;
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
      catcherUnread: trade.catcherUnread,
      requesterUnread: trade.catcherUnread,
      steps: trade.steps,
      placeInfo: trade.placeInfo,
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
      data.messages,
      data.requesterUndrea,
      data.catcherUnread,
      stepsConverter(data.steps),
      data.placeInfo
    );
  },
};

export { Trade as Class, Converter, Message };
