
document.addEventListener('DOMContentLoaded', function() {
   
    const ofertasContainer = document.getElementById('Ofertas');

    if (ofertasContainer) {
        ofertasContainer.addEventListener('click', iniciarReserva);
    }

    function iniciarReserva(e) {
  
        e.preventDefault(); 
    
        if (e.target.classList.contains('boton-reservar')) {
            const botonReservar = e.target;
          
            const destino = botonReservar.dataset.destino; 
            const precio = botonReservar.dataset.precio; 
       
            alert(` ¡Reserva de vuelo iniciada!
Destino seleccionado: ${destino}
Precio de la oferta: ${precio}

Serás redirigido a la página de confirmación.`);

        
        }
    }
});
