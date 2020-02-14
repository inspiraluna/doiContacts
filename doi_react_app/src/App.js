import React, { useGlobal, useEffect } from "reactn"
import * as PropTypes from "prop-types"
import "./App.css"
import ContactsPage from "./pages/ContactsPage"
import WalletsPage from "./pages/WalletsPage"

import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { register } from "./serviceWorker"
import CustomizedSnackbars from "./components/MySnackbarContentWrapper"
import bitcore from "bitcore-doichain"
import initStorage from "./utils/storage"
import WalletCreator from "./pages/walletCreator/WalletCreator"
import AppBar from "@material-ui/core/AppBar"
import {appVersion} from "./appVersion";
import { useTranslation } from "react-i18next"

const App = props => {
    const [global, setGlobal] = useGlobal()
    const [currentTab, setCurrentTab] = useGlobal("currentTab")
    const [modus, setModus] = useGlobal("modus")
    const [activeWallet, setActiveWallet] = useGlobal("activeWallet")
    const [wallets] = useGlobal("wallets")
    const [t] = useTranslation()

    // const settings = {
    //     //RegTest
    //     testnet: true,
    //     from: "alice@ci-doichain.org",
    //     port: 3000,
    //     host: "localhost"
    // }

    // const settings = {  //testnet 2
    //     testnet:true,
    //     from: 'newsletter@doichain.org',
    //     port:4010,
    //     host:"5.9.154.231"
    // }

    const settings = {
        //testnet 2
        testnet: true,
        from: "newsletter@doichain.org",
        port: 443,
        ssl: true,
        host: "doichain-testnet.le-space.de"
    }

    bitcore.settings.setSettings(settings)
    bitcore.Networks.defaultNetwork = bitcore.Networks.get("doichain-testnet")

    register()

    useEffect(() => {
        if (!currentTab && !modus && !activeWallet) {
            initStorage(props.cordova, global, setGlobal)
        }
    })

    function TabPanel(props) {
        const { children, value, index, ...other } = props

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
        )
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`
        }
    }
    const our_CurrentTab = currentTab ? currentTab : 0

       if(!wallets || wallets.length === 0){
           return <WalletCreator />
       }else{
    return (
        <div>
            <AppBar position="static">
                <Tabs
                    value={Number(our_CurrentTab)}
                    onChange={(event, newValue) => {
                        setCurrentTab(newValue)
                        setActiveWallet(undefined)
                        setModus("list")
                    }}
                    aria-label="Doichain Contacts"
                >
                    <Tab label={t("tabs.contacts")} {...a11yProps(0)} />
                    <Tab label={t("tabs.wallets")} {...a11yProps(1)} />
                    <div style={{ align: "center", verticalAlign: "middle", fontSize: "9px" }}>
                        {appVersion}
                    </div>
                </Tabs>
            </AppBar>
            <TabPanel value={Number(our_CurrentTab)} index={0}>
                {currentTab === 0 && <ContactsPage />}
            </TabPanel>
            <TabPanel value={Number(our_CurrentTab)} index={1}>
                {currentTab === 1 && <WalletsPage />}
            </TabPanel>
        </div>
    )
    }
}
export default App
