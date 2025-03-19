import { FiLogOut } from "react-icons/fi";
import { auth, signOut } from "@/auth";
import Image from "next/image";

const Header = async () => {
  const session = await auth();

  return (
    <header className="bg-mintyTeal h-[8dvh] w-full flex items-center justify-between px-6 text-midnightBlue">
      <div className="flex items-center">
        <Image
          src="/assets/film.svg"
          alt="Cinema Guru Logo"
          width={32}
          height={32}
          priority
        />
        <h1 className="text-xl md:text-2xl font-bold ml-2">Cinema Guru</h1>
      </div>

      {/* Welcome message and Logout */}
      <div className="flex items-center space-x-4">
        {session?.user ? (
          <>
            <span className="sr-only">User is logged in</span>
            <span aria-live="polite">Welcome, {session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="flex items-center space-x-2 text-midnightBlue-500 hover:text-midnightBlue-700 transition"
                aria-label="Logout"
              >
                <FiLogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </>
        ) : (
          <span aria-live="assertive">Loading...</span>
        )}
      </div>
    </header>
  );
};

export default Header;