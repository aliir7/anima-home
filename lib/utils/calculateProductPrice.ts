export function calculateProductPrice(price: number, discountPercent?: number) {
  const productPrice = price;
  const taxPrice = 0.1 * productPrice + 8000;

  let totalPrice = productPrice + taxPrice;
  if (discountPercent !== 0) {
    const discountedPrice = Math.round(
      productPrice * (1 - discountPercent! / 100),
    );

    totalPrice = discountedPrice + taxPrice;

    return totalPrice;
  }

  return totalPrice;
}
