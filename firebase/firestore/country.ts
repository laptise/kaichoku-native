class Country {
  code: number;
  name: string;
  constructor(code: number, name: string) {
    this.code = code;
    this.name = name;
  }
}
const Converter = {
  toFirestore: function (trade: Country) {
    return {
      code: trade.code,
      name: trade.name,
    };
  },
  fromFirestore: function (
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Country {
    const data = snapshot.data(options);
    return new Country(data.code, data.name);
  },
};

export { Country as Class, Converter };
