import React, { useGlobal,setGlobal } from 'reactn';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Formik } from 'formik';
import Contact from "./Contact";

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    label: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    select: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
        height: 50
    }
}));

const ContactForm = ({addContact}) => {

    const classes = useStyles();
    const wallets = useGlobal("wallets")

 /*   const handleAddContact = (e) => {
        console.log(e.target.value)
        addContact(e.target.value);
        e.target.value = '';
    }

    const handleKeyPress = (e) => {
        console.log(e.target.value)
        if(e.key === 'Enter'){
            addContact(e.target.value);
            e.target.value = '';
        }
    } */

  return (
    <div>
        <Formik
            initialValues={{ email: '', wallet: 0 }}
            validate={values => {
                let errors = {};
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>

                    <TextField
                        type="email"
                        name="email"
                        id="email"

                        label="Request Email Permission"
                        className={classes.textField}
                        margin="normal"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    {errors.email && touched.email && errors.email}

                    <p>&nbsp;</p>

                    <InputLabel htmlFor="age-customized-native-simple" className={classes.label}>Wallet / Email</InputLabel>
                    <NativeSelect
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="wallet"
                        className={classes.select}
                    > {
                        wallets[0].map((wallet,index) => <option value={index} >{wallet.walletName} {wallet.senderEmail}</option>)
                      }
                    </NativeSelect>
                    <p>&nbsp;</p>
                    <button type="submit"  className={classes.button} disabled={isSubmitting}>
                        Add contact
                    </button>
                </form>
            )}
        </Formik>
    </div>
  );
};

export default ContactForm

const walletItem = ({value,index}) => {
    return ( <option value={index}>{value}</option> )
}
