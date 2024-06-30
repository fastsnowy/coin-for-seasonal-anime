export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main className="flex flex-col min-h-screen bg-pink-200">{children}</main>
    </div>
  );
}
