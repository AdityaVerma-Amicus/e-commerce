import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";

import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import CartPage from "../pages/CartPage/CartPage";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

const CheckoutPage = lazy(() => import("../pages/CheckoutPage/CheckoutPage"));

const OrdersPage = lazy(() => import("../pages/OrdersPage/OrdersPage"));

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<SearchResults />} />

        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/checkout"
          element={
            <Suspense fallback={<p>Loading checkout...</p>}>
              <CheckoutPage />
            </Suspense>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/orders"
            element={
              <Suspense fallback={<p>Loading orders...</p>}>
                <OrdersPage />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
