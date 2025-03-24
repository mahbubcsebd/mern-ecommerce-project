import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/layouts/Layout';
import About from './components/pages/About';
import CreateFaqPage from './components/pages/CreateFaqPage';
import FaqDetailsPage from './components/pages/FaqDetailsPage';
import FaqPage from './components/pages/FaqPage';
import Home from './components/pages/Home';

const App = () => {
  return (
    <BrowserRouter>
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
            <Route
              path="create-faq"
              element={<CreateFaqPage />}
            />
            <Route
              path=":faqId"
              element={<FaqDetailsPage />}
            />
          </Route>
        </Routes>
        <Toaster />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
