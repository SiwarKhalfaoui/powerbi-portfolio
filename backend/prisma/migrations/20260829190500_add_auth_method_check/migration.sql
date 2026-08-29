-- Prevents a user row from ever having neither a password nor a Google
-- link — the one state that would make an account permanently unreachable.
ALTER TABLE "users"
ADD CONSTRAINT "users_has_auth_method"
CHECK ("passwordHash" IS NOT NULL OR "googleId" IS NOT NULL);