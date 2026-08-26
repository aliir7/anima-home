INSERT INTO account (
  id,
  "userId",
  issuer,
  "accountId",
  "providerId",
  password,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  u.id,
  'local:credential',
  u.id::text,
  'credential',
  u.password,
  COALESCE(u."createdAt", now()),
  COALESCE(u."updatedAt", now())
FROM users u
WHERE u.password IS NOT NULL
  AND u.email IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM account a
    WHERE a."userId" = u.id
      AND a."providerId" = 'credential'
  );