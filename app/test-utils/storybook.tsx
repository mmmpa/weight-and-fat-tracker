import type { RouteObject } from "react-router";
import { createMemoryRouter, RouterProvider } from "react-router";

interface WithRouterProps {
  children: React.ReactNode;
  initialEntries?: string[];
  initialIndex?: number;
}

export function WithRouter({
  children,
  initialEntries = ["/"],
  initialIndex = 0,
}: WithRouterProps) {
  const routes: RouteObject[] = [
    {
      path: "*",
      element: children,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries,
    initialIndex,
  });

  return <RouterProvider router={router} />;
}
