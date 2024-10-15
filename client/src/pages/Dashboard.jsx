import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSlidebar from "../components/DashSlidebar";
import DashProfile from "../components/DashProfile";
import CreateProduct from "../components/CreateProduct";
import Products from "../components/Products";
import OrderList from "../components/OrderList";
import Users from "../components/Users";
import Reviews from "../components/Reviews";
import AllDash from "../components/AllDash";

import { useDispatch } from "react-redux";

export default function Dashboard() {
  const location = useLocation();

  const [tab, setTab] = useState("");


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="flex flex-col md:flex-row  ">
      {/* Sidebar */}
      <div className=" md:w-56">
        < DashSlidebar/>
      
      </div>

      
      <div className="container">
        {/* dash*/}
      {tab === "dash" && <AllDash/> }
      {/* profile */}
      {tab === "profile" && <DashProfile/> }
      {/* create-product */}
      {tab === "create-product" && <CreateProduct/> }
      {/* products */}
      {tab === "products" && <Products/> }
      {/* order-list*/}
      {tab === "order-list" && <OrderList/> }
      {/* users */}
      {tab === "users" && <Users/> }
      {/* reviews*/}
      {tab === "reviews" && <Reviews/> }
      {tab == ":id" && <Reviews/> }
      </div>
    </div>
  );
}
