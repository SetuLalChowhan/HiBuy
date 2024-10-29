import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button,
} from "flowbite-react";
import { BsCart4 } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchSharp } from "react-icons/io5";
import { logout } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user.user);
  const { cart } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const handleSignOut = () => {
    dispatch(logout({ toast, navigate }));
  };

  return (
    <Navbar fluid rounded className="lg:container">
      <NavbarBrand as="div">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          <Link to="/">HiBuy</Link>
        </span>
      </NavbarBrand>

      <div className="flex  gap-4 md:order-2">
        <Link to={"/collections"} className="flex items-center">
          <IoSearchSharp className=" text-gray-600" size={28} />
        </Link>

        <Link to={"/cart"} className="flex justify-center items-center">
          <BsCart4 size={35} />
          <p className="-mt-4 font-semibold">{cart.length}</p>
        </Link>

        {currentUser == null ? (
          <Link to={"/login"}>
            <Button color="blue" outline>
              Login
            </Button>
          </Link>
        ) : (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                className="w-12 h-12 rounded-full object-contain"
                alt="User settings"
                img={currentUser?.avatar}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{currentUser.name}</span>
              <span className="block truncate text-sm font-medium">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <DropdownItem>
              <Link to={currentUser.isAdmin?`/dashboard?tab=dash`:`/dashboard?tab=profile`}>Dashboard</Link>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
            {currentUser && !currentUser.isVerified && (
              <DropdownItem>
                <Link to={"/verify-me"}>
                  <Button className="mt-4 mb-4 ml-2" color="blue" outline>
                    Verify me
                  </Button>
                </Link>
              </DropdownItem>
            )}
          </Dropdown>
        )}

        <NavbarToggle />
      </div>

      <NavbarCollapse>
       

        <NavbarLink active={path === "/"} as="div" className="text-lg">
          <Link to={"/"}>Home</Link>
        </NavbarLink>

        <NavbarLink
          as="div"
          active={path === "/collections"}
          className="text-lg"
        >
          <Link to={"/collections"}>Collections</Link>
        </NavbarLink>

        <NavbarLink className="text-lg" href="#">
          About
        </NavbarLink>
        <NavbarLink className="text-lg" href="#">
          Contact
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
