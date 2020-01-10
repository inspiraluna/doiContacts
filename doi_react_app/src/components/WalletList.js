import React, {useGlobal, useState} from 'reactn';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete'
import List from "@material-ui/core/List";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

const WalletList = () => {

    const [wallets, setWallets] = useGlobal('wallets')
    const [open, setOpen] = useState(undefined);
    const setModus = useGlobal("modus")[1]
    const setActiveWallet = useGlobal("activeWallet")[1]
    const setTempWallet = useGlobal("tempWallet")[1]

    const handleClose = () => {
        setOpen(undefined)
    };

    const handleDetail = (index) => {
        setModus('detail')
        setActiveWallet(index)
    }

    const handleEdit = (index) => {
        setModus('edit')
        setActiveWallet(index)
        setTempWallet(wallets[index])
    }

    const handleRemove = () => {
        const index = open
        const currentWallets = wallets
        currentWallets.splice(index, 1);
        setWallets(currentWallets)
        setModus('list')
    }

    const ourWallets = wallets ? wallets : []
    const walletNode = ourWallets.map((item, index) => {
        return (
            <ListItem key={index} onClick={() => handleDetail(index)}>
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={item.senderEmail}
                    secondary={
                        "Balance: DOI " + Number(item.balance?item.balance:0).toFixed(8)+" "+(
                            (item.unconfirmedBalance!==undefined &&
                                item.unconfirmedBalance>0)?'(unconfirmed: DOI '+item.unconfirmedBalance+') ':''
                        )
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={() => handleEdit(index)} edge="end" aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={ () => setOpen(index) }>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)
    });

    return (<div>
        <Dialog
            open={open!==undefined}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Do you really want to delete this wallet? this process cannot be undone
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleRemove()} color="primary" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
        <List dense={true}>{walletNode}</List>
    </div>)
}

export default WalletList
