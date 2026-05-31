/**
 * COS10005 Assignment 2 - ForkFinder Restaurant Platform
 * script.js - Main JavaScript File
 * Author: Student
 *
 * Contents:
 *  1. Navigation: mobile toggle + active page highlighting
 *  2. Registration form validation
 *  3. Reservation form validation & dynamic behaviour
 *  4. Recommendation engine (rule-based logic)
 */

/* =====================================================================
   RESTAURANT DATA
   Centralised data used by both restaurants.html & recommendation logic
   ===================================================================== */
const RESTAURANTS = [
  {
    id: "chinchin",
    name: "Chin Chin",
    cuisine: "South-East Asian",
    dietary: ["None"],
    budgetMin: 45,
    budgetMax: 89,
    purposes: ["Date", "Family"],
    deposit: 30,
    priceRange: "$45 – $89 per person",
    description: "Melbourne's most iconic South-East Asian restaurant on Flinders Lane. Bold, fiery flavours — a buzzing institution with outstanding food."
  },
  {
    id: "movida",
    name: "MoVida Original",
    cuisine: "Spanish",
    dietary: ["None"],
    budgetMin: 60,
    budgetMax: 80,
    purposes: ["Date", "Business"],
    deposit: 35,
    priceRange: "$60 – $80 per person",
    description: "The tapas institution that started Melbourne's laneway dining culture. Tucked in Hosier Lane, MoVida has been a Melbourne icon since 2003."
  },
  {
    id: "minamishima",
    name: "Minamishima",
    cuisine: "Japanese",
    dietary: ["None"],
    budgetMin: 250,
    budgetMax: 350,
    purposes: ["Date", "Business"],
    deposit: 80,
    priceRange: "$250 – $350 per person",
    description: "Melbourne's finest Japanese omakase experience. An 18-course counter dining journey from Chef Koichi Minamishima in Richmond — one of the city's most coveted bookings."
  },
  {
    id: "tonka",
    name: "Tonka",
    cuisine: "Indian",
    dietary: ["Vegan", "None"],
    budgetMin: 60,
    budgetMax: 100,
    purposes: ["Business", "Date"],
    deposit: 40,
    priceRange: "$60 – $100 per person",
    description: "Contemporary Indian fine dining at the end of a CBD laneway. Inventive India-inspired dishes, natural wines, and Indian-twist cocktails in a sleek, sophisticated space."
  },
  {
    id: "tipo",
    name: "Tipo 00",
    cuisine: "Italian",
    dietary: ["None"],
    budgetMin: 50,
    budgetMax: 80,
    purposes: ["Date", "Family"],
    deposit: 25,
    priceRange: "$50 – $80 per person",
    description: "A CBD favourite dedicated to handmade pasta. Tipo 00 serves silky pappardelle and pillowy gnocchi in an intimate room on Little Bourke Street. Simple, seasonal, exceptional."
  },
  {
    id: "gimlet",
    name: "Gimlet at Cavendish House",
    cuisine: "Modern Australian",
    dietary: ["None"],
    budgetMin: 100,
    budgetMax: 180,
    purposes: ["Business", "Date"],
    deposit: 60,
    priceRange: "$100 – $180 per person",
    description: "Melbourne's hardest booking and one of its finest restaurants. European technique meets Australian produce in a grand dining room on Russell Street. The martinis are legendary."
  }
];

/* =====================================================================
   1. NAVIGATION
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  // --- Active page highlighting ---
  // Match the current file name to the nav links
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(function (link) {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // --- Mobile hamburger toggle ---
  const toggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (toggle && navMenu) {
    toggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen);
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close nav on link click (mobile)
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Initialise page-specific logic ---
  const page = currentPage;

  if (page === "register.html") {
    initRegisterForm();
  }
  if (page === "reservation.html") {
    initReservationForm();
  }
  if (page === "recommend.html") {
    initRecommendPage();
  }
  if (page === "restaurants.html") {
    initRestaurantsPage();
  }
  if (page === "index.html" || page === "") {
    initHomePage();
  }
});

/* =====================================================================
   HELPER: Show / clear field error
   ===================================================================== */

/**
 * Marks a field as invalid and shows an error message.
 * @param {HTMLElement} field - The input/select element.
 * @param {string} message   - The error message to display.
 */
function showError(field, message) {
  field.classList.add("error");
  field.classList.remove("valid");
  const errEl = document.getElementById(field.id + "Error");
  if (errEl) errEl.textContent = message;
}

/**
 * Marks a field as valid and clears any error message.
 * @param {HTMLElement} field - The input/select element.
 */
function clearError(field) {
  field.classList.remove("error");
  field.classList.add("valid");
  const errEl = document.getElementById(field.id + "Error");
  if (errEl) errEl.textContent = "";
}

/**
 * Clears all error states from every field in a form.
 * @param {HTMLFormElement} form
 */
function clearAllErrors(form) {
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.classList.remove("error", "valid");
  });
  form.querySelectorAll("[id$='Error']").forEach(function (el) {
    el.textContent = "";
  });
}

/* =====================================================================
   2. REGISTRATION FORM VALIDATION (register.html)
   ===================================================================== */

/**
 * Initialises the registration form and attaches validation listeners.
 * Validation rules:
 *  - Username: 5+ chars, letters/numbers/underscores only
 *  - Email: valid email format
 *  - Phone: digits only, 8–15 digits
 *  - Password: 10+ chars, uppercase, lowercase, digit, special char
 *  - Confirm password: must match password
 *  - Gender: must be selected
 *  - All other fields: must not be empty
 */
function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const valid = validateRegisterForm();
    if (valid) {
      // Show success message (no server submission for registration)
      const msg = document.getElementById("registerSuccess");
      if (msg) msg.classList.remove("hidden");
      form.reset();
      clearAllErrors(form);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Real-time validation on blur
  const fields = ["regUsername", "regEmail", "regPhone", "regPassword", "regConfirm", "regCountry"];
  fields.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("blur", function () {
        validateRegisterField(el);
      });
    }
  });
}

/**
 * Validates all registration form fields.
 * @returns {boolean} true if all fields are valid, false otherwise.
 */
function validateRegisterForm() {
  let isValid = true;

  // --- Username ---
  const username = document.getElementById("regUsername");
  if (!validateRegisterField(username)) isValid = false;

  // --- Email ---
  const email = document.getElementById("regEmail");
  if (!validateRegisterField(email)) isValid = false;

  // --- Phone ---
  const phone = document.getElementById("regPhone");
  if (!validateRegisterField(phone)) isValid = false;

  // --- Password ---
  const password = document.getElementById("regPassword");
  if (!validateRegisterField(password)) isValid = false;

  // --- Confirm Password ---
  const confirm = document.getElementById("regConfirm");
  if (!validateRegisterField(confirm)) isValid = false;

  // --- Gender ---
  const genderOptions = document.querySelectorAll('input[name="gender"]');
  const genderSelected = Array.from(genderOptions).some(function (r) { return r.checked; });
  const genderError = document.getElementById("genderError");
  if (!genderSelected) {
    if (genderError) genderError.textContent = "Please select your gender.";
    isValid = false;
  } else {
    if (genderError) genderError.textContent = "";
  }

  // --- Dietary preference (at least one must be checked) ---
  const dietOptions = document.querySelectorAll('input[name="dietary"]');
  const dietSelected = Array.from(dietOptions).some(function (r) { return r.checked; });
  const dietError = document.getElementById("dietaryError");
  if (!dietSelected) {
    if (dietError) dietError.textContent = "Please select at least one dietary preference.";
    isValid = false;
  } else {
    if (dietError) dietError.textContent = "";
  }

  // --- Country ---
  const country = document.getElementById("regCountry");
  if (!validateRegisterField(country)) isValid = false;

  return isValid;
}

/**
 * Validates a single registration field based on its ID.
 * @param {HTMLElement} field
 * @returns {boolean}
 */
function validateRegisterField(field) {
  if (!field) return true;
  const value = field.value.trim();
  const id = field.id;

  if (id === "regUsername") {
    if (value.length < 5) {
      showError(field, "Username must be at least 5 characters.");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      showError(field, "Only letters, numbers, and underscores are allowed.");
      return false;
    }
  }

  if (id === "regEmail") {
    // Standard email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError(field, "Please enter a valid email address.");
      return false;
    }
  }

  if (id === "regPhone") {
    if (!/^\d{10,12}$/.test(value)) {
      showError(field, "Phone number must be 10–12 digits only.");
      return false;
    }
  }

  if (id === "regPassword") {
    if (value.length < 10) {
      showError(field, "Password must be at least 10 characters.");
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      showError(field, "Password must include at least one uppercase letter.");
      return false;
    }
    if (!/[a-z]/.test(value)) {
      showError(field, "Password must include at least one lowercase letter.");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      showError(field, "Password must include at least one number.");
      return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      showError(field, "Password must include at least one special character.");
      return false;
    }
  }

  if (id === "regConfirm") {
    const password = document.getElementById("regPassword");
    if (password && value !== password.value) {
      showError(field, "Passwords do not match.");
      return false;
    }
    if (value === "") {
      showError(field, "Please confirm your password.");
      return false;
    }
  }

  if (id === "regCountry") {
    if (value === "" || value === "select") {
      showError(field, "Please select your country/region.");
      return false;
    }
  }

  clearError(field);
  return true;
}

/* =====================================================================
   3. RESERVATION FORM (reservation.html)
   ===================================================================== */

/**
 * Initialises the reservation page:
 *  - Pre-fills restaurant from URL param (?restaurant=id)
 *  - Updates deposit dynamically on restaurant change
 *  - Shows/hides payment fields based on method
 *  - "Same as email" billing option
 *  - Full form validation on submit
 */
function initReservationForm() {
  const form = document.getElementById("reservationForm");
  if (!form) return;

  const restaurantSelect = document.getElementById("resRestaurant");
  const depositDisplay = document.getElementById("depositDisplay");
  const paymentMethod = document.querySelectorAll('input[name="paymentMethod"]');
  const voucherSection = document.getElementById("voucherSection");
  const cardSection = document.getElementById("cardSection");
  const sameEmailCheck = document.getElementById("sameEmail");
  const billingEmail = document.getElementById("resBillingEmail");
  const emailField = document.getElementById("resEmail");

  // --- Pre-fill restaurant from URL param ---
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("restaurant");
  if (preselect && restaurantSelect) {
    restaurantSelect.value = preselect;
  }

  // --- Update deposit amount on restaurant change ---
  function updateDeposit() {
    const rid = restaurantSelect ? restaurantSelect.value : "";
    const restaurant = RESTAURANTS.find(function (r) { return r.id === rid; });
    if (depositDisplay) {
      depositDisplay.textContent = restaurant ? "$" + restaurant.deposit + ".00" : "—";
    }
    const hiddenDeposit = document.getElementById("depositAmount");
    if (hiddenDeposit) {
      hiddenDeposit.value = restaurant ? restaurant.deposit : "";
    }
  }

  if (restaurantSelect) {
    restaurantSelect.addEventListener("change", updateDeposit);
    updateDeposit(); // Run on load
  }

  // --- Payment method toggle ---
  function updatePaymentFields() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    const method = selected ? selected.value : "";

    if (voucherSection) voucherSection.classList.toggle("hidden", method !== "voucher");
    if (cardSection) cardSection.classList.toggle("hidden", method !== "online");
  }

  paymentMethod.forEach(function (radio) {
    radio.addEventListener("change", updatePaymentFields);
  });
  updatePaymentFields(); // Run on load

  // --- "Same as email address" checkbox ---
  if (sameEmailCheck && billingEmail && emailField) {
    sameEmailCheck.addEventListener("change", function () {
      if (sameEmailCheck.checked) {
        billingEmail.value = emailField.value;
        billingEmail.disabled = true;
      } else {
        billingEmail.disabled = false;
      }
    });

    // Update billing email if main email changes while same-as is checked
    emailField.addEventListener("input", function () {
      if (sameEmailCheck.checked) {
        billingEmail.value = emailField.value;
      }
    });
  }

  // --- Form submission validation ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateReservationForm()) {
      form.submit();
    }
  });
}

/**
 * Validates all reservation form fields.
 * @returns {boolean} true if valid, false otherwise.
 */
function validateReservationForm() {
  let isValid = true;

  // Helper: validate a simple required field
  function requireField(id, message) {
    const el = document.getElementById(id);
    if (!el) return true;
    if (el.value.trim() === "") {
      showError(el, message || "This field is required.");
      isValid = false;
      return false;
    }
    clearError(el);
    return true;
  }

  // Full name
  requireField("resName", "Please enter your full name.");

  // Email
  const resEmail = document.getElementById("resEmail");
  if (resEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resEmail.value.trim())) {
      showError(resEmail, "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError(resEmail);
    }
  }

  // Phone: at least 10 digits
  const resPhone = document.getElementById("resPhone");
  if (resPhone) {
    const digits = resPhone.value.replace(/\D/g, "");
    if (digits.length < 10) {
      showError(resPhone, "Phone number must contain at least 10 digits.");
      isValid = false;
    } else {
      clearError(resPhone);
    }
  }

  // Restaurant selection
  const resRestaurant = document.getElementById("resRestaurant");
  if (resRestaurant && resRestaurant.value === "") {
    showError(resRestaurant, "Please select a restaurant.");
    isValid = false;
  } else if (resRestaurant) {
    clearError(resRestaurant);
  }

  // Date — must not be in the past
  const resDate = document.getElementById("resDate");
  if (resDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(resDate.value);
    if (!resDate.value) {
      showError(resDate, "Please select a reservation date.");
      isValid = false;
    } else if (chosen < today) {
      showError(resDate, "Reservation date cannot be in the past.");
      isValid = false;
    } else {
      clearError(resDate);
    }
  }

  // Time
  requireField("resTime", "Please select a reservation time.");

  // Number of people > 0
  const resPeople = document.getElementById("resPeople");
  if (resPeople) {
    const num = parseInt(resPeople.value, 10);
    if (isNaN(num) || num < 1) {
      showError(resPeople, "Number of people must be at least 1.");
      isValid = false;
    } else {
      clearError(resPeople);
    }
  }

  // Payment method validation
  const paymentSelected = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentError = document.getElementById("paymentError");

  if (!paymentSelected) {
    if (paymentError) paymentError.textContent = "Please select a payment method.";
    isValid = false;
  } else {
    if (paymentError) paymentError.textContent = "";

    if (paymentSelected.value === "voucher") {
      // Voucher code: 12 digits (no validation required per spec but show if entered wrong)
      // Per spec: no need to validate voucher code — just show the field
    }

    if (paymentSelected.value === "online") {
      // Credit card validation
      const cardNumber = document.getElementById("resCardNumber");
      const cardType = document.getElementById("resCardType");

      if (cardNumber && cardType) {
        const digits = cardNumber.value.replace(/\s/g, "");
        const type = cardType.value;

        if (!/^\d+$/.test(digits) || digits.length === 0) {
          showError(cardNumber, "Credit card number must contain digits only.");
          isValid = false;
        } else if ((type === "visa" || type === "mastercard") && digits.length !== 16) {
          showError(cardNumber, "Visa/Mastercard must be exactly 16 digits.");
          isValid = false;
        } else if (type === "amex" && digits.length !== 15) {
          showError(cardNumber, "American Express must be exactly 15 digits.");
          isValid = false;
        } else {
          clearError(cardNumber);
        }
      }
    }
  }

  // Billing email
  const resBillingEmail = document.getElementById("resBillingEmail");
  if (resBillingEmail && !resBillingEmail.disabled) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resBillingEmail.value.trim())) {
      showError(resBillingEmail, "Please enter a valid billing email address.");
      isValid = false;
    } else {
      clearError(resBillingEmail);
    }
  }

  return isValid;
}

/* =====================================================================
   4. RECOMMENDATION ENGINE (recommend.html)
   Applies rule-based logic to match restaurants to user preferences.
   Rules:
    - Dietary match: restaurant must support user's dietary choice
    - Budget match: user's budget must fall within restaurant's price range
    - Purpose match: restaurant's purposes must include user's dining purpose
    - Score is computed as a weighted sum; restaurants with score > 0 shown.
   ===================================================================== */

/**
 * Initialises the recommendation page with form submission handler.
 */
function initRecommendPage() {
  const form = document.getElementById("recommendForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    runRecommendationEngine();
  });
}

/**
 * Runs the recommendation engine based on form selections,
 * then renders the matched restaurants.
 */
function runRecommendationEngine() {
  const dietary = document.getElementById("recDietary").value;
  const budget = parseInt(document.getElementById("recBudget").value, 10);
  const purpose = document.getElementById("recPurpose").value;

  const resultsContainer = document.getElementById("recommendResults");
  if (!resultsContainer) return;

  // Score each restaurant against user preferences
  const scored = RESTAURANTS.map(function (r) {
    let score = 0;
    const reasons = [];

    // Rule 1: Dietary match (weight: 3 — highest priority)
    if (dietary === "None" || r.dietary.includes(dietary) || r.dietary.includes("None")) {
      score += 3;
      if (dietary !== "None") reasons.push("Matches your " + dietary + " preference");
    } else {
      // Hard filter: if user has a dietary restriction and restaurant doesn't support it, exclude
      return { restaurant: r, score: -1, reasons: [] };
    }

    // Rule 2: Budget fit (weight: 2)
    if (budget >= r.budgetMin && budget <= r.budgetMax) {
      score += 2;
      reasons.push("Fits your budget");
    } else if (budget >= r.budgetMin) {
      // Budget is higher than minimum — still accessible
      score += 1;
      reasons.push("Within your price range");
    } else {
      // Budget too low — exclude
      return { restaurant: r, score: -1, reasons: [] };
    }

    // Rule 3: Purpose match (weight: 2)
    if (r.purposes.includes(purpose)) {
      score += 2;
      reasons.push("Great for " + purpose.toLowerCase() + " dining");
    }

    return { restaurant: r, score: score, reasons: reasons };
  });

  // Filter out excluded (score < 0) and sort by score descending
  const matches = scored
    .filter(function (s) { return s.score > 0; })
    .sort(function (a, b) { return b.score - a.score; });

  // Render results
  if (matches.length === 0) {
    resultsContainer.innerHTML =
      '<p class="no-results-msg">No restaurants match your criteria. Try adjusting your preferences.</p>';
    return;
  }

  const maxScore = matches[0].score;

  resultsContainer.innerHTML = matches.map(function (match, index) {
    const r = match.restaurant;
    const pct = Math.round((match.score / 7) * 100); // max possible score = 7
    const topPick = index === 0 ? '<span class="match-score">⭐ Top Pick</span>' : "";

    return [
      '<div class="result-card">',
      '  <div style="display:flex;justify-content:space-between;align-items:start;gap:0.5rem">',
      '    <h4>' + r.name + '</h4>',
      '    ' + topPick,
      '  </div>',
      '  <p>' + r.description + '</p>',
      '  <div style="font-size:0.82rem;color:var(--color-text-light);margin-bottom:0.75rem">',
      '    <strong>Cuisine:</strong> ' + r.cuisine + ' &nbsp;|&nbsp; ',
      '    <strong>Price:</strong> ' + r.priceRange + ' &nbsp;|&nbsp; ',
      '    <strong>Deposit:</strong> $' + r.deposit,
      '  </div>',
      '  <div style="font-size:0.82rem;color:var(--color-primary);margin-bottom:0.85rem">',
      '    ✓ ' + match.reasons.join(' &nbsp;·&nbsp; ✓ '),
      '  </div>',
      '  <div style="display:flex;gap:0.5rem">',
      '    <a href="reservation.html?restaurant=' + r.id + '" class="btn btn-primary" style="font-size:0.85rem;padding:0.5rem 1rem">Reserve Now</a>',
      '    <a href="restaurants.html" class="btn btn-outline" style="font-size:0.85rem;padding:0.5rem 1rem;color:var(--color-text);border-color:var(--color-border)">View Details</a>',
      '  </div>',
      '</div>'
    ].join("\n");
  }).join("\n");
}

/* =====================================================================
   5. RESTAURANTS PAGE (restaurants.html)
   ===================================================================== */

/**
 * Initialises the restaurant listing page filter bar.
 */
function initRestaurantsPage() {
  const cuisineFilter = document.getElementById("cuisineFilter");
  if (!cuisineFilter) return;

  cuisineFilter.addEventListener("change", function () {
    const selected = cuisineFilter.value;
    document.querySelectorAll(".restaurant-card").forEach(function (card) {
      const cuisine = card.getAttribute("data-cuisine");
      if (selected === "all" || cuisine === selected) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
}

/* =====================================================================
   6. HOME PAGE (index.html)
   ===================================================================== */

/**
 * Populates the quick-reserve restaurant dropdown on the home page.
 */
function initHomePage() {
  const quickSelect = document.getElementById("quickRestaurant");
  if (!quickSelect) return;

  RESTAURANTS.forEach(function (r) {
    const option = document.createElement("option");
    option.value = r.id;
    option.textContent = r.name + " – " + r.cuisine;
    quickSelect.appendChild(option);
  });

  const goBtn = document.getElementById("quickReserveBtn");
  if (goBtn) {
    goBtn.addEventListener("click", function () {
      const val = quickSelect.value;
      if (val) {
        window.location.href = "reservation.html?restaurant=" + val;
      }
    });
  }
}
