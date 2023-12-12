import { useState } from "react";
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    async function createUser(e){
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*\W).{8,24}$/;
        if(passwordRegex.test(newPassword)){
            try{
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/addUser`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newUsername,
                        newPassword,
                        })
                    });
                alert("Registration Completed")
                const data = await res.json()
                console.log(data)
            }catch(error){
                console.log(error)
            }
        }
        else
            console.error("Failed Registration")

        setNewUsername('');
        setNewPassword('');
    }

    async function logUser(e){
        e.preventDefault();
        try{
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/userLogin`, {
                method: "POST", headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    })
                });
            const data = await response.json();
            if(data.token){
                setCookies("access_token", data.token, {maxAge: 3600});
                window.localStorage.setItem("userId", data.userId);
                navigate('/');
            }
        }   catch(error){
            console.error(error)
        }

        setUsername('');
        setPassword('');
    }

    return <div>
        <h1>Login</h1>
        <form>
            <label>Username: </label>
            <input id="logUser" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <label>Password: </label>
            <input id="logPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={(e) => logUser(e)}>Login</button>
        </form>
        <h1>Create an Account</h1>
        <form>
            <label htmlFor="createUser">Username: </label>
            <input id="createUser" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}></input>
            <label htmlFor="createPassword">Password: </label>
            <input id="createPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>
            <button onClick={(e) => createUser(e)}>Create Account</button>
        </form>
    </div>
}