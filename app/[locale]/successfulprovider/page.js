'use client'
import { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  console.log(session.user.name)

  return (
    <div className="container mx-auto pt-12">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Image src="/img/banana.jpg" alt="Booking Successful" width={700} height ={700} className="h-auto" />
          <h1 className="text-2xl font-semibold text-center mb-6">Registration was Successful</h1>
          <h2 className="text-1xl font-semibold text-center mb-6">Congratulations {session.user.name}!  you are one step closer to earning money</h2>
          <h2 className="text-1xl font-semibold text-center mb-6">Your application will be reviewed shortly</h2>
        </div>
      </div>
    </div>
  );
}
