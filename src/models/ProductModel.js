export default class EcommerceProduct {
  constructor(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    type,
    desc
  ) {
    this.id = id;
    this.name = name;
    this.price = Number(price);
    this.screen = screen;
    this.backCamera = backCamera;
    this.frontCamera = frontCamera;
    this.img = img;
    this.type = type;
    this.desc = desc;
  }
}
