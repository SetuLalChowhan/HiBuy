import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "../src/components/Header";
import VerifyPage from "./pages/VerifyPage";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/ResetPassword";
import EditProduct from "./components/EditProduct";
import Collections from "./pages/Collections";
import Footer from "./components/Footer";
import SingleProduct from "./pages/SingleProduct";
import ScrollToTop from "./components/ScrollToTop";
import Cart from "./pages/Cart";
function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product-edit/:id" element={<EditProduct />} />
          </Route>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/verify-me" element={<VerifyPage />} />
        </Routes>
        <Footer />
      </Router>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}

export default App;
