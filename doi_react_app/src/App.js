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
import initStorage from "./utils/storage"
import WalletCreator from "./pages/walletCreator/WalletCreator"
import AppBar from "@material-ui/core/AppBar"
import {appVersion} from "./appVersion";
import Settings from "./pages/Settings"
import {ThemeContextProvider} from "./contexts/theme"
import PhoneIcon from "@material-ui/icons/Phone"
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet"
import SettingsIcon from "@material-ui/icons/Settings"
import CustomizedSnackbars from "./components/MySnackbarContentWrapper"
import {getServerStatus, network} from "doichain";
import { CssBaseline } from "@material-ui/core"


const App = props => {

    const [globalState, setGlobalState] = useGlobal()
    const [currentTab, setCurrentTab] = useGlobal("currentTab")
    const setModus = useGlobal("modus")[1]
    const setActiveWallet = useGlobal("activeWallet")[1]
    const [darkMode] = useGlobal("darkMode")
    const setServerStatus = useGlobal("serverStatus")[1]
    const [encryptedSeed] = useGlobal("encryptedSeed")
    const [balance, setBalance] = useGlobal("balance")
    register()

    let GLOBAL = global || window;

    useEffect(() => {
        initStorage(props.cordova, globalState, setGlobalState)
        const runGetServerStatus = async () => {
            const status = await getServerStatus();
            if(status) setServerStatus(status.data.version)
        }
        runGetServerStatus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalState.network])

    if(balance===undefined) setBalance(0)

    if(globalState.network)
        network.changeNetwork(globalState.network)
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
       if(!encryptedSeed){
           return <WalletCreator />
             } else {
                 return (
                    <ThemeContextProvider network={GLOBAL.network} darkMode={darkMode} >
                    <CssBaseline />
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
                                 <Tab icon={<PhoneIcon id="phoneIcon" color="secondary"/>} {...a11yProps(0)} />
                                 <Tab
                                     icon={<AccountBalanceWalletIcon id="walletIcon" color="secondary" />}
                                     {...a11yProps(1)}
                                 />
                                 <Tab icon={<SettingsIcon id="settingsIcon" color="secondary" />} {...a11yProps(2)} />
                                 <Tab
                                     label={appVersion}
                                     style={{
                                         align: "center",
                                         verticalAlign: "middle",
                                         fontSize: "9px"
                                     }}
                                 ></Tab>
                             </Tabs>
                         </AppBar>
                         <TabPanel value={Number(our_CurrentTab)} index={0}>
                             {Number(currentTab) === 0 && <ContactsPage />}
                         </TabPanel>
                         <TabPanel value={Number(our_CurrentTab)} index={1}>
                             {Number(currentTab) === 1 && <WalletsPage />}
                         </TabPanel>
                         <TabPanel value={Number(our_CurrentTab)} index={2}>
                             {Number(currentTab) === 2 && <Settings />}
                         </TabPanel>
                         <CustomizedSnackbars />
                     </div>
                     </ThemeContextProvider>
                 )
             }
}
export default App
