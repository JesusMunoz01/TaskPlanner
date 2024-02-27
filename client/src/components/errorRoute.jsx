export default function ErrorRoute() {

    const redirect = () => {
        window.location.href = "/landing";
    }

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h1>404: Page Not Found</h1>
            <h2>Redirecting to landing page...</h2>
            {setTimeout(redirect, 3000)}
        </div>
    );
}