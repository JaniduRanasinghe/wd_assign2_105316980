================================================================================
  ForkFinder – Restaurant Discovery & Reservation Platform
  COS10005 Web Development – Assignment 2, Semester 1, 2026
  Swinburne University of Technology
================================================================================

STUDENT ID:   105316980
STUDENT NAME: Janidu Ranasinghe

GITHUB REPOSITORY: https://github.com/JaniduRanasinghe/wd_assign2_105316980.git

--------------------------------------------------------------------------------
WEBSITE STRUCTURE
--------------------------------------------------------------------------------

assignment2/
├── index.html          – Home page: platform intro, quick reserve, stats
├── restaurants.html    – Listing of 6 partner restaurants with full details
├── recommend.html      – Preference-based restaurant recommendation form
├── register.html       – User account registration with JS validation
├── reservation.html    – Table booking form with deposit & payment logic
├── css/
│   └── style.css       – Single external stylesheet (all pages)
├── js/
│   └── script.js       – All JavaScript (validation + interactivity)
├── images/
│   ├── logo.png        – ForkFinder brand logo
│   ├── restaurant1.jpg – Sakura Japanese Kitchen
│   ├── restaurant2.jpg – Verde Garden Bistro
│   ├── restaurant3.jpg – Sultan's Palace
│   ├── restaurant4.jpg – Trattoria Napoli
│   ├── restaurant5.jpg – Spice Route Indian
│   └── restaurant6.jpg – Harbour House Grill
└── Readme.txt          – This file

Navigation: All pages share an identical sticky header nav. The active page is
highlighted automatically via JavaScript by matching the current filename to each
nav link's href. On mobile (<768px) the nav collapses into a hamburger menu.

--------------------------------------------------------------------------------
JAVASCRIPT VALIDATION LOGIC – PLAIN ENGLISH EXPLANATION
--------------------------------------------------------------------------------

The entire JavaScript codebase lives in js/script.js. On page load it detects
which page is active and initialises only the relevant logic.

1. NAVIGATION (all pages)
   – Reads window.location.pathname to find the current filename.
   – Loops through all nav <a> elements; if the link's href matches the current
     file, the "active" CSS class is applied (red background highlight).
   – A click on the hamburger icon toggles a CSS class "open" on the <nav>
     element, which transitions max-height from 0 to a large value to reveal
     the links on mobile.

2. REGISTRATION FORM VALIDATION (register.html)
   Triggered when the user clicks "Create Account" (form submit event).
   Each field is validated in order; if any fail, the form is NOT submitted.
   Errors are shown beneath each field in red.

   Field rules:
   • Username  – Must be at least 5 characters long.
                 Only letters (a-z, A-Z), digits (0-9), and underscores (_)
                 are accepted. Checked with regex /^[a-zA-Z0-9_]+$/.
   • Email     – Checked with regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ to ensure
                 it contains an "@" symbol with text on both sides and a dot
                 in the domain portion.
   • Phone     – All non-digit characters are stripped; the remaining string
                 must be 8–15 characters long. Checked with /^\d{8,15}$/.
   • Password  – Must be at least 10 characters. Four separate regex checks
                 ensure at least one uppercase letter, one lowercase letter,
                 one digit, and one special character are present.
   • Confirm   – Compared directly (===) to the password field's value.
   • Gender    – The radio button group is iterated; if none are checked an
                 error is shown beneath the group.
   • Dietary   – The checkbox group is iterated; at least one must be checked.
   • Country   – The <select> value must not be empty or the default prompt.

   Real-time validation: blur events on individual inputs trigger their own
   validation rule so users see feedback as they move between fields.

3. RESERVATION FORM VALIDATION (reservation.html)
   Triggered on form submit. Errors shown inline; submission blocked until fixed.

   Field rules:
   • Full name       – Must not be empty.
   • Email           – Same email regex as registration.
   • Phone           – Digits are extracted with replace(/\D/g,""); count must
                       be ≥ 10.
   • Restaurant      – The <select> value must not be empty string.
   • Date            – A Date object is created from the value. It is compared
                       to today (with time set to midnight). If chosen < today,
                       an error is shown. Empty value also fails.
   • Time            – Must not be empty.
   • Number of people– Parsed as integer; must be ≥ 1.
   • Payment method  – If no radio is checked, an error is shown beneath the
                       group.
     – Voucher selected: the voucher section is shown (no code validation
       required per spec).
     – Online payment selected: the card section is shown. Card number digits
       are extracted. For Visa/Mastercard exactly 16 digits are required;
       for Amex exactly 15 digits are required.
   • Billing email   – Same email regex. Skipped if the "Same as email"
                       checkbox is checked (field is disabled and auto-filled).

4. DYNAMIC RESERVATION BEHAVIOUR
   • Restaurant change → deposit amount updates live in the info box by
     looking up the RESTAURANTS data array.
   • Payment method radios → the voucher or card <div> sections toggle
     the "hidden" CSS class (display:none) to show/hide conditionally.
   • "Same as email" checkbox → when checked, the billing email field is
     populated with the primary email value and disabled. When unchecked,
     it is re-enabled. An input event on the primary email also updates the
     billing field while the checkbox is active.

5. RECOMMENDATION ENGINE (recommend.html)
   On form submit, the engine scores each restaurant (max 7 points):
   • +3 if restaurant supports user's dietary preference (hard filter:
     restaurants that don't support the dietary choice are excluded entirely).
   • +2 if user's budget falls within the restaurant's price range;
     +1 if budget exceeds the minimum but not the maximum.
     Restaurants below the user's minimum budget are excluded.
   • +2 if the restaurant is tagged for the user's dining purpose.
   Results are sorted highest-score first. Each result card links directly
   to reservation.html?restaurant=ID so the restaurant is pre-selected.

6. QUICK RESERVE (index.html)
   The RESTAURANTS array is iterated to populate a <select> dropdown.
   Clicking "Reserve Now" navigates to reservation.html?restaurant=<id>.

--------------------------------------------------------------------------------
KNOWN ISSUES / LIMITATIONS
--------------------------------------------------------------------------------

• Restaurant images (restaurant1.jpg – restaurant6.jpg) and logo.png need to
  be placed in the images/ folder manually. Placeholder filenames are used in
  the HTML; replace with actual images before submission.
• The registration form does not submit to a server (no action attribute);
  it shows a success message in-browser only, as per spec requirements.
• The reservation form action points to the Mercury test server as required:
  http://mercury.swin.edu.au/it000000/cos10005/regtest.php
  Replace "it000000" with your actual student ID before deployment.
• Responsive breakpoints tested at 375px (mobile), 768px (tablet), 1280px
  (desktop). Some layouts may require minor adjustment on very wide screens.

--------------------------------------------------------------------------------
REFERENCES
--------------------------------------------------------------------------------

• Google Fonts – Playfair Display and DM Sans
  https://fonts.google.com
  (Free for web use under the Open Font License)

• Logo – Genarated

• W3C HTML Validator – https://validator.w3.org
• W3C CSS Validator  – https://jigsaw.w3.org/css-validator

================================================================================
REFERENCES – IMAGES
-------------------

images/restaurant1.jpg
  Delicious. (2017). Chin Chin Melbourne [Photograph].
  https://img.delicious.com.au/DLtwS8oH/w759-h506-cfill/del/2017/11/chin-chin-melbourne-55365-5.jpg

images/restaurant2.jpg
  Australia Travel. (2021, May 31). [Restaurant photograph] [Photograph].
  https://www.australiatravel.com/wp-content/uploads/2021/05/31-May-21-9-30-33-PM.jpg

images/restaurant4.jpg
  Delicious. (2016). Tonka restaurant [Photograph].
  https://img.delicious.com.au/VwDDxK4h/w1200/del/2016/11/tonka-restaurant-39197-2.jpg

images/restaurant6.jpg
  Delicious. (2020). Gimlet at Cavendish House [Photograph].
  https://img.delicious.com.au/TcDPo34H/del/2020/06/gimlet-at-cavendish-house-134440-2.jpg

REFERENCES – WEBSITES
----------------------

Tripadvisor. (n.d.). Tipo 00 - Melbourne restaurant reviews, photos & phone number.
  https://www.tripadvisor.com.au/Restaurant_Review-g255100-d7159399-Reviews-Tipo_00-Melbourne_Victoria.html
