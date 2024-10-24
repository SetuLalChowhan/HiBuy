import { Sidebar } from "flowbite-react";
import { HiChartPie, HiInbox, HiShoppingBag } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { MdOutlineReviews } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashSlidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const { currentUser, allUsersDefault } = useSelector(
    (state) => state.user.user
  );
  const { allProductsDefault } = useSelector((state) => state.product);
  const { totalOrders } = useSelector((state) => state.order);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar aria-label="Dashboard Sidebar" className="bg-gray-800 text-white ">
      <Sidebar.Items className="px-4 py-6">
        <Sidebar.ItemGroup>
          {/* Conditionally render admin and user-specific items */}
          {currentUser.isAdmin && (
            <>
              <Link to={"/dashboard?tab=dash"}>
                <Sidebar.Item
                  active={tab === "dash"}
                  icon={HiChartPie}
                  className="hover:bg-gray-600 transition-colors rounded-lg mb-3"
                  as="div"
                >
                  <span className="text-sm font-semibold">Dashboard</span>
                </Sidebar.Item>
              </Link>

              <Link to={"/dashboard?tab=create-product"}>
                <Sidebar.Item
                  active={tab === "create-product"}
                  icon={HiShoppingBag}
                  className="hover:bg-gray-600 transition-colors rounded-lg mb-3"
                  as="div"
                >
                  <span className="text-sm font-semibold">Create Product</span>
                </Sidebar.Item>
              </Link>

              <Link to={"/dashboard?tab=products"}>
                <Sidebar.Item
                  active={tab === "products"}
                  icon={HiShoppingBag}
                  label={allProductsDefault}
                  className="hover:bg-gray-600 transition-colors rounded-lg mb-3"
                  as="div"
                >
                  <span className="text-sm font-semibold">All Products</span>
                </Sidebar.Item>
              </Link>

              <Link to={"/dashboard?tab=orders"}>
                <Sidebar.Item
                  active={tab === "orders"}
                  icon={HiInbox}
                  label={totalOrders}
                  className="hover:bg-gray-600 transition-colors rounded-lg mb-3"
                  as="div"
                >
                  <span className="text-sm font-semibold">Orders</span>
                </Sidebar.Item>
              </Link>

              <Link to={"/dashboard?tab=users"}>
                <Sidebar.Item
                  active={tab === "users"}
                  icon={FaUsers}
                  className="hover:bg-gray-600 transition-colors rounded-lg mb-3"
                  as="div"
                  label={allUsersDefault}
                >
                  <span className="text-sm font-semibold">Users</span>
                </Sidebar.Item>
              </Link>

             
            </>
          )}

          {/* Non-admin user-specific item */}
          {!currentUser.isAdmin && (
            <Link to={"/dashboard?tab=my-orders"}>
              <Sidebar.Item
                active={tab === "my-orders"}
                icon={MdOutlineReviews}
                className="hover:bg-gray-600 transition-colors rounded-lg mb-3"
                as="div"
              >
                <span className="text-sm font-semibold">Order List</span>
              </Sidebar.Item>
            </Link>
          )}

          {/* Common items */}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={CgProfile}
              className="hover:bg-gray-600 transition-colors rounded-lg mb-3"
              as="div"
            >
              <span className="text-sm font-semibold">Profile</span>
            </Sidebar.Item>
          </Link>

          <Sidebar.Item
            href="#"
            icon={RiLogoutBoxRLine}
            className="hover:bg-gray-600 transition-colors rounded-lg mt-6"
            as="div"
          >
            <span className="text-sm font-semibold">Sign Out</span>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
