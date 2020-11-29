class User {
  comment: string;
  countryCode: number;
  email: string;
  entryDate: Date;
  nickname: string;
  uid: string;
  constructor(
    uid: string,
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
    this.uid = uid;
  }
}
const Converter = {
  toFirestore: function (user: User) {
    return {
      uid: user.uid,
      comment: user.comment,
      countryCode: user.countryCode,
      email: user.email,
      entryDate: user.entryDate,
      nickname: user.nickname,
    };
  },
  fromFirestore: function (
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): User {
    const user = snapshot.data(options);
    return new User(
      user.comment,
      user.countryCode,
      user.email,
      user.entryDate.toDate(),
      user.nickname,
      user.uid
    );
  },
};

export { User as Class, Converter };
