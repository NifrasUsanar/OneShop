import React, { useState, useContext } from 'react';
import { Link, usePage, router  } from '@inertiajs/react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid2"
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Tooltip, List } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CustomerIcon from '@mui/icons-material/PeopleAlt';
import VendorIcon from '@mui/icons-material/ContactEmergency';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';

import oneshopLogo from './oneshop-logo.png';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const NavItem = ({href, icon:Icon, label, open, selected})=>(
  <Link href={href}>
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
      selected={selected}
        sx={[
          {
            minHeight: 48,
            px: 2.5,
            "&.Mui-selected":{
              color:'white',
              backgroundColor: '#1976d2', // Background color when selected
              "& .MuiListItemIcon-root": { // Target the icon within the selected state
                color: 'white', // Icon color when selected
              }
            },
            "&:hover": {
              color:'white',
              backgroundColor: '#5f72f5', // Background color on hover
              "& .MuiListItemIcon-root": {
                color: 'white', // Icon color on hover
              },
            },
          },
          open
            ? { justifyContent: 'initial' }
            : { justifyContent: 'center' },
        ]}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: 'center',
            },
            open
              ? { mr: 3 }
              : { mr: 'auto' },
          ]}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={[
            open
              ? { opacity: 1 }
              : { opacity: 0 },
          ]}
        />
      </ListItemButton>
    </ListItem>
  </Link>
);

export default function Authenticated({ header, children, ...props }) {

    const user = usePage().props.auth.user;
    const shop_name = usePage().props.settings.shop_name;
    const pageLabel = usePage().props.pageLabel;
    const pathname = usePage().url;

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    //Logic to selected menu item
    // const isSelected = (href) => pathname === href || pathname.startsWith(href + '/');
    const isSelected = (href) => {
      const baseHref = href.split('?')[0]; // Extract the base path by removing query parameters
      return pathname === baseHref || pathname.startsWith(baseHref);
  };
  
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,
                },
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Grid container spacing={2} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
            <Typography variant="h5" noWrap component="div" sx={{textTransform:'capitalize'}}>
              {shop_name} | {pageLabel}
            </Typography>
            <Tooltip title="Logout" arrow>
            <IconButton
                    color="white"
                    size='large'
                    onClick={(e) => router.post("logout")}
                >
                    <LogoutIcon fontSize="large" sx={{color:'white'}}/>
                </IconButton>
                </Tooltip>
            </Grid>
            
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <Grid container width={'100%'} alignItems={'center'} justifyContent={'space-between'} paddingLeft={'0.5rem'}>
            <img src={oneshopLogo} className="h-8"></img>

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            </Grid>
            
          </DrawerHeader>
          <Divider />
          <List>

          <NavItem href="/dashboard" icon={DashboardIcon} label="Dashboard" open={open} selected={isSelected("/dashboard")} />
          <NavItem href="/pos" icon={PointOfSaleIcon} label="POS" open={open} selected={isSelected("/pos")} />
          <NavItem href="/products" icon={InventoryIcon} label="Products" open={open} selected={isSelected("/products")} />
          <NavItem href="/sales" icon={PaidIcon} label="Sales" open={open} selected={isSelected("/sales")} />
          <NavItem href="/sold-items" icon={PaidIcon} label="Sold Items" open={open} selected={isSelected("/sold-items")} />
          <NavItem href="/purchases" icon={AddShoppingCartIcon} label="Purchases" open={open} selected={isSelected("/purchases")} />
          <NavItem href="/payments/sales" icon={PaymentsIcon} label="Payments" open={open} selected={isSelected("/payments")} />
          <NavItem href="/expenses" icon={AccountBalanceWalletIcon} label="Expenses" open={open} selected={isSelected("/expenses")} />
          <NavItem href="/collections" icon={AccountTreeIcon} label="Collections" open={open} selected={isSelected("/collections")}  />
          <NavItem href="/customers" icon={CustomerIcon} label="Customers" open={open} selected={isSelected("/customers")} />
          <NavItem href="/vendors" icon={VendorIcon} label="Vendors" open={open} selected={isSelected("/vendors")} />    
          <NavItem href="/stores" icon={StoreIcon} label="Stores" open={open} selected={isSelected("/stores")} />
          <NavItem href="/settings" icon={SettingsIcon} label="Settings" open={open} selected={isSelected("/settings")}/>
          <NavItem href="/profile" icon={ManageAccountsIcon} label="Profile" open={open} selected={isSelected("/profile")} />

          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Box className="py-4 px-4">
          <main>{children}</main>
          </Box>
        </Box>
      </Box>
    );
}
