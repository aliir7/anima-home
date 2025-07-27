import { randomBytes } from "crypto";

export default function generateToken(length = 32) {
  const generatedToken = randomBytes(length).toString("hex");
  return generatedToken;
}
