class User {
  uid: string;
  email: string;
  nickname: string;
  countryCode: number;
  entryDate: Date;
  comment: string;
  constructor(
    uid: string,
    email: string,
    nickname: string,
    countryCode: number,
    entryDate: Date,
    comment: string
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
      email: user.email,
      nickname: user.nickname,
      countryCode: user.countryCode,
      entryDate: user.entryDate,
      comment: user.comment,
    };
  },
  fromFirestore: function (
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): User {
    const user = snapshot.data(options);
    return new User(
      user.uid,
      user.email,
      user.nickname,
      user.countryCode,
      user.entryDate.toDate(),
      user.comment
    );
  },
};

export { User as Class, Converter };
