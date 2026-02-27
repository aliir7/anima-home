export function calculateProductPrice(price: number, discountPercent?: number) {
  const productPrice = price;
  const taxPrice = 0.1 * productPrice;
  const benefitsPercent = 0.15 * productPrice;
  let totalPrice = productPrice + taxPrice + benefitsPercent;
  if (discountPercent !== 0) {
    const discountedPrice = Math.round(
      productPrice * (1 - discountPercent! / 100),
    );

    totalPrice = discountedPrice + taxPrice + benefitsPercent;

    return totalPrice;
  }

  return totalPrice;
}
