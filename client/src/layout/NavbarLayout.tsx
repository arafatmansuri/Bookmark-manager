import { Outlet, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export const NavbarLayout = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar
        onLoginClick={() => navigate("/signin")}
        onSignupClick={() => navigate("/signup")}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
