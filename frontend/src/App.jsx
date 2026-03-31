import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./components/RequireAuth";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import RestaurantsPage from "./pages/Restaurants";
import RestaurantMenuPage from "./pages/RestaurantMenu";
import CategoriesPage from "./pages/Categories";
import CartPage from "./pages/Cart";
import OrdersPage from "./pages/Orders";
import AdminPage from "./pages/Admin";
import NotFoundPage from "./pages/NotFound";

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Navigate to="/restaurants" replace />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					<Route path="/restaurants" element={<RestaurantsPage />} />
					<Route path="/restaurants/:id" element={<RestaurantMenuPage />} />
					<Route path="/categories" element={<CategoriesPage />} />

					<Route
						path="/cart"
						element={
							<RequireAuth>
								<CartPage />
							</RequireAuth>
						}
					/>
					<Route
						path="/orders"
						element={
							<RequireAuth>
								<OrdersPage />
							</RequireAuth>
						}
					/>
					<Route
						path="/admin"
						element={
							<RequireAuth>
								<AdminPage />
							</RequireAuth>
						}
					/>

					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
