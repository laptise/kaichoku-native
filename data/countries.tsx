export class Country {
  code: number;
  name: string;
  constructor(code: number, name: string) {
    this.code = code;
    this.name = name;
  }
}

const countries = [new Country(81, "Japan"), new Country(82, "Korea")];

export default countries;
