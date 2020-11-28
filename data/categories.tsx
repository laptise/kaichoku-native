class IDBuilder {
  id: number;
  constructor() {
    this.id = 0;
  }
  get get() {
    this.id++;
    return this.id - 1;
  }
}

const MajorCategoryId = new IDBuilder();
export class MajorCategory {
  id: number;
  name: string;
  constructor(name: string) {
    this.id = MajorCategoryId.get;
    this.name = name;
  }
}

export const majorCategories = [
  new MajorCategory("의류"),
  new MajorCategory("잡화"),
  new MajorCategory("음식"),
  new MajorCategory("악기"),
  new MajorCategory("전자제품"),
];

const MiddleCategoryId = new IDBuilder();
export class MiddleCategory {
  id: number;
  parentCategory: MajorCategory;
  name: string;
  constructor(parentId: number, name: string) {
    this.id = MiddleCategoryId.get;
    this.name = name;
    this.parentCategory = majorCategories.find(
      (majorCategoriy) => majorCategoriy.id === parentId
    );
  }
}

export const middleCategories = [
  new MiddleCategory(0, "상의/아우터"),
  new MiddleCategory(0, "상의/이너"),
  new MiddleCategory(0, "하의"),
  new MiddleCategory(0, "신발"),
  new MiddleCategory(0, "머리장식"),
  new MiddleCategory(1, "장식품"), //5
  new MiddleCategory(1, "피규어"),
  new MiddleCategory(2, "과자"),
  new MiddleCategory(3, "전자악기"),
  new MiddleCategory(3, "악기"),
  new MiddleCategory(4, "이어폰"),
];

const CategoryId = new IDBuilder();
export class Category {
  id: number;
  name: string;
  parentCategory: MiddleCategory;
  constructor(parentId: number, name: string) {
    this.id = CategoryId.get;
    this.name = name;
    this.parentCategory = middleCategories.find(
      (middleCategory) => middleCategory.id === parentId
    );
  }
}

export const categories = [
  new Category(0, "자켓"),
  new Category(0, "코트"),
  new Category(0, "점퍼"),
  new Category(1, "티셔츠"),
  new Category(1, "후드티"),
  new Category(1, "내복"),
  new Category(2, "바지"),
  new Category(2, "치마"),
  new Category(3, "운동화"),
  new Category(3, "구두"),
  new Category(3, "장화"),
  new Category(3, "슬리퍼"),
];
