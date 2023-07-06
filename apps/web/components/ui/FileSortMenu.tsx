import {
	IconButton,
	Button,
	MenuItem,
	Menu,
	MenuList,
	MenuButton,
} from "@chakra-ui/react";
import React from "react";
import { SortFilterConfig } from "@util/types";
import { ChevronDown, ArrowsSort } from "tabler-icons-react";


type Props = {
  setFileSort: React.Dispatch<React.SetStateAction<SortFilterConfig>>;
	fileSort: SortFilterConfig;
}

const FileSortMenu: React.FC<Props>= (props) => {
  return (
    <>
      <Menu>
        <MenuButton size="sm" as={Button} variant="ghost" rightIcon={<ChevronDown size="16" />}>
          { props.fileSort.property }
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => props.setFileSort({...props.fileSort, ['property']: 'name'})}>
            Name
          </MenuItem>
          <MenuItem onClick={() => props.setFileSort({...props.fileSort, ['property']: 'size'})}>
            Size
          </MenuItem>
          <MenuItem onClick={() => props.setFileSort({...props.fileSort, ['property']: 'createdAt'})}>
            Created At
          </MenuItem>
        </MenuList>
      </Menu>
      <IconButton aria-label="change-view" onClick={() => props.setFileSort({...props.fileSort, ['isAscending']: !props.fileSort.isAscending})}>
        <ArrowsSort />
      </IconButton>
    </>
  );
}

export default FileSortMenu;