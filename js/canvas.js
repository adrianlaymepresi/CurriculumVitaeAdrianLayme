// Helper: scroll con offset (evita que el header tape el título)
const scrollToWithOffset = (el, offset = 0) => {
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

// Selecciona enlaces del offcanvas
document.querySelectorAll('#barraAcciones .barra__link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // evita el jump por defecto

        const targetId = link.getAttribute('href');      // ej: "#educacion"
        const target = document.querySelector(targetId);
        if (!target) return;

        // Altura del header (ajusta el selector si usas otro)
        const header = document.querySelector('.header');
        const headerOffset = header ? header.offsetHeight + 8 : 80; // +8px de respiro

        // Cerrar el offcanvas primero
        const offcanvasEl = document.getElementById('barraAcciones');
        const off = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);

        // Cuando termine de cerrar, hacemos el scroll
        const doScroll = () => scrollToWithOffset(target, headerOffset);

        // Usamos el evento oficial; si por alguna razón no llega, fallback con timeout
        offcanvasEl.addEventListener('hidden.bs.offcanvas', doScroll, { once: true });
        off.hide();

        // Fallback por si algún navegador no dispara el evento
        setTimeout(() => {
            // Si el offcanvas ya está oculto pero no se disparó el evento, scrollea igual
            if (!offcanvasEl.classList.contains('show')) doScroll();
        }, 250);
    });
});