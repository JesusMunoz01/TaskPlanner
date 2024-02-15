export default function ConfirmationPopup({ actionTitle, actionBody, action, hidePrompt }) {
    return (
        <div className="confirmationPopup" id="confirmationPopup">
            <div className="confirmationBox" id="confirmationBox">
                <div className="confirmationHeader">
                    <h1 aria-label="delActionTitle">{actionTitle}</h1>
                </div>
                <div className="confirmationBody">
                    <p>Are you sure you want to {actionBody}?</p>
                </div>
                <div className="confirmationFooter">
                    <button aria-label="delActionConfirm" onClick={action}>Delete</button>
                    <button aria-label="delActionCancel" onClick={hidePrompt}>Cancel</button>
                </div>
            </div>
        </div>
    )
};
