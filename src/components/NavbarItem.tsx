import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  SvgIconTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface NavbarItemData {
  name: string;
  index: number;
  link: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
}

export interface NavbarItemProps {
  data: NavbarItemData;
  selectedIndex: number;
  handleClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    path: string
  ) => void;
}

export const NavbarItem = (props: NavbarItemProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={props.selectedIndex === props.data.index}
        onClick={(event) => {
          props.handleClick(event, props.data.index, props.data.link);
        }}
      >
        <ListItemIcon>
          <props.data.icon fontSize="large" />
        </ListItemIcon>
        <ListItemText
          primary={props.data.name}
          sx={{
            color: "text.primary",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};
