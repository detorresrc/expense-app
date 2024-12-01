import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FC } from "react";

const Login: FC = () => {
  return (
    <div className="m-4">
      <h1>You have to login or register</h1>

      <div className="flex flex-row space-x-4">
      <Button asChild>
        <a
          href='/api/auth/login'
          className='block text-center text-blue-500 hover:underline mt-6'
        >
          Login
        </a>
      </Button>

      <Button asChild>
        <a
          href='/api/auth/register'
          className='block text-center text-blue-500 hover:underline mt-6'
        >
          Register
        </a>
      </Button>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return { user: data };
    } catch (e) {
      console.error(e);
      return { user: null };
    }
  },
  component: () => {
    const { user } = Route.useRouteContext();

    if (!user) return <Login></Login>;

    return <Outlet />;
  },
});
