import crypto from "crypto";

export function generateRandomNumber(preText?: string) {
  const randomCode = crypto.randomInt(100000, 999999).toString();
  if (preText) {
    // ۱. تولید کد 6 رقمی امن با crypto
    return `${preText}-${randomCode}`;
  }

  return randomCode;
}
