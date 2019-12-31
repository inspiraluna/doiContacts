import React, {useEffect, useState, useGlobal, setGlobal, addCallback} from 'reactn';
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from '@material-ui/core/Button';

const EditEmailTemplate = () => {

    const [modus, setModus] = useGlobal("modus")
    const [global] = useGlobal()
    const [tempWallet, setTempWallet] = useGlobal("tempWallet")

    const handleCancel = (e) => {
        setModus('edit')
    }

    return (
        <div>
            <TextareaAutosize
                rows="8" cols="205"
                aria-label="maximum height"
                placeholder=""
                defaultValue={tempWallet ? tempWallet.content : ''}
                onChange={(e) => {
                    const ourTempWallet = tempWallet ? tempWallet : {}
                    ourTempWallet.content = e.target.value
                    setTempWallet(ourTempWallet)
                }}
            />
            <br/>
            <Button color={'primary'} variant="contained" onClick={() => handleCancel()}>Back</Button>
        </div>
    )
}

export default EditEmailTemplate;
