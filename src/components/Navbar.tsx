import { List } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";

import { NavbarItemData, NavbarItem } from "./NavbarItem";

const Nav = styled("div")(({ theme }) => ({
  width: "14rem",
  height: "100vh",
  position: "fixed",
  backgroundColor: theme.palette.background.paper,
}));

const Navbar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const navbarItems: NavbarItemData[] = [
    {
      name: "Dashboard",
      index: 0,
      link: "/dashboard",
      icon: DashboardOutlinedIcon,
    },
    {
      name: "Rooms",
      index: 1,
      link: "/dashboard/rooms",
      icon: HomeOutlinedIcon,
    },
    {
      name: "Customers",
      index: 2,
      link: "/dashboard/customers",
      icon: PeopleOutlinedIcon,
    },
    {
      name: "Employees",
      index: 3,
      link: "/dashboard/employees",
      icon: BadgeOutlinedIcon,
    },
    {
      name: "Reservations",
      index: 4,
      link: "/dashboard/reservations",
      icon: LayersOutlinedIcon,
    },
  ];

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    path: string
  ) => {
    setSelectedIndex(index);
    navigate(path);
  };

  return (
    <Nav>
      <List component="nav">
        {navbarItems.map((navbarItem) => (
          <NavbarItem
            key={navbarItem.index}
            data={navbarItem}
            handleClick={handleClick}
            selectedIndex={selectedIndex}
          />
        ))}
      </List>
    </Nav>
  );
};

export default Navbar;
