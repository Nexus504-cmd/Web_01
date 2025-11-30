document.getElementById("Accion").onclick =(e)=> {
    e.preventDefault();
    const inputs = document.querySelectorAll(".text"); 
    const selects = document.getElementById("Asunto");
    const textareas = document.getElementById("grande");
    const Accion=document.getElementById("Accion")
    inputs.forEach(input => input.value = "");
    selects.selectedIndex = 0;
    textareas.value = "";
    alert("Enviado correctamente");
    Accion.style.backgroundColor="Gray";
    document.getElementById("Accion").disabled = true;
};

