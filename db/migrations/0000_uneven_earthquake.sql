-- Migration D
-- users: migrate phone -> phoneNumber
-- No user data is deleted.

ALTER TABLE "users"
RENAME COLUMN "phone" TO "phoneNumber";