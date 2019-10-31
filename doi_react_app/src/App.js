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
import CustomizedSnackbars from "./components/MySnackbarContentWrapper";
import bitcore from "bitcore-doichain";

const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]
const initialCurrentTab =  localStorage.getItem('currentTab')?localStorage.getItem('currentTab'):0

setGlobal({contacts: initialContacts,
    wallets: initialWallets,
    errors: false,
    currentTab:initialCurrentTab,
    buttonState: '',
    modus: 'list'})  //currentTab:initialCurrentTab*/

const App = () => {

   const settings = {  //RegTest
        testnet:true,
        from: 'newsletter@doichain.org',
        port:4000,
        host:"localhost"
    }

   // bitcore.settings.setSettings(settings)

    console.log(bitcore.settings.getSettings(),bitcore.getUrl())
    register()

    const [ currentTab, setCurrentTab ] = useGlobal("currentTab")
    const [modus, setModus] = useGlobal("modus")
    const [activeWallet, setActiveWallet ] = useGlobal("activeWallet")

    addCallback(global => {
        localStorage.setItem('contacts',JSON.stringify(global.contacts))
        localStorage.setItem('wallets',JSON.stringify(global.wallets))
        localStorage.setItem('currentTab',global.currentTab)
        console.log('currentTab was '+currentTab, global.currentTab)
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
    return (
        <div>
            <AppBar position="static">
                <Tabs value={Number(currentTab)} onChange={(event, newValue) => {
                    setCurrentTab(newValue)
                    setActiveWallet(undefined)
                    setModus('list')
                }} aria-label="Doichain Contacts">
                    <Tab label="Contacts" {...a11yProps(0)} />
                    <Tab label="Wallets" {...a11yProps(1)} />
                    <Tab label="Settings" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={Number(currentTab)} index={0}>
                {currentTab==0 && <ContactsPage/>}

            </TabPanel>
            <TabPanel value={Number(currentTab)} index={1}>
                {currentTab==1 && <WalletsPage/>}
            </TabPanel>
            <TabPanel value={Number(currentTab)} index={2}>
              Settings
            </TabPanel>
            <div style={{float:'right'}}>
                {/*  <MenuButton {...state} elements={ELEMENTS.slice(0, state.numElements)}/> */}
            </div>
            <CustomizedSnackbars />
        </div>
    );
}
export default App;
