import { useState } from "react";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    async function createUser(e){
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*\W).{8,24}$/;
        if(passwordRegex.test(newPassword))
        await fetch(`${process.env.REACT_APP_BASE_URL}/addUser`, {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                })
            });
        else
            console.log("Failed")

        setUsername('');
        setPassword('');
    }

    async function logUser(e){
        e.preventDefault();
        await fetch(`${process.env.REACT_APP_BASE_URL}/userLogin`, {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                })
            });

        setNewUsername('');
        setNewPassword('');
    }

    return <div>
        <h1>Login</h1>
        <form>
            <label>Username: </label>
            <input id="logUser" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <label>Password: </label>
            <input id="logPassword" type={password} value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={(e) => logUser(e)}>Login</button>
        </form>
        <h1>Create an Account</h1>
        <form>
            <label>Username: </label>
            <input id="createUser" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}></input>
            <label>Password: </label>
            <input id="createPassword" type={password} value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}></input>
            <button onClick={(e) => createUser(e)}>Create Account</button>
        </form>
    </div>
}