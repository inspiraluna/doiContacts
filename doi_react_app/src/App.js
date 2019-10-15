import React, { useGlobal,setGlobal,addCallback,useState, setState,useEffect } from 'reactn';
import * as PropTypes from "prop-types";
import './App.css';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import ContactsPage from "./pages/ContactsPage";
import WalletsPage from "./pages/WalletsPage";

import Tabs from "@material-ui/core/Tabs";
import Tab from '@material-ui/core/Tab'
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {register} from "./serviceWorker"
import MenuButton from "./components/MenuButton";
import {
    faAddressBook,
    faFileSignature,
    faIdCard,
    faIdBadge,
    faCoins,
    faQrcode,
    faAt,
    faBars,
} from "@fortawesome/free-solid-svg-icons";
import CustomizedSnackbars from "./components/MySnackbarContentWrapper";

const App = () => {

    register()
//    localStorage.removeItem("contacts")
//    localStorage.removeItem("wallets")
    const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
    const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]

    setGlobal({contacts: initialContacts, wallets: initialWallets,errors:false})
    const [value, setValue] = React.useState(0);
    const global = useGlobal()

    const controlScanSwip = (index) => {
        setValue(index)
        global.scanSwipe = !global.scanSwipe
        setGlobal(global) //just switch back and forth for now
        console.log(global.scanSwipe,index)
    }

    const state = {
        flyOutRadius: 120,
        seperationAngle: 40,
        mainButtonDiam: 60,
        childButtonDiam: 50,
        numElements: 7,
        stiffness: 320,
        damping: 17,
        rotation: 0,
        mainButtonIcon: faBars,
        mainButtonIconSize: "2x",
        childButtonIconSize: "lg"
    }

    const ELEMENTS = [
        {
            icon: faAddressBook,
            //onClick: () => alert("clicked home"),
            onClick: () => controlScanSwip(0)
        },{
            icon: faIdCard,
            onClick: () => controlScanSwip(0)
        },{
            icon: faFileSignature,
            onClick: () => controlScanSwip(1)
        },{
            icon: faCoins,
            onClick: () =>  controlScanSwip(1)
        },{
            icon: faQrcode,
            onClick: () =>  controlScanSwip(2)
        },{
            icon: faAt,
            onClick: () =>  controlScanSwip(2)
        },{
            icon: faIdBadge,
            onClick: () => controlScanSwip(2)
        }

    ];

    addCallback(global => {
        localStorage.setItem('contacts',JSON.stringify(global.contacts))
        localStorage.setItem('wallets',JSON.stringify(global.wallets))
        return null;
    });

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box p={3}>{children}</Box>
            </Typography>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
        },
    }));

    //https://www.npmjs.com/package/cordova-plugin-qrscanner-allanpoppe2
    const classes = useStyles();


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="Doichain Contacts">
                    <Tab label="Contacts" {...a11yProps(0)} />
                    <Tab label="Wallets" {...a11yProps(1)} />
                    <Tab label="Settings" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ContactsPage/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <WalletsPage/>
            </TabPanel>
            <TabPanel value={value} index={2} style={{backgroundColor: 'transparent'}}>
              Settings
            </TabPanel>
            <div style={{float:'right'}}>
                <MenuButton {...state} elements={ELEMENTS.slice(0, state.numElements)}/>
            </div>
            <CustomizedSnackbars />
        </div>
    );
}
export default App;
