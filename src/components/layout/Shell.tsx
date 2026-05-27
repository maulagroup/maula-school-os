export default function Shell({
  children,
  sidebar,
  topbar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-secondary-50">
      <aside className="hidden md:flex w-64 bg-white border-r border-secondary-200 flex-col">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-secondary-200 flex-shrink-0">
          {topbar}
        </header>
        <main className="flex-1 overflow-auto p-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
