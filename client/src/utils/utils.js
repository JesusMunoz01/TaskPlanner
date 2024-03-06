export function setActiveLink(route) {
    window.sessionStorage.setItem("selectedRoute", route)
    const links = document.getElementById("links").children;
    for(const element of links) {
        if(element.children[0].id === route)
            element.children[0].className = "navbar active";
        else
            element.children[0].className = "";
    };
}