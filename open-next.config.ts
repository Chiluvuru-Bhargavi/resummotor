export default {
  default: { override: { wrapper: "cloudflare-node" } },
  middleware: { external: true, override: { wrapper: "cloudflare-edge" } }
};
