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

const WalletList = ({checked}) => {

    const global = useGlobal()
    const [ wallets, setWallets ] = useGlobal('wallets')

   const handleDetail = (index) => {
       const currentGlobal = global;
       currentGlobal.activeWallet = index
       currentGlobal.modus = 'detail'
       setGlobal(currentGlobal)
       console.log('activeWallet now in global', global.activeWallet + "/" + global.modus)
   }

   const handleEdit = (index) => {
       const  currentGlobal = global;
        currentGlobal.activeWallet = index
        currentGlobal.modus = 'edit'
        currentGlobal.tempWallet = wallets[index]
        setGlobal(currentGlobal)
        console.log('activeWallet now in global',global.activeWallet+"/"+global.modus)
    }

    const handleRemove = (index) => {
        const currentWallets = wallets
        currentWallets.splice(index, 1);
        setWallets(currentWallets)
    }

    const ourWallets = wallets?wallets:[]//global.wallets?global.wallets:[]
    console.log('ourWallets',ourWallets)
    const walletNode = ourWallets.map((item,index) => {
    console.log('item',item)
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
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(index)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)
    });

    return (<List dense={true} >{walletNode}</List>)
}

export default WalletList
