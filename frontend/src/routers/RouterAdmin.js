import React from "react";
import LayoutAdmin from "../layouts/index";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import Product from "../pages/products";
import Login from "../pages/users/login";
import Register from "../pages/users/register";

import User from "../pages/users";
import Role from "../pages/users/roles";
import CreateProduct from "../pages/products/create";

import EditProduct from "../pages/products/edit";
import Order from "../pages/orders";
import Purchase from "../pages/purchases";
import Supplier from "../pages/suppliers";
import Customer from "../pages/customer";
import Category from "../pages/category";
import Unit from "../pages/unit";
import OrderShow from "../pages/orders/show";
import ProductShow from "../pages/products/show";
import OrderCreate from "../pages/orders/create";
import PurchaseShow from "../pages/purchases/show";
import PurchaseCreate from "../pages/purchases/create";
import PurchaseUpdate from "../pages/purchases/edit";
import SupplierCreate from "../pages/suppliers/create";
import SupplierShow from "../pages/suppliers/show";
import SupplierEdit from "../pages/suppliers/edit";
import CustomerCreate from "../pages/customer/create";
import CustomerShow from "../pages/customer/show";
import CustomerEdit from "../pages/customer/edit";
import CategoryCreate from "../pages/category/create";
import CategoryShow from "../pages/category/show";
import CategoryEdit from "../pages/category/edit";
import UnitCreate from "../pages/unit/create";
import UnitShow from "../pages/unit/show";
import UnitEdit from "../pages/unit/edit";
import UserShow from "../pages/users/show";
import UserEdit from "../pages/users/edit";
import UserCreate from "../pages/users/create";

const RouterAdmin = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/*", element: <NotFound /> },
  {
    path: "/",
    // element: (
    //   <ProtectedRoute>
    //     <LayoutAdmin />
    //   </ProtectedRoute>
    // ),
    element: <LayoutAdmin />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "/admin", element: <Dashboard /> },
      { path: "/dashboards", element: <Dashboard /> },

      // --- Products ---
      { path: "/products", element: <Product /> },
      { path: "/product/create", element: <CreateProduct /> },
      { path: "/product/show/:id", element: <ProductShow /> },
      { path: "/product/edit/:id", element: <EditProduct /> },

      // --- Orders ---
      { path: "/orders", element: <Order /> },
      { path: "/orders/create", element: <OrderCreate /> },
      { path: "/orders/show/:id", element: <OrderShow /> },
      { path: "/orders/edit/:id", element: <EditProduct /> },

      // --- Purchases ---
      { path: "/purchases", element: <Purchase /> },
      { path: "/purchase/create", element: <PurchaseCreate /> },
      { path: "/purchase/show/:id", element: <PurchaseShow /> },
      { path: "/purchase/edit/:id", element: <PurchaseUpdate /> },

      // // --- Quotations ---
      // { path: "/products", element: <Product /> },
      // { path: "/product/create", element: <CreateProduct /> },
      // { path: "/product/show/:id", element: <ShowProduct /> },
      // { path: "/product/edit/:id", element: <EditProduct /> },

      // --- Suppliers ---
      { path: "/suppliers", element: <Supplier /> },
      { path: "/supplier/create", element: <SupplierCreate /> },
      { path: "/supplier/show/:id", element: <SupplierShow /> },
      { path: "/supplier/edit/:id", element: <SupplierEdit /> },

      // --- Customers ---
      { path: "/customers", element: <Customer /> },
      { path: "/customer/create", element: <CustomerCreate /> },
      { path: "/customer/show/:id", element: <CustomerShow /> },
      { path: "/customer/edit/:id", element: <CustomerEdit /> },

      // --- Categories ---
      { path: "/categories", element: <Category /> },
      { path: "/category/create", element: <CategoryCreate /> },
      { path: "/category/show/:id", element: <CategoryShow /> },
      { path: "/category/edit/:id", element: <CategoryEdit /> },

      // --- Units ---
      { path: "/units", element: <Unit /> },
      { path: "/unit/create", element: <UnitCreate /> },
      { path: "/unit/show/:id", element: <UnitShow /> },
      { path: "/unit/edit/:id", element: <UnitEdit /> },

      // --- User ---
      { path: "/users", element: <User /> },
      { path: "/user/create", element: <UserCreate /> },
      { path: "/user/show/:id", element: <UserShow /> }, //
      { path: "/user/edit/:id", element: <UserEdit /> }, //
      { path: "/roles", element: <Role /> }, //
    ],
  },
];

export default RouterAdmin;
