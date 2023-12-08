import { useState } from "react";

export const Home = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    function sendTask(e){
        e.preventDefault();
    }

    return <div>
        <h1>Checklist</h1>
        <h2>Add Task</h2>
        <form>
            <label>Title: </label>
            <input id="taskTitle" value={title} onChange={(e) => setTitle(e.target.value)}></input>
            <label>Description: </label>
            <input id="taskDesc" value={desc} onChange={(e) => setDesc(e.target.value)}></input>
            <button onClick={(e) => sendTask(e)}>Submit</button>
        </form>
    </div>
}