import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="max-w-[1536px] mx-auto px-8 my-10">{children}</main>
    </div>
  );
}
