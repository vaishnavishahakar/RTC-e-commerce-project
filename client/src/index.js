import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./views/Home";
import Signup from "./views/Signup";
import Login from "./views/Login";
import NotFound from "./views/404";
import Dashboard from "./views/Dashboard";
import UserOrders from "./views/UserOrders";
import Cart from "./views/Cart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Layout Component to keep Navbar consistent
const Layout = () => {
 
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};


// Create Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Define a parent layout
    children: [
      { path: '', element: <Home /> }, // Nested inside the parent
      { path: 'signup', element: <Signup /> },
      { path: 'login', element: <Login /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'user/orders', element: <UserOrders /> },
      { path: 'user/cart', element: <Cart /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div className='bg-zinc-100 min-h-screen'>
    <RouterProvider router={router} />
  </div>
);

     
