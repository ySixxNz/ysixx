const notification = document.getElementById("notification");
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const link = button.getAttribute("href");
        window.open(link, "_blank");
        showNotification(`Opening ${link}`);
    });
});

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 2000);
}
