import React, { useGlobal,setGlobal,addCallback,useState, setState,useEffect } from 'reactn';
import * as PropTypes from "prop-types";
//import QRScanner from 'QRScanner';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import ContactsPage from "./components/ContactsPage";
import Wallets from "./components/Wallets";

import Tabs from "@material-ui/core/Tabs";
import Tab from '@material-ui/core/Tab'
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {register} from "./serviceWorker"
import MenuButton from "./components/MenuButton";
import {
    faAsterisk,
    faBars,
    faClipboard,
    faClock, faEye,
    faFighterJet,
    faGlobe,
    faHome, faIndustry,
    faLock
} from "@fortawesome/free-solid-svg-icons";

const App = () => {

    register()
//    localStorage.removeItem("contacts")
//    localStorage.removeItem("wallets")
    const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
    const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]

    setGlobal({contacts: initialContacts, wallets: initialWallets})

    const state = {
        flyOutRadius: 120,
        seperationAngle: 40,
        mainButtonDiam: 60,
        childButtonDiam: 50,
        numElements: 4,
        stiffness: 320,
        damping: 17,
        rotation: 0,
        mainButtonIcon: faBars,
        mainButtonIconSize: "2x",
        childButtonIconSize: "lg"
    }

    const ELEMENTS = [
        {
            icon: faHome,
            //onClick: () => alert("clicked home"),
            onClick: () => setValue(0)
        },{
            icon: faClock,
            onClick: () => setValue(1)
        },{
            icon: faLock,
            onClick: () => setValue(2)
        },{
            icon: faGlobe,
            onClick: () => alert("clicked globe")
        },{
            icon: faAsterisk,
            onClick: () => alert("clicked asterisk")
        },{
            icon: faFighterJet,
            onClick: () => alert("clicked fighter-jet")
        },{
            icon: faClipboard,
            onClick: () => alert("clicked clipboard")
        },{
            icon: faIndustry,
            onClick: () => alert("clicked industry")
        },{
            icon: faEye,
            onClick: () => alert("clicked eye")
        }

    ];

    addCallback(global => {
        console.log("new data - contacts:", global.contacts)
        console.log("new data - wallets:", global.wallets)
        //setOldContacts(global.contacts)
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

    /**
     * Check QR-Code scan details:
     * https://www.npmjs.com/package/cordova-plugin-qrscanner-allanpoppe2
     */
    function prepareScan(){
        window.QRScanner.prepare(onDone); // show the prompt
    }

    function onDone(err, status){
        if (err) {
            // here we can handle errors and clean up any loose ends.
            console.error(err);
        }
        if (status.authorized) {
            // W00t, you have camera access and the scanner is initialized.
            // QRscanner.show() should feel very fast.
            console.log('authorized')
        } else if (status.denied) {
            // The video preview will remain black, and scanning is disabled. We can
            // try to ask the user to change their mind, but we'll have to send them
            // to their device settings with `QRScanner.openSettings()`.
            console.log('denied')
        } else {
            // we didn't get permission, but we didn't get permanently denied. (On
            // Android, a denial isn't permanent unless the user checks the "Don't
            // ask again" box.) We can ask again at the next relevant opportunity.
            console.log('denied')
        }
    }

    function showScanner(){
        window.QRScanner.show();
    }
    function scan(){
        //if(cordova!==undefined)
        console.log('hola',window.cordova === undefined)
        // Start a scan. Scanning will continue until something is detected or
// `QRScanner.cancelScan()` is called.
        window.QRScanner.scan(displayContents);

        function displayContents(err, text){
            if(err){
                // an error occurred, or the scan was canceled (error code `6`)
            } else {
                // The scan completed, display the contents of the QR code:
                console.log(text);
            }
        }

// Make the webview transparent so the video preview is visible behind it.

// Be sure to make any opaque HTML elements transparent here to avoid
// covering the video.
    }
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
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Contacts" {...a11yProps(0)} />
                    <Tab label="Wallets" {...a11yProps(1)} />
                    <Tab label="Settings" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ContactsPage/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Wallets/>
            </TabPanel>
            <TabPanel value={value} index={2} style={{backgroundColor: 'transparent'}}>
              Settings
                <button onClick={()=>{
                    prepareScan()
                }}>Prepare Scanner</button>
                <button onClick={()=>{
                    showScanner()
                }}>Show Scanner</button>
                <button onClick={()=>{
                    scan()
                }}>Scan QR Code</button>
            </TabPanel>
            <div style={{float:'right'}}>
                <MenuButton {...state} elements={ELEMENTS.slice(0, state.numElements)}/>
            </div>
        </div>
    );
}
export default App;
