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
  TextInput,
} from "flowbite-react";
import { BsCart4 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchSharp } from "react-icons/io5";
import { logout } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(logout({ toast, navigate }));
  };

  return (
    <Navbar fluid rounded className="lg:container">
      <NavbarBrand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          HiBuy
        </span>
      </NavbarBrand>

      {/* Desktop Search Bar */}
      <div className="md:flex justify-center items-center hidden">
        <div className="relative flex items-center">
          <TextInput
            placeholder="Search Anything"
            className="rounded-lg md:w-48 pl-10 lg:w-96"
            id="search-1"
            type="text"
            sizing="sm"
          />
          <IoSearchSharp className="absolute left-2 text-gray-400" size={25} />
        </div>
      </div>

      <div className="flex gap-4 md:order-2">
        <Link to={"/cart"} className="flex justify-center items-center">
          <BsCart4 size={35} />
          <p className=" -mt-4 font-semibold">4</p>
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
                className=" w-12 h-12 rounded-full object-cover"
                alt="User settings"
                img={`http://localhost:3000/${currentUser.avatar}`}
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
            <DropdownItem ><Link to={"/dashboard"}>Dashboard</Link></DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
            {currentUser && !currentUser.isVerified && (
              <Button className="mt-4 mb-4 ml-2" color="blue" outline>
                <Link to={"/verify-me"}>Veryfy me</Link>
              </Button>
            )}
          </Dropdown>
        )}

        <NavbarToggle />
      </div>

      <NavbarCollapse>
        {/* Mobile Search Bar */}
        <div className="md:hidden justify-center items-center mb-3">
          <div className="relative flex items-center">
            <TextInput
              placeholder="Search Anything"
              className="rounded-lg pl-10 w-full"
              id="search-2"
              type="text"
              sizing="sm"
            />
            <IoSearchSharp
              className="absolute left-2 text-gray-400"
              size={25}
            />
          </div>
        </div>

        <NavbarLink className="text-lg" href="/" active>
          Home
        </NavbarLink>
        <NavbarLink className="text-lg" href="#">
          Collections
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
