import React, { useGlobal } from 'reactn';
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from '@material-ui/core/Button';

const EditEmailTemplate = () => {

    const setModus = useGlobal("modus")[1]
    const [tempWallet, setTempWallet] = useGlobal("tempWallet")

    const handleCancel = (e) => {
        setModus('edit')
    }

    return (
        <div>
            <TextareaAutosize
                rows={16}  cols="65"
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
