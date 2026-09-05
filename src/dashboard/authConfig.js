// Dashboard access control. Credentials are verified server-side by
// /api/login against the DASHBOARD_EMAIL / DASHBOARD_PASSWORD environment
// variables set in the Vercel project — nothing secret lives in this file
// or anywhere else in the client bundle.

export const DASHBOARD_PATH = "/pb-ctrl-8df062900d7e";

export const SESSION_KEY = "pbdash_session";
