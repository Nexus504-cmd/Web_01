document.getElementById("Accion").onclick =(e)=> {
    e.preventDefault();
    const inputs = document.getElementById("text");
    const selects = document.getElementById("Asunto");
    const textareas = document.getElementById("grande");
    const Accion=document.getElementById("Accion")
    inputs.value = "";
    selects.selectedIndex = 0;
    textareas.value = "";
    alert("Enviado correctamente");
    Accion.style.backgroundColor="Gray";
    document.getElementById("Accion").disabled = true;
};

