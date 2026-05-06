import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UploadResource from './pages/UploadResource';
import ExploreAPI from './pages/ExploreAPI';
import TechLoopLayout from './components/techloop/Layout';
import Marketplace from './pages/techloop/Marketplace';
import PublishProduct from './pages/techloop/PublishProduct';
import UserPanel from './pages/techloop/UserPanel';
import ProductDetails from './pages/techloop/ProductDetails';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<TechLoopLayout />}>
        <Route path="/" element={<Marketplace />} />
        <Route path="/publish" element={<PublishProduct />} />
        <Route path="/panel" element={<UserPanel />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Route>
      <Route path="/edu" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<UploadResource />} />
        <Route path="explore" element={<ExploreAPI />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
