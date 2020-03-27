import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import s from "../pages/walletCreator/WalletCreator.module.css"

const LoadingSpinner = (props) => (
  <div className={s.loading}>
  <FontAwesomeIcon icon={faSpinner} /> {props.loading}
  </div>
);

export default LoadingSpinner;