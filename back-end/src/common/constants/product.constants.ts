export const products = [
  {
    name: "Kurta",
    description: "BIBA WOMEN PRINTED STRAIGHT SALWAR KURTA DUPATTA",
    image:
      "https://images.unsplash.com/photo-1631269535906-35701ba80735?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rate: 3.5,
  },
  {
    name: "Shirt",
    description: "Fabindia Men Cotton Striped Slim Fit Shirt Navy",
    image:
      "https://images.unsplash.com/photo-1602810320073-1230c46d89d4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rate: 4,
  },
];

export enum productCoupon {
  FIRST50 = "FIRST50",
  PATRON50 = "PATRON50",
  REPEAT80 = "REPEAT80",
}

export const productSizes = [
  { name: "S", sequence: 1 },
  { name: "M", sequence: 2 },
  { name: "L", sequence: 3 },
  { name: "XL", sequence: 4 },
  { name: "XXL", sequence: 5 },
];

export const productColor = ["Red", "Blue", "White", "Black"];
export const productCoupons = [
  {
    code: productCoupon.FIRST50,
    discountPercentage: 50,
    maxUsage: 1,
    description: "The price of the item gets discounted by 50%",
  },
  {
    code: productCoupon.PATRON50,
    discountPercentage: 50,
    maxUsage: 1,
    description: "The price of the item gets discounted by 50%",
  },
  {
    code: productCoupon.REPEAT80,
    discountPercentage: 80,
    maxUsage: Infinity,
    description: "The price of the item gets discounted by 80%",
  },
];
