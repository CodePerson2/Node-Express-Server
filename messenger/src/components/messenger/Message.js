
const Message = ({darkMode, message}) => {
    return (
        <div className="App-MessageBox-Messages-Message" style={{ textAlign : (message.right ? 'right' : 'left')}}>
            <div className={`App-MessageBox-Messages-Message-Time ${darkMode ? 'text2-D' : 'text2-L'}`}>{message.time}</div>
            <div className="App-MessageBox-Messages-Message-Bub">
                <div className={`App-MessageBox-Messages-Message-Bub-Text ${message.right ? 'bubble-B-D' : (darkMode ? 'bubble-G-D' : 'bubble-G-L')}`}>{message.message}</div>
            </div>
            <div className={`App-MessageBox-Messages-Message-Name ${message.right ? 'text3-D' : 'text3-L'}`}>{message.name}</div>
            
        </div>
    )
}

export default Message
