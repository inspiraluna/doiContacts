import React, { useState, useGlobal } from "reactn"
import Slide from "@material-ui/core/Slide"
import TextField from "@material-ui/core/TextField"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import Button from "@material-ui/core/Button"
import QRCode from "qrcode-react"
import {extend} from "lodash"
import { useTranslation } from "react-i18next"
import useEventListener from '../hooks/useEventListener';

import WalletItem from "../components/WalletItem"
import WalletList from "../components/WalletList"
import SendAmount from "../components/SendAmount"
import EditEmailTemplate from "../components/EditEmailTemplate"
import UnlockPasswordDialog from "../components/UnlockPasswordDialog"

import {createHdKeyFromMnemonic} from "doichain";
import {createNewWallet} from "doichain/lib/createNewWallet";
import {generateNewAddress} from "doichain/lib/generateNewAddress";
import { CopyToClipboard } from "react-copy-to-clipboard"
import FileCopyIcon from "@material-ui/icons/FileCopy"

/* eslint no-template-curly-in-string: "off" */
var GLOBAL = global || window;

const WalletsPage = () => {
    const [amount, setAmount] = useState(0) //receive amount
    const [wallets, setWallets] = useGlobal("wallets")
    const [tempWallet, setTempWallet] = useGlobal("tempWallet")
    const [activeWallet, setActiveWallet] = useGlobal("activeWallet")
    const [modus, setModus] = useGlobal("modus")
    const [encryptedSeed] = useGlobal("encryptedSeed")
    const [openUnlock, setOpenUnlock] = useGlobal("openUnlock")
    const [password] = useGlobal("password")
    const setOpenSnackbar = useGlobal("errors")[1]
    const [t] = useTranslation()

    const checkDefaults = wallet => {
        const our_senderName = " "
        const our_senderEmail = "info@doichain.org"
        const our_subject = "Doichain Contacts Request"
        const our_content =
            "Hello, please give me permission to write you an email.\n\n${confirmation_url}\n\n Yours\n\nPeter"
        const our_contentType = "text/plain"
        const our_redirectUrl = "http://www.doichain.org"
        const our_returnPath = "doichain@doichain.org"

        // if(!walletName) walletName = our_walletName
        if (!wallet.senderName) wallet.senderName = our_senderName
        if (!wallet.senderEmail) wallet.senderEmail = our_senderEmail
        if (!wallet.subject) wallet.subject = our_subject
        if (!wallet.content) wallet.content = our_content
        if (!wallet.contentType) wallet.contentType = our_contentType
        if (!wallet.redirectUrl) wallet.redirectUrl = our_redirectUrl
        if (!wallet.returnPath) wallet.returnPath = our_returnPath
        return wallet
    }

    const addWallet = async (decryptedSeedPhrase,password) => {
        console.log('adding wallet with password', password)
        const hdKey = createHdKeyFromMnemonic(decryptedSeedPhrase,password) //TODO use the same password here? is that correct - it is possible to use xpubkey of hdkey here (!)
        let newWallet = await createNewWallet(hdKey,wallets.length)
        newWallet = extend(newWallet, openUnlock)
        let newwallets = wallets
        newwallets.push(checkDefaults(newWallet))
        setWallets(newwallets)
        setActiveWallet(wallets.length - 1)
        setModus("detail")
        setTempWallet(undefined) //we use to change data in the form (is this acceptable)
    }

    const updateWallet = (formData) => {
        let wallet = wallets[activeWallet]
        wallet = extend(wallet, formData)
        wallets[activeWallet] = checkDefaults(wallet)
        setWallets(wallets)
        setModus("detail")
        setTempWallet(undefined) //we use to change data in the form
    }

    const handleCancel = e => {
        setModus("list")
        setActiveWallet(undefined)
    }
    const editEmailTemplate = e => {
        setModus("editEmailTemplate")
    }

    useEventListener(document, "backbutton", () => setModus("list"));

    const handleVerify = async () => {
      /*  const our_wallet = wallets[activeWallet]
        const senderEmail = our_wallet.senderEmail
        const privateKey = our_wallet.privateKey
        const address = our_wallet.addresses[0].address
        console.log("preparing email for verification", senderEmail)
        const parts = senderEmail.split("@")
        const domain = parts[parts.length - 1]
        const publicKeyAndAddressOfValidator = await bitcore.getValidatorPublicKey(domain)
        console.log("publicKeyAndAddressOfValidator", publicKeyAndAddressOfValidator)
        const validatorPublicKey = publicKeyAndAddressOfValidator.key
        //create a signature over our email address
        //1. create a signature with our_sender_email and our private_key, use it as our nameId
        const signature = bitcore.getSignature(senderEmail, privateKey)
        console.log(address + " signature for " + senderEmail, privateKey)
        //2. store encrypted entry on ipfs and call name_doi on Doichain. Encrypted with PublicKey of validator
        // - recipient address is public key gathered by domain name (dns) - responsible validator (Bob)

        const nameId = "es/" + signature
        // const encryptedEmailVerification = bitcore.encryptEmailVerification(validatorPublicKey,senderEmail,address)
        //const unspentTx = await getUTXOs4DoiRequest(address,utxos)
        //console.log('all unspentTx for address'+address,unspentTx)

        const utxosForEmailVerificationRequest = await bitcore.getUTXOs4EmailVerificationRequest(
            address,
            utxos
        )
        console.log("utxosForEmailVerificationRequest", utxosForEmailVerificationRequest)
        //addIPFS
        // a testnet address from a public key
        // from a der hex encoded string
        const _publicKey = new bitcore.PublicKey(validatorPublicKey)
        const destAddress = new bitcore.Address(_publicKey).toString()
        console.log("destAddress", destAddress)
        const changeAddress = address
        const txSignedSerialized = bitcore.createRawDoichainTX(
            nameId,
            "ipfs-hash should be here",
            destAddress,
            changeAddress,
            privateKey,
            utxosForEmailVerificationRequest, //here's the necessary utxos and the balance and change included
            bitcore.constants.NETWORK_FEE.satoshis, //for storing this record
            bitcore.constants.EMAIL_VERIFICATION_FEE.satoshis //for validator bob (0.01), to validate (reward) and store (0.01) the email verification
        )

        //TODO handle response and create offchain utxos and update balance
        const utxosResponse = await bitcore.broadcastTransaction(null, txSignedSerialized)
        setUTXOs(utxosResponse)
        bitcore.updateWalletBalance(our_wallet, utxosResponse.balance)*/
    }

    if (modus === "list") {
        return (
            <div>
                <WalletList />
                <div style={{ float: "right" }}>
                    <Fab
                        aria-label={"new contact"}
                        color={"primary"}
                        id={"add"}
                        style={{
                            position: "absolute",
                            right: "7em",
                            bottom: "3em"
                        }}
                        onClick={() => {
                            setModus("add")
                            setActiveWallet(undefined)
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </div>
            </div>
        )
    } else {
        if (modus === "detail") {
            return (
                <div>
                    <Slide
                        aria-label="wallet-detail"
                        direction={"up"}
                        in={activeWallet !== undefined && modus === "detail"}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div>
                            <Button
                                color={"primary"}
                                variant="contained"
                                id={"receive"}
                                onClick={() => setModus("receive")}
                            >
                                {t("button.receive")}{" "}
                            </Button>
                            <Button
                                color={"primary"}
                                id={"send"}
                                variant="contained"
                                onClick={() => setModus("send")}
                            >
                                {t("button.send")}{" "}
                            </Button>
                            {/*                            <Button
                                color={"primary"}
                                id={"cancel"}
                                variant="contained"
                                onClick={() => handleCancel()}
                            >
                                {t("button.cancel")}
                            </Button>*/}
                            <Button
                                color={"primary"}
                                variant="contained"
                                onClick={() => handleVerify()}
                            >
                                {t("button.verify")}
                            </Button>
                            <br />
                            <br />
                            <WalletItem
                                senderName={wallets[activeWallet].senderName}
                                senderEmail={wallets[activeWallet].senderEmail}
                                subject={wallets[activeWallet].subject}
                                content={wallets[activeWallet].content}
                                publicKey={wallets[activeWallet].publicKey}
                                contentType={wallets[activeWallet].contentType}
                                redirectUrl={wallets[activeWallet].redirectUrl}
                                returnPath={wallets[activeWallet].returnPath}
                            />
                        </div>
                    </Slide>
                </div>
            )
        } else if (modus === "receive") {

            const handleAmount = e => {
                const ourAmount = e.target.value
                if (isNaN(ourAmount)) return
                setAmount(ourAmount)
            }

            const addressCount = wallets[activeWallet].addresses.length-2
            let address = wallets[activeWallet].addresses[addressCount].address

            if(wallets[activeWallet].addresses[addressCount].transactions.length>0)
                address = generateNewAddress(wallets[activeWallet].publicExtendedKey,
                    wallets[activeWallet].addresses[addressCount].derivationPath)

            const walletName = wallets[activeWallet].walletName
            let url = "doicoin:" + address

            const vibration = () => {
                let time = 500;
                navigator.vibrate(time);
            }

            if (amount) url += "?amount" + amount

            return (
                <div>
                    <Slide
                        aria-label="wallet-receive"
                        direction={"up"}
                        in={activeWallet !== undefined && modus === "receive"}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div>
                            <Button
                                color={"primary"}
                                id={"back"}
                                variant="contained"
                                onClick={() => setModus("detail")}
                            >
                                {t("button.back")}
                            </Button>{" "}
                            <br /> <br />
                            {walletName} <br />
                            <span id="receiveDoi">{t("walletPage.receiveDoi")}</span> <br />{" "}
                            <span id="address">{address}</span>
                            <CopyToClipboard
                                text={address ? address.toString() : ""}
                                onCopy={() => {
                                    setOpenSnackbar({
                                        open: true,
                                        msg: t("walletItem.doiCoinAddressCopied"),
                                        type: "success"
                                    })
                                    vibration()
                                }}
                            >
                                <FileCopyIcon color={"primary"} id="copy"></FileCopyIcon>
                            </CopyToClipboard><br /><br />
                            {t("walletPage.amount")} <br />
                            <TextField
                                id="amount"
                                name="amount"
                                label={t("walletPage.amountLabel")}
                                type={"Number"}
                                margin="normal"
                                onChange={e => handleAmount(e)}
                                onBlur={e => handleAmount(e)}
                            />{" "}
                            <br />
                            <QRCode value={url} />
                            <br />
                            <br />
                        </div>
                    </Slide>
                </div>
            )
        } else if (modus === "send") {
            return <SendAmount />
        } else if (modus === "editEmailTemplate") {
            return <EditEmailTemplate />
        } else if (modus === "edit" || modus === "add") {
            return (
                <div>
                    <Slide
                        aria-label="wallet-edit"
                        direction={"up"}
                        in={modus === "edit" || modus === "add"}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div>
                            <form
                                onSubmit={e => {
                                    e.preventDefault()
                                    const formData = {}
                                    formData.senderName = e.target.senderName.value.trim()
                                    formData.senderEmail = e.target.senderEmail.value.trim()
                                    formData.subject = e.target.subject.value.trim()
                                    formData.content =
                                        tempWallet && tempWallet.content
                                            ? tempWallet.content.trim()
                                            : ""
                                    formData.contentType = e.target.contentType.value.trim()
                                    formData.redirectUrl = e.target.redirectUrl.value.trim()
                                    if (
                                        !formData.redirectUrl.startsWith("http://") &&
                                        !formData.redirectUrl.startsWith("https://")
                                    )
                                    formData.redirectUrl = "https://" + formData.redirectUrl

                                    formData.returnPath = e.target.returnPath
                                        ? e.target.returnPath.value.trim()
                                        : undefined

                                    if (activeWallet === undefined)
                                    setOpenUnlock(formData)
                                    else
                                        updateWallet(formData)
                                }}
                            >
                                <TextField
                                    id="senderName"
                                    name="senderName"
                                    label="Sender Name"
                                    fullWidth={true}
                                    // defaultValue={wallets[activeWallet]?wallets[activeWallet].walletName:''}
                                    defaultValue={tempWallet ? tempWallet.senderName : ""}
                                    margin="normal"
                                    onChange={e => {
                                        const ourTempWallet = tempWallet ? tempWallet : {}
                                        ourTempWallet.senderName = e.target.value
                                        setTempWallet(ourTempWallet)
                                    }}
                                />{" "}
                                <br />
                                <TextField
                                    id="senderEmail"
                                    label={t("walletPage.senderLabel")}
                                    fullWidth={true}
                                    defaultValue={tempWallet ? tempWallet.senderEmail : ""}
                                    margin="normal"
                                    onChange={e => {
                                        const ourTempWallet = tempWallet ? tempWallet : {}
                                        ourTempWallet.senderEmail = e.target.value
                                        setTempWallet(ourTempWallet)
                                    }}
                                />{" "}
                                <br />
                                <TextField
                                    id="subject"
                                    label={t("walletPage.subjectLabel")}
                                    fullWidth={true}
                                    defaultValue={tempWallet ? tempWallet.subject : ""}
                                    margin="normal"
                                    onChange={e => {
                                        const ourTempWallet = tempWallet ? tempWallet : {}
                                        ourTempWallet.subject = e.target.value
                                        setTempWallet(ourTempWallet)
                                    }}
                                />{" "}
                                <br />
                                <label>{t("walletPage.contentTypeLabel")}</label>
                                <br />
                                <select
                                    name="contentType"
                                    defaultValue={
                                        wallets[activeWallet] && tempWallet
                                            ? tempWallet.contentType
                                            : ""
                                    }
                                >
                                    {/* <select name="contentType" defaultValue={wallets[activeWallet] && wallets[activeWallet].contentType}> */}
                                    <option value="text">text/plain</option>
                                    <option value="html">text/html</option>
                                    <option value="json">text/json (mixed)</option>
                                </select>
                                <br />
                                {/* <TextField
                                        id="content"
                                        label="Email Content Template"
                                        fullWidth={true}
                                        rows={5}
                                        defaultValue={wallets[activeWallet]?wallets[activeWallet].content:''}
                                        margin="normal"
                                    /> */}
                                <Button
                                    variant="outlined"
                                    id="editEmailTemplate"
                                    color="primary"
                                    onClick={() => editEmailTemplate()}
                                >
                                    {t("walletPage.editEmailTemp")}
                                </Button>
                                <br />
                                <TextField
                                    id="redirectUrl"
                                    label={t("walletPage.labelRedUrl")}
                                    fullWidth={true}
                                    defaultValue={tempWallet ? tempWallet.redirectUrl : ""}
                                    margin="normal"
                                    onChange={e => {
                                        const ourTempWallet = tempWallet ? tempWallet : {}
                                        ourTempWallet.redirectUrl = e.target.value
                                        setTempWallet(ourTempWallet)
                                    }}
                                />{" "}
                                <br />
                                {/* <TextField
                                        id="returnPath"
                                        label="ReturnPath (email)"
                                        fullWidth={true}
                                        defaultValue={tempWallet?tempWallet.returnPath:''}
                                        margin="normal"
                                        onChange={(e) => {
                                            const ourTempWallet = tempWallet?tempWallet:{}
                                            ourTempWallet.returnPath = e.target.value
                                            setTempWallet(ourTempWallet)}}
                                    />     <br/> */}
                                <Button
                                    color={"primary"}
                                    variant="contained"
                                    type="submit"
                                    id="saveWallet"
                                >
                                    {activeWallet !== undefined
                                        ? t("walletPage.updateWallet")
                                        : t("walletPage.addWallet")}
                                </Button>
                            </form>
                            <Button
                                color={"primary"}
                                id="cancel"
                                variant="contained"
                                onClick={() => handleCancel()}
                            >
                                {t("button.cancel")}
                            </Button>
                        </div>
                    </Slide>
                    <UnlockPasswordDialog callback={addWallet} />
                </div>
            )
        }
    }
}

export default WalletsPage
