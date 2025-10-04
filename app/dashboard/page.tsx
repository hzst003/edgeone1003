import ProtectedPage from '@/components/ProtectedPage';

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-700">只有登录用户才能看到这页内容。</p>
        </div>
      </main>
    </ProtectedPage>
  );
}
