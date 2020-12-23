import React from "reactn"
import { createMuiTheme } from "@material-ui/core/styles";

const ThemeContext = React.createContext();

const ThemeContextProvider = (props) => {
    
    const darkMode = props.darkMode
    let ourNetwork = props.network
    let secondaryColor = "#cd45ff"
    if (ourNetwork === "testnet") secondaryColor = "#e65100"
    if (ourNetwork === "regtest") secondaryColor = "#00bfff"

    const themeX = createMuiTheme({
        palette: {
            type: darkMode === "true" || darkMode === true ? "dark" : "light",
            primary: {
                main: "#0b3e74",
            },
            secondary: {
                main: secondaryColor,
            },
            background: {
                default: darkMode === "false" || darkMode === false ? "#e5e3ff" : "#303030",
            },
        },
        overrides: {
            MuiListItemText: {
                primary: {
                    color: secondaryColor,
                },
                secondary: {
                    color: secondaryColor,
                },
            },
        },
    })

    return <ThemeContext.Provider value={themeX}>{props.children}</ThemeContext.Provider>
}

export { ThemeContext, ThemeContextProvider };