console.log("Toast JS Loaded");
function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = "";

    if (type !== "success") {
        toast.classList.add(type);
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.className = "";
    }, 3000);

}showToast("Toast Test");