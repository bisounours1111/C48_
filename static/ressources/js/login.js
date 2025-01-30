document.addEventListener("DOMContentLoaded", () => {
    const openLoginBtn = document.getElementById("openLoginBtn");
    const loginContainer = document.getElementById("loginContainer");
    const loginContent = document.getElementById("loginContent");

    setupLoginButton();

    function setupLoginButton() {
        if (getCookie("username")) {
            openLoginBtn.textContent = "Déconnexion";
            openLoginBtn.onclick = handleLogout;
        } else {
            openLoginBtn.textContent = "Connexion";
            openLoginBtn.onclick = loadLoginTemplate;
        }
    }

    function loadLoginTemplate() {
        fetch("/get_login_template")
            .then(response => response.text())
            .then(html => {
                loginContent.innerHTML = html;
                loginContainer.classList.remove("hidden");
                setupForms(); // Configure les formulaires après injection
            });
    }

    function handleLogout() {
        fetch("/logout")
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.status === "success") {
                    setupLoginButton();
                }
            });
    }

    window.closeModal = () => {
        loginContainer.classList.add("hidden");
    };
});

function setupForms() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const openLoginBtn = document.getElementById("openLoginBtn");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        fetch("/login", {
            method: "POST",
            body: new FormData(loginForm),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.status === "success") {
                closeModal();
                setupLoginButton();
            }
        });
    });

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        fetch("/register", {
            method: "POST",
            body: new FormData(registerForm),
        })
        .then(response => response.json())
        .then(data => alert(data.message));
    });

    window.toggleForm = (isLogin) => {
        document.getElementById("loginForm").classList.toggle("hidden", !isLogin);
        document.getElementById("registerForm").classList.toggle("hidden", isLogin);

        document.getElementById("loginTab").classList.toggle("bg-blue-500", isLogin);
        document.getElementById("loginTab").classList.toggle("bg-gray-200", !isLogin);
        document.getElementById("registerTab").classList.toggle("bg-blue-500", !isLogin);
        document.getElementById("registerTab").classList.toggle("bg-gray-200", isLogin);

        document.getElementById("registerTab").classList.toggle("text-white", !isLogin);
        document.getElementById("loginTab").classList.toggle("text-white", isLogin);
    };
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        for (let cookie of cookies) {
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.split('=')[1]);
                break;
            }
        }
    }
    return cookieValue;
}
