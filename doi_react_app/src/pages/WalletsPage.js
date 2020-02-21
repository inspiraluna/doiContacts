import React, { useEffect, useState, useGlobal } from "reactn"
import bitcore from "bitcore-doichain"
import WalletList from "../components/WalletList"
import Slide from "@material-ui/core/Slide"
import TextField from "@material-ui/core/TextField"
import WalletItem from "../components/WalletItem"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import Button from "@material-ui/core/Button"
import QRCode from "qrcode-react"
import SendAmount from "../components/SendAmount"
import EditEmailTemplate from "../components/EditEmailTemplate"
import { useTranslation } from "react-i18next"

/* eslint no-template-curly-in-string: "off" */

const WalletsPage = () => {
    const [amount, setAmount] = useState(0) //receive amount
    const [walletItemsChanged, setWalletItemsChanged] = useState(false)
    const [wallets, setWallets] = useGlobal("wallets")
    const [tempWallet, setTempWallet] = useGlobal("tempWallet")
    const [activeWallet, setActiveWallet] = useGlobal("activeWallet")
    const [modus, setModus] = useGlobal("modus")
    const [utxos, setUTXOs] = useGlobal("utxos")
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
    const addWallet = (
        senderName,
        senderEmail,
        subject,
        content,
        contentType,
        redirectUrl,
        returnPath
    ) => {
        const ourWallet = bitcore.createWallet()
        const wallet = {}
        // wallet.walletName = walletName
        wallet.senderName = senderName
        wallet.senderEmail = senderEmail
        wallet.subject = subject
        wallet.content = content
        wallet.contentType = contentType
        wallet.redirectUrl = redirectUrl
        wallet.returnPath = returnPath
        wallet.privateKey = ourWallet.privateKey.toString()
        wallet.publicKey = ourWallet.publicKey.toString()

        let newwallets = wallets
        newwallets.push(checkDefaults(wallet))
        setWallets(newwallets)
        setWalletItemsChanged(true)
        setActiveWallet(wallets.length - 1)
        setModus("detail")
        setTempWallet(undefined)
    }

    const updateWallet = (
        senderName,
        senderEmail,
        subject,
        content,
        contentType,
        redirectUrl,
        returnPath
    ) => {
        const wallet = wallets[activeWallet]
        wallet.senderName = senderName
        wallet.senderEmail = senderEmail
        wallet.subject = subject
        wallet.content = content
        wallet.contentType = contentType
        wallet.redirectUrl = redirectUrl
        wallet.returnPath = returnPath

        wallets[activeWallet] = checkDefaults(wallet)
        setWallets(wallets)
        setWalletItemsChanged(true)
        setModus("detail")
        setTempWallet(undefined)
    }

    const handleCancel = e => {
        setModus("list")
        setActiveWallet(undefined)
    }
    const editEmailTemplate = e => {
        setModus("editEmailTemplate")
    }

    useEffect(() => {
        setWalletItemsChanged(false)
    }, [walletItemsChanged])

    const handleReceive = e => {
        setModus("receive")
    }

    const handleSend = e => {
        setModus("send")
    }

    const handleVerify = async () => {
        const our_wallet = wallets[activeWallet]
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
        bitcore.updateWalletBalance(our_wallet, utxosResponse.balance)
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
                                onClick={() => handleReceive()}
                            >
                                {t("button.receive")}{" "}
                            </Button>
                            <Button
                                color={"primary"}
                                id={"send"}
                                variant="contained"
                                onClick={() => handleSend()}
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

            const address = wallets[activeWallet].addresses[0].address
            const walletName = wallets[activeWallet].walletName
            let url = "doicoin:" + address
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
                            <span id="receiveDoi">{t("walletPage.receiveDoi")}</span> <br /> {address} <br />
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
                                    const senderName = e.target.senderName.value.trim()
                                    const senderEmail = e.target.senderEmail.value.trim()
                                    const subject = e.target.subject.value.trim()
                                    const content =
                                        tempWallet && tempWallet.content
                                            ? tempWallet.content.trim()
                                            : ""
                                    const contentType = e.target.contentType.value.trim()
                                    let redirectUrl = e.target.redirectUrl.value.trim()
                                    if (
                                        !redirectUrl.startsWith("http://") &&
                                        !redirectUrl.startsWith("https://")
                                    )
                                        redirectUrl = "https://" + redirectUrl

                                    const returnPath = e.target.returnPath
                                        ? e.target.returnPath.value.trim()
                                        : undefined

                                    if (activeWallet === undefined)
                                        addWallet(
                                            senderName,
                                            senderEmail,
                                            subject,
                                            content,
                                            contentType,
                                            redirectUrl,
                                            returnPath
                                        )
                                    else
                                        updateWallet(
                                            senderName,
                                            senderEmail,
                                            subject,
                                            content,
                                            contentType,
                                            redirectUrl,
                                            returnPath
                                        )
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
                                    type="submit"
                                    id={"saveWallet"}
                                    color={"primary"}
                                    variant="contained"
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
                </div>
            )
        }
    }
}

export default WalletsPage
