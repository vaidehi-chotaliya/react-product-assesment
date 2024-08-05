export const QUERY_KEYS = {
  product_list: ['list'],
  product_detail: (id: string) => [`detail-${id}`],
  coupon_list: ['coupon'],
  coupon_applied: ['coupon_applied'],
  order_confirmed: ['order_confirmed'],
  order_detail: (id: string) => [`detail-${id}`]
};
