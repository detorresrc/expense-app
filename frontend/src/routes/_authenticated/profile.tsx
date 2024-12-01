import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { userQueryOptions } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { data, isPending, error } = useQuery(userQueryOptions);

  if (isPending)
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-xl'>Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-red-500 text-xl'>
          An error occurred: {error.message}
        </div>
      </div>
    );

  return (
    <div className='max-w-md mx-auto bg-secondary shadow-md rounded-lg p-8 mt-10'>
      <h1 className='text-3xl font-bold mb-6 text-left'>Profile</h1>
      <div className='space-y-4'>
        <div className="w-full justify-center items-center flex">
          <Avatar className="h-14 w-14">
            {data.picture && data.picture.length > 0 && (
              <AvatarImage className="bg-primary" src={data.picture} alt={data.given_name} />
            )}
            <AvatarFallback>{data.given_name.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <p className='text-lg'>
          <span className='font-semibold'>Email:</span> {data.email}
        </p>
        <p className='text-lg'>
          <span className='font-semibold'>Given Name:</span> {data.given_name}
        </p>
        <p className='text-lg'>
          <span className='font-semibold'>Family Name:</span> {data.family_name}
        </p>
      </div>
      <Button asChild>
        <a
          href='/api/auth/logout'
          className='block text-center text-blue-500 hover:underline mt-6'
        >
          Logout
        </a>
      </Button>
      
    </div>
  );
}

export default Profile;
