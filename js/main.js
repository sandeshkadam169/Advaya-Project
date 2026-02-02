function toggleMenu() {
  document.getElementById("nav-menu").classList.toggle("active");
}


// Google Apps Script URL - Centralized Configuration
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxaVZOh1WTS51xj_yb0Jtx82bzXtMMMDvYp5DtRg8HQZjJypvoyuVCz0DswWgZy8iaOGw/exec";

// Mobile Dropdown Toggle Logic
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.dropdown-toggle i').forEach(arrow => {
    arrow.addEventListener('click', function (e) {
      // Check if we are on mobile view (using the same breakpoint as CSS)
      if (window.innerWidth < 768) {
        e.preventDefault();
        e.stopPropagation();
        const dropdownLi = this.closest('li.dropdown');
        if (dropdownLi) {
          dropdownLi.classList.toggle('active-dropdown');
        }
      }
    });
  });
});


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
  // const step1Form = document.querySelector("#donationStep1Form"); // Removed unused selector

  // --- NEW SIMPLIFIED FLOW (No OTP) ---

  // Elements
  const step1Div = document.getElementById("step1-contact");
  // const step2Div = document.getElementById("step2-otp"); // Removed
  const step3Div = document.getElementById("step3-payment");
  const contactFormStep = document.getElementById("contactFormStep");

  // Inputs (Dom elements will be selected inside handlers to avoid global conflicts)
  // const nameInput = ... (Removed global generic selectors)

  // Payment
  const upiPayBtn = document.getElementById("upiPayBtn");
  const payAmountDisplay = document.getElementById("payAmountDisplay");
  const finalStepForm = document.getElementById("finalStepForm");

  // URL of your Google Apps Script Web App (Now Global)
  // const SCRIPT_URL = "https://script.google.com/...";


  // --- STEP 1: PROCEED TO PAYMENT ---
  if (contactFormStep) {
    contactFormStep.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("donateEmail").value;
      const phone = document.getElementById("donatePhone").value;
      const amount = document.getElementById("donateAmount").value;

      // Simple Validation
      if (!email.includes("@") || phone.length < 10) {
        alert("Please enter valid email and phone number.");
        return;
      }

      // Store in Session Storage
      const name = document.getElementById("donateName").value;
      sessionStorage.setItem("donationName", name);
      sessionStorage.setItem("donationEmail", email);
      sessionStorage.setItem("donationPhone", phone);
      sessionStorage.setItem("donationAmount", amount);

      // Populate Hidden Fields in Final Form
      const hName = document.getElementById("hiddenName");
      const hEmail = document.getElementById("hiddenEmail");
      const hPhone = document.getElementById("hiddenPhone");
      const hAmount = document.getElementById("hiddenAmount");

      if (hName) hName.value = name;
      if (hEmail) hEmail.value = email;
      if (hPhone) hPhone.value = phone;
      if (hAmount) hAmount.value = amount;



      // Move to Payment Step
      step1Div.style.display = "none";
      step3Div.style.display = "block";

      // Setup Payment Data
      payAmountDisplay.innerText = "₹ " + amount;

      // Generate UPI Deep Link
      const upiId = "9964720461@ybl";
      const upiName = "Advaya Trust";
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR`;

      if (upiPayBtn) upiPayBtn.href = upiLink;
    });
  }

  // --- STEP 2: PAYMENT & CONFIRMATION ---
  // Handled by generic HTML Form Action now (SheetDB)
  // No JS listener needed for finalStepForm

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
      fetch(SCRIPT_URL, {
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


// Google Apps Script Web App URL handled globally
// STEP 3: Contact Form Submission
// STEP 3: Contact Form Submission
// Contact Form Submission (Handled by HTML Form Action now)
// const contactForm = document.querySelector("#contactForm");
// ... removed to allow native POST submission ...

// STEP 4: Material Donation Form Submission
// Handled by generic HTML Form Action now (SheetDB)
// const materialForm = document.querySelector("#materialDonationForm");
// ... removed to allow native POST submission ...

// HERO CAROUSEL LOGIC
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(index) {
  if (slides.length === 0) return;

  // Reset contents
  slides.forEach(slide => {
    slide.classList.remove('active');
    slide.style.opacity = '0';
    slide.style.zIndex = '1';
  });
  dots.forEach(dot => dot.classList.remove('active'));

  // Handle bounds
  if (index >= slides.length) currentSlideIndex = 0;
  if (index < 0) currentSlideIndex = slides.length - 1;

  // specific Index logic if passed directly
  if (typeof index === 'number' && index >= 0 && index < slides.length) {
    currentSlideIndex = index;
  }

  // Set Active
  slides[currentSlideIndex].classList.add('active');
  slides[currentSlideIndex].style.opacity = '1';
  slides[currentSlideIndex].style.zIndex = '5';
  if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
}

function nextSlide() {
  currentSlideIndex++;
  showSlide(currentSlideIndex);
  resetInterval();
}

function prevSlide() {
  currentSlideIndex--;
  showSlide(currentSlideIndex);
  resetInterval();
}

function currentSlide(n) {
  showSlide(n);
  resetInterval();
}

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 3000);
}

// Initialize Carousel
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.hero-slide').length > 0) {
    // Re-select in case of dom load consistency
    const slides = document.querySelectorAll('.hero-slide');
    showSlide(0);
    slideInterval = setInterval(nextSlide, 3000);
  }
});


// Testimonial Section Logic
let testimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');

function showTestimonial(n) {
  if (testimonials.length === 0) return;
  testimonials.forEach(t => t.classList.remove('active'));
  testimonialIndex = (n + testimonials.length) % testimonials.length;
  testimonials[testimonialIndex].classList.add('active');
}

function nextTestimonial() {
  showTestimonial(testimonialIndex + 1);
}

function prevTestimonial() {
  showTestimonial(testimonialIndex - 1);
}

// Auto-play disabled per user request
// setInterval(nextTestimonial, 8000);
