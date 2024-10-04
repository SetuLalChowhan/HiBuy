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
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Navbar fluid rounded className="container ">
      <NavbarBrand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          HiBuy
        </span>
      </NavbarBrand>
      <div className="flex gap-4 md:order-2">
        <Link to={'/cart'} className="flex justify-center items-center">
        <  BsCart4 size={35}/>
        <p className=" -mt-4 font-semibold">4</p>
        </Link>
        
        {true ? (
          <Link to={'/login'}><Button color="blue" outline>Log In</Button></Link>
        ) : (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </DropdownHeader>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownDivider />
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
        )}
        
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink className="text-lg" href="/" active>
          Home
        </NavbarLink>
        <NavbarLink className="text-lg" href="#">
          Products
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
