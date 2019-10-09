import React, { useGlobal,setGlobal,addCallback,useState, setState,useEffect } from 'reactn';
import * as PropTypes from "prop-types";

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

const App = () => {

    register()
//    localStorage.removeItem("contacts")
//    localStorage.removeItem("wallets")
    const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
    const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]

    setGlobal({contacts: initialContacts, wallets: initialWallets})

    //const [oldContacts,setOldContacts] = useState(initialContacts)
    /* useEffect(() => {
        // This effect uses the `value` variable,
        // so it "depends on" `value`.
        console.log(oldContacts);

    }, [oldContacts])*/

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
            <TabPanel value={value} index={2}>
              Settings
            </TabPanel>
        </div>
    );
}
export default App;
