import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { NavbarLayout } from "./layout/NavbarLayout";
import Dashboard from "./pages/Dashboard";
import { LandingPage } from "./pages/Landing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
const queryClient = new QueryClient();
function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<NavbarLayout />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/" element={<LandingPage />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </QueryClientProvider>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
