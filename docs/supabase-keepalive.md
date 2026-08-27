# Supabase keepalive

This project has a protected endpoint and a daily GitHub Actions workflow to create real Supabase activity while the project remains on the Free plan.

## One-time setup

1. In Vercel, add `SUPABASE_KEEPALIVE_SECRET` as an environment variable for Production. Use a long random value.
2. In the GitHub repository, open `Settings` -> `Secrets and variables` -> `Actions` and add:
   - `APP_KEEPALIVE_URL`: `https://app.smartworkia.com/api/internal/keepalive`
   - `SUPABASE_KEEPALIVE_SECRET`: exactly the same value used in Vercel.
3. Open the `Supabase keepalive` workflow in GitHub Actions and run it once manually. It should return a successful response.

The endpoint does not expose Supabase data. It only accepts the shared secret and runs a minimal privileged Auth query.

## Important

This reduces the risk of Free-plan automatic pausing but it is not an availability guarantee. When SmartWorkIA has active clients, upgrade the Supabase organization to Pro and keep normal monitoring in place.
