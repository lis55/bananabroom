// Navbar.
"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import LanguageChanger from "./LanguageChanger";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();

  const logoSrc = "/img/logo.jpg";

  return (
    <nav>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo on the left */}
        <Image
          src={logoSrc}
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full"
        />

        {/* Title centered */}
        <Link
          className="text-2xl font-semibold text-gray-800 flex-grow text-center"
          href="/"
        >
          BananaBroom
        </Link>

        {/* SignIn/Out and LanguageChanger on the right */}

        {session ? (
          session.user.service_provider == null ? (
            <>
              <button onClick={() => router.push("/account")}>
                {t("My account")}
              </button>
              <button onClick={() => router.push("/providerform")}>
                {t("Work with us")}
              </button>
              <button onClick={() => signOut()}>{t("SignOut")}</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/account")}>
                {t("My account")}
              </button>
              <button onClick={() => router.push("/provider-account")}>
                {t("My work")}
              </button>
              <button onClick={() => signOut()}>{t("SignOut")}</button>
            </>
          )
        ) : (
          <>
            <button onClick={() => signIn()}>{t("SignIn")}</button>
            <button onClick={() => router.push("/")}>{t("Home")}</button>
          </>
        )}

        <LanguageChanger />
      </div>
    </nav>
  );
}
