function toggleMenu() {
  document.getElementById("nav-menu").classList.toggle("active");
}

/* Dynamic Number Counter Animation */
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.count-up');
  const speed = 200; // The lower the slower

  const observerOptions = {
    threshold: 0.5, // Trigger when 50% of the element is visible
    rootMargin: "0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // Animation duration in ms
        const increment = target / (duration / 16); // 60fps approx

        let current = 0;

        const updateCount = () => {
          current += increment;

          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
        observer.unobserve(counter); // Animate only once
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
});
