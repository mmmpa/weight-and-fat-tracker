import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("monthly", "routes/monthly.tsx"),
  route("monthly/:year/:month", "routes/monthly.$year.$month.tsx"),
  route("graph", "routes/graph.tsx"),
  route("export-import", "routes/export-import.tsx"),
  route("config", "routes/config.tsx"),
  route("share", "routes/share.tsx"),
] satisfies RouteConfig;
