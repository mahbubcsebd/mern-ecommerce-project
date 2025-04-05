import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Route, Routes } from 'react-router';
import CustomErrorBoundary from './components/errorHandler/ErrorBoundary';
import Layout from './components/layouts/Layout';
import About from './components/pages/About';
import FaqPage from './components/pages/FaqPage';
import Home from './components/pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <CustomErrorBoundary>
        <Layout>
          <Routes>
            <Route
              index
              element={<Home />}
            />
            <Route
              path="about"
              element={<About />}
            />
            <Route path="faqs">
              <Route
                index
                element={<FaqPage />}
              />
            </Route>
          </Routes>
          <Toaster />
        </Layout>
      </CustomErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
