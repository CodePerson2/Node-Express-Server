import React from 'react'

const Notification = ({darkMode, notifText, notifState}) => {
    return (
        <div className={`Notif ${darkMode? 'input-D' : 'input-L'}`} style={{top: notifState ? '20%' : "-20%", opacity: notifState ? '1' : '0'}}>
            {notifText}
        </div>
    )
}

export default Notification
