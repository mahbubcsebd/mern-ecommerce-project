"use client"

import { logout } from '@/utils/auth';
import Link from 'next/link';

const Header = () => {
    const logoutHandler = async () => {
        const response = await logout();
    }
  return (
    <header className="z-40 bg-background/60 backdrop-blur-md fixed top-0 left-0 right-0 border-b ">
      <div className="container flex h-20 items-center justify-between py-6 ">
        <Link
          href="/"
          className="inline-block text-lg font-medium text-gray-900"
        >
          Ecommerce
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/login">Login</Link>
          <Link href="/register">Sign Up</Link>
          <button
            className=""
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header