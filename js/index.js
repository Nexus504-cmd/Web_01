const modal = document.getElementById("modal");
const modalcontenido = document.getElementById("modal-contenido");
const botones = document.querySelectorAll("#btn-ofertas");
//Variables del modal
const modaltitulo = document.getElementById("modal-infotitulo");
const modaldescripcion = document.getElementById("modal-descripcion");
const modalclima = document.getElementById("modal-clima");
const modalaño = document.getElementById("modal-año");
const modalubicacion = document.getElementById("modal-ubicacion");
const modalturismo = document.getElementById("modal-turismo");
const modalprecio = document.getElementById("modal-precio");

//informacion general
//const indexcard = document.getElementById("index-cards");
//Lima
const arrayInfoLima = ["Templado, húmedo y sin lluvias intensas durante el año.",
    "1535",
    "Costa central del Perú, a orillas del océano Pacífico.",
    "Plaza Mayor, Miraflores, Barranco, Huaca Pucllana, Circuito Mágico del Agua, Museo Larco."
]

//Cuzco
const arrayInfoCuzco = [
    "Clima seco y templado, con noches frías.",
    "Entre los siglos XI y XII (como capital inca).",
    "Sierra sur del Perú, en la cordillera de los Andes.",
    "Plaza de Armas, Sacsayhuamán, Qorikancha, Valle Sagrado, Machu Picchu."
];
const arrayInfoArequipa = [
    "Clima seco, soleado y templado casi todo el año.",
    "1540",
    "Sur del Perú, al pie del volcán Misti.",
    "Monasterio de Santa Catalina, Plaza de Armas, Cañón del Colca, Mirador de Yanahuara."
];
//Arequipa
botones.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const indexcard = e.target.closest(".index_cards");
        const titulo = indexcard.querySelector("#titulo").textContent;
        const descripcion = indexcard.querySelector("#descripcion").textContent;
        const precio = indexcard.querySelector("#precio").textContent;


        modal.style.display = "flex";
        modaltitulo.textContent = titulo;
        modaldescripcion.textContent = descripcion;

        switch (titulo) {
            case "Lima":
                modalclima.textContent = arrayInfoLima[0];
                modalaño.textContent = arrayInfoLima[1];
                modalubicacion.textContent = arrayInfoLima[2];
                modalturismo.textContent = arrayInfoLima[3];
                break;
            case "Cusco":
                modalclima.textContent = arrayInfoCuzco[0];
                modalaño.textContent = arrayInfoCuzco[1];
                modalubicacion.textContent = arrayInfoCuzco[2];
                modalturismo.textContent = arrayInfoCuzco[3];
                break;
            case "Arequipa":
                modalclima.textContent = arrayInfoArequipa[0];
                modalaño.textContent = arrayInfoArequipa[1];
                modalubicacion.textContent = arrayInfoArequipa[2];
                modalturismo.textContent = arrayInfoArequipa[3];
                break;

        }




        modalprecio.textContent = precio;

    })

});

window.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
})