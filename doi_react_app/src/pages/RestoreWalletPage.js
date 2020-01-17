import React, { useState, useGlobal } from "reactn"
import s from "./CreateNewWalletPage.module.css"


const RestoreWalletPage = () => {
    const [checked, setChecked] = useGlobal("checked")

    return (
        <div className={s.content}>
            <span>
                <div className={s.firstContent}>
                    <p>
                        Please confirm your recovery phrase 
                    </p>
                </div>
            </span>
        </div>
    )
}

export default RestoreWalletPage

