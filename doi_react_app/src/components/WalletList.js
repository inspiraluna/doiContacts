import React, { useGlobal,setGlobal } from 'reactn';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete'
import DetailsIcon from '@material-ui/icons/Details';
import List from "@material-ui/core/List";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const WalletList = () => {

    const global = useGlobal()
    const [ wallets, setWallets ] = useGlobal('wallets')
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
        const currentGlobal = global;
       currentGlobal.modus = 'list'
       setGlobal(currentGlobal)
    };

   const handleDetail = (index) => {
       const currentGlobal = global;
       currentGlobal.activeWallet = index
       currentGlobal.modus = 'detail'
       setGlobal(currentGlobal)
   }

   const handleEdit = (index) => {
       const  currentGlobal = global;
        currentGlobal.activeWallet = index
        currentGlobal.modus = 'edit'
        currentGlobal.tempWallet = wallets[index]
        setGlobal(currentGlobal)
    }

    const handleRemove = (index) => {
        const currentWallets = wallets
        currentWallets.splice(index, 1);
        setWallets(currentWallets)
        const currentGlobal = global;
        currentGlobal.modus = 'list'
        setGlobal(currentGlobal)
    }

    const ourWallets = wallets?wallets:[]
    const walletNode = ourWallets.map((item,index) => {

        return (
            <ListItem key={index} onClick={() => handleDetail(index)}>
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={item.senderEmail}
                    secondary={"Balance: "+wallets[index].balance}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={() => handleEdit(index)} edge="end" aria-label="edit">
                        <DetailsIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={handleClickOpen}>
                        <DeleteIcon />
                        <Dialog
        open={open}
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
          <Button onClick={() => handleRemove(index)} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)
    });

    return (<List dense={true} >{walletNode}</List>)
}

export default WalletList
