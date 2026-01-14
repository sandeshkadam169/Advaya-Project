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
        const duration = 3000; // Animation duration in ms
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


  document.querySelector("#donationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    fetch("https://script.google.com/macros/s/AKfycbyqZuglhgBoNQkf_W1PHQM8vtLWKZ-L6qdRBAXn_R_s24TT_TYSyjmGc-08WjHEunbq6Q/exec", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        amount: document.getElementById("amount").value,
      
        transactionId: document.getElementById("transactionId").value
      })
    })
      .then(res => res.json())
      .then(data => alert("Donation saved successfully!"));
  });

});


// https://script.google.com/macros/s/AKfycbygpS2DiLl6I1pe3YmRg6855eaqYuFDoJJrc9jlAoHc9vFe5hd0YMFf97iQq_JlOpBlug/exec