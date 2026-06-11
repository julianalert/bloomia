import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Pinned per build spec. The installed SDK's types only allow its newer default
  // API version literal; pinning an older valid version is supported at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2024-06-20" as any,
});
