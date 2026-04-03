export const metadata = {
  title: 'ClearStock — Authentication',
  description: 'Login or Sign Up for ClearStock B2B Marketplace.',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
