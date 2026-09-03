import Link from "next/link";
export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e4e7e1] bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-black">
          <span className="grid size-9 place-items-center rounded-xl bg-[#e9f0e6]">
            🐾
          </span>
          PetCare Manager
        </Link>
        <nav className="hidden gap-6 text-sm font-semibold md:flex">
          <Link href="#funcionalidades">Funcionalidades</Link>
          <Link href="#como-funciona">Cómo funciona</Link>
        </nav>
        <div className="flex gap-2">
          <Link className="btn btn-secondary text-sm" href="/login">
            Ingresar
          </Link>
          <Link className="btn btn-primary text-sm" href="/registro">
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
}
