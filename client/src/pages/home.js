import { useState } from "react";
import { useEffect } from "react";

export const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    async function sendTask(e){
        e.preventDefault();
        await fetch(`${process.env.REACT_APP_BASE_URL}/addTask`, {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                desc,
                })
            });

        setTitle('');
        setDesc('');
    }

    useEffect(() => {
        console.log("...calling effect");
          (async () => {
            try{
            console.log("...making fetch call");
            const taskResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchTasks`);
            const taskData = await taskResponse.json();
            console.log("...updating state");
            setTasks(taskData);
          } catch(error){

          }
        })();
      }, []);

    return <div>
        <div className="intro">
        <h1>Checklist</h1>
            <div className="tasks">
                {tasks.map((task)=> (
                    <li key={task._id}>
                        {task.title}
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