import { useEffect, useState } from "react";

export default function ErrorRoute() {
    const [timer, setTimer] = useState(5);
    
    useEffect(() => {
        if(timer === 0) return redirect();
        const interval = setInterval(() => {
            setTimer(timer => timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const redirect = () => {
        window.sessionStorage.setItem("selectedRoute", "Home")
        window.location.href = "/";
    }

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", minHeight: "100vh"}}>
            <h1>404: Page Not Found</h1>
            <h2>Redirecting to landing page...</h2>
            <h2>in {timer} seconds</h2>
        </div>
    );
}