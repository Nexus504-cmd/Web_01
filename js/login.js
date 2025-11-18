

        // VALIDACIÓN DEL FORMULARIO

        const form = document.getElementById("loginForm");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        form.addEventListener("submit", function(e) {
            let valid = true;

            emailError.textContent = "";
            passwordError.textContent = "";

            if (email.value.trim() === "") {
                emailError.textContent = "Ingresa tu correo.";
                valid = false;
            }

            if (password.value.trim() === "") {
                passwordError.textContent = "Ingresa tu contraseña.";
                valid = false;
            } 
            else if (password.value.length < 6) {
                passwordError.textContent = "La contraseña debe tener mínimo 6 caracteres.";
                valid = false;
            }

            if (!valid) e.preventDefault();
        });


        // CAMBIO DE TEMA
        const toggleBtn = document.getElementById("themeToggle");

        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            toggleBtn.textContent = 
                document.body.classList.contains("dark") ? "☀️" : "🌙";
        });
