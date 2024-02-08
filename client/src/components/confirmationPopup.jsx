export default function ConfirmationPopup({ actionTitle, actionBody, action, hidePrompt }) {
    return (
        <div className="confirmationPopup" id="confirmationPopup">
            <div className="confirmationBox" id="confirmationBox">
                <div className="confirmationHeader">
                    <h1>{actionTitle}</h1>
                </div>
                <div className="confirmationBody">
                    <p>Are you sure you want to {actionBody}?</p>
                </div>
                <div className="confirmationFooter">
                    <button onClick={action}>Delete</button>
                    <button onClick={hidePrompt}>Cancel</button>
                </div>
            </div>
        </div>
    )
};
