import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from 'react-cookie'

export const Home = (data) => {
    const [tasks, setTasks] = useState(data.data);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [cookies, ] = useCookies(["access_token"]);

    async function sendTask(e){
        e.preventDefault();
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/addTask`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
                auth: cookies.access_token
            },
            body: JSON.stringify({
                title,
                desc,
                })
            });
        console.log(res)
        const task = await res.json()
        console.log(task)
        setTasks([...tasks, task])

        setTitle('');
        setDesc('');
    }

    async function delTask(taskId){
        await fetch(`${process.env.REACT_APP_BASE_URL}/tasks/${taskId}`, {
            method: "DELETE", headers: {auth: cookies.access_token}});

        setTasks(tasks.filter((task) => task._id !== taskId))
    }

    return <div>
        <div className="intro">
        <h1>Checklist</h1>
            <div className="tasks">
                {tasks.map((task)=> (
                    <li key={task._id}>
                        {task.title}
                        <button onClick={() => delTask(task._id)}>x</button>
                    </li>
                ))}
            </div>
        </div>
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