import { Navbar } from "@/components/navbar";
import { Head } from "./head";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3 px-6">
        <div className="text-center text-[10px] text-gray-400">
          <div>
            By using this service you agree with Privacy policy and Terms of use
          </div>
          <div>289 M.1 Koh Phangan, Surat Thai, Thailand</div>
        </div>
        {/* <Link
					isExternal
					className="flex items-center gap-1 text-current"
					href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
					title="nextui.org homepage"
				>
					<span className="text-default-600">Powered by</span>
					<p className="text-primary">NextUI</p>
				</Link> */}
      </footer>
    </div>
  );
}
