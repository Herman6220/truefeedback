"use client";

import Link from 'next/link';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User } from "next-auth";
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className=" flex justify-between items-center">
        {/* Left side: Logo / App Name */}
        <a className="text-xl font-bold" href="#">
          Anonymous Message
        </a>

        {/* Right side: Auth info and button */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="sm:inline text-sm font-medium">
                Welcome, {user?.username || user?.email}
              </span>
              <Link href={isDashboard ? "/" : "/dashboard"}>
                <Button className='bg-orange-500 hover:bg-orange-600'>
                  {isDashboard ? "Home" : "Dashboard"}
                </Button>
              </Link>
              <Button onClick={() => signOut()} className="w-auto">
                Log Out
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
