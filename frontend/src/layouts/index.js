import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";

function LayoutAdmin() {
  return (
    <div className="flex bg-gray-50 ">
      <div className="flex min-h-screen flex-col flex-1 w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutAdmin;
