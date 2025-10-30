/* script.js — minimal, accessible JS for the appointment form */
(() => {
  'use strict';

  const form = document.getElementById('appointmentForm');
  const msg = document.getElementById('formMessage');

  const sanitize = (str) => String(str).trim();

  const validatePhone = (value) => {
    // Basic international-friendly check: digits, spaces, +, -, (, )
    return /^[+\d][\d\s().-]{6,}$/.test(value);
  };

  const showMessage = (text, ok = true) => {
    msg.textContent = text;
    msg.classList.remove('hidden');
    msg.classList.toggle('text-emerald-400', ok);
    msg.classList.toggle('text-rose-400', !ok);
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = sanitize(form.fullName.value);
      const phone = sanitize(form.phone.value);
      const email = sanitize(form.email.value);

      if (!fullName || fullName.length < 2) {
        showMessage('Please enter your full name.', false);
        return;
      }
      if (!validatePhone(phone)) {
        showMessage('Please enter a valid phone number.', false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('Please enter a valid email address.', false);
        return;
      }

      // Demo: pretend to submit (replace with real API call / fetch as needed)
      showMessage('Thanks! We received your request and will contact you shortly.');
      form.reset();
    });
  }
})();