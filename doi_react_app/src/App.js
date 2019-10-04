import React from 'react';
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


const App = () => {

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
  //const wallet = bitcore.createWallet("default")
  //const url = bitcore.getUrl()+"/api/v1/importpubkey"
  //bitcore.registerPublicKey(url, wallet.publicKey)
 // console.log(wallet.publicKey.toString())
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
                Item Three
            </TabPanel>
        </div>
    );
}
export default App;
