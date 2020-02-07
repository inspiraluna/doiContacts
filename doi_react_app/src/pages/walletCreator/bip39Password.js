import React, { useGlobal } from "reactn"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"

const Bip39Password = props => {
    const setPassword1 = useGlobal("password1")[1]

    if (props.display === true) {
        return (
            <div>
                <FormControl fullWidth>
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        fullWidth
                        onChange={e => {
                            setPassword1(e.target.value)
                        }}
                    />
                </FormControl>
            </div>
        )
    } else {
        return <div></div>
    }
}

export default Bip39Password
