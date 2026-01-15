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


  // STEP 1: Donation Details Submission
  const step1Form = document.querySelector("#donationStep1Form");
  if (step1Form) {
    step1Form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const amount = document.getElementById("amount").value;

      // Save to Session Storage
      sessionStorage.setItem("donationName", name);
      sessionStorage.setItem("donationEmail", email);
      sessionStorage.setItem("donationPhone", phone);
      sessionStorage.setItem("donationAmount", amount);

      // Redirect to Payment Page
      window.location.href = "payment.html";
    });
  }

  // STEP 2: Payment Confirmation Submission
  const step2Form = document.querySelector("#paymentConfirmationForm");
  if (step2Form) {
    step2Form.addEventListener("submit", function (e) {
      e.preventDefault();

      const transactionId = document.getElementById("transactionId").value;

      // Retrieve data from Session Storage
      const donationData = {
        name: sessionStorage.getItem("donationName"),
        email: sessionStorage.getItem("donationEmail"),
        phone: sessionStorage.getItem("donationPhone"),
        amount: sessionStorage.getItem("donationAmount"),
        transactionId: transactionId
      };

      if (!donationData.name || !donationData.amount) {
        alert("Session expired or invalid data. Please start over.");
        window.location.href = "donate.html";
        return;
      }

      // Submit to Google Sheet API
      fetch("https://script.google.com/macros/s/AKfycbwxUaM13CUb6CNWekfpasYFxGSgpCANZGJ0OKF0Jmcz6A8lhMiRyH_7PwR0Zk-6_oG6nA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(donationData)
      })
        .then(res => res.json())
        .then(data => {
          alert("Donation saved successfully! Thank you for your support.");
          // Clear session and redirect home or show success message
          sessionStorage.clear();
          window.location.href = "index.html";
        })
        .catch(err => {
          console.error("Error:", err);
          alert("Something went wrong. Please try again or contact support.");
        });
    });
  }

});


// https://script.google.com/macros/s/AKfycbygpS2DiLl6I1pe3YmRg6855eaqYuFDoJJrc9jlAoHc9vFe5hd0YMFf97iQq_JlOpBlug/exec
  // STEP 3: Contact Form Submission
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const contactData = {
        name: document.getElementById("contactName").value,
        phone: document.getElementById("contactPhone").value,
        message: document.getElementById("contactMessage").value,
        type: "contact_message" // Identifier for the backend if needed
      };

      // Submit to Same Google Sheet API
      fetch("https://script.google.com/macros/s/AKfycbwxUaM13CUb6CNWekfpasYFxGSgpCANZGJ0OKF0Jmcz6A8lhMiRyH_7PwR0Zk-6_oG6nA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(contactData)
      })
        .then(res => res.json())
        .then(data => {
          alert("Message sent successfully! We will get back to you soon.");
          contactForm.reset();
        })
        .catch(err => {
          console.error("Error:", err);
          alert("Message sent! (Note: Response check failed but data likely sent)");
          contactForm.reset();
        });
    });
  }
