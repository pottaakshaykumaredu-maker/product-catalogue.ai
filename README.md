# PRODUCT STORE — Product Catalogue E-Commerce Web Project (EWP Lab External)

A complete, responsive, multi-page e-commerce website titled **Product Store**, inspired by Flipkart, built strictly using **HTML5, CSS3, Vanilla JavaScript (ES6+), and Node.js Express.js**.

> **Note on Technology Stack:** This project uses **NO React** and **NO Angular**. It was built exclusively with foundational web technologies across dedicated separate `.html` page files to ensure zero compilation overhead, immediate execution in any web browser, and complete clarity for college laboratory external examinations and viva voce.

---

## 1. Project Directory Structure

Organized exactly according to the structured deployment architecture:

```text
product-store/
├── images/
│   ├── image_2d451df5.png         # Attached design assets
│   └── image_aebeceaa.png
├── node_modules/                  # Express and Node.js dependencies
├── public/assets/aistudio/        # Dedicated multi-page HTML views, CSS & Express server
│   ├── about.html                 # About Us Page (3-tier architecture breakdown & viva rationale)
│   ├── cart.html                  # Shopping Cart Page (quantity stepper, price breakdown, checkout)
│   ├── catalogue.html             # Product Catalogue (full-width grid, category tabs, sort bar)
│   ├── contact.html               # Contact Us Page (department details, lab room info, inquiry form)
│   ├── index.html                 # Home Page (hero carousel banner, category cards, deals of the day)
│   ├── login.html                 # User Login Page (client-side email & mobile validation, demo credentials)
│   ├── product-details.html       # Product Details Page (specs table, pricing, pin code availability)
│   ├── register.html              # User Registration Page (regex validation for 10-digit mobile)
│   ├── server.js                  # Node.js Express.js server (serves all pages & REST APIs on port 3000)
│   └── style.css                  # Pure CSS3 stylesheet (Grid, Flexbox, Flipkart blue & yellow theme)
├── .env.example                   # Environment configuration example
├── .gitignore                     # Git ignore rules for node_modules
├── app.js                         # Core Vanilla JavaScript (DOM rendering, cart math, filter logic)
├── metadata.json                  # Application metadata & configuration
├── package-lock.json              # NPM package lockfile
├── package.json                   # Node.js manifest configured with dev script
└── README.md                      # Lab external examination handbook & execution steps
```

---

## 2. Step-by-Step Terminal Commands (From Scratch to GitHub)

### Step 1: Run the Express Server
```bash
npm start
# or
node public/assets/aistudio/server.js
```
Open your browser and navigate to:
```text
http://localhost:3000
```

### Step 2: Push to GitHub Repository
```bash
# 1. Initialize local Git repository
git init

# 2. Stage all files
git add .

# 3. Commit with descriptive message
git commit -m "feat: complete multi-page product catalogue e-commerce lab project"

# 4. Set branch to main
git branch -M main

# 5. Connect to your GitHub repository
git remote add origin https://github.com/pottaakshaykumar248/product-catalogue.git

# 6. Push to GitHub
git push -u origin main
```

---

## 3. Technology Rationale for Viva Voce

* **HTML5:** Dedicated semantic HTML pages (`index.html`, `catalogue.html`, `product-details.html`, `cart.html`, etc.) ensure clean code organization without cramming everything into a single file.
* **CSS3:** Custom styles implementing Flipkart's royal blue (`#2874f0`) and yellow (`#ffe500`) palette, using CSS Grid for responsive multi-column product matrices and Flexbox for alignments.
* **Vanilla JavaScript (ES6+):** Shared client logic across pages via `app.js`. Real-time array filtering (`.filter()`), cart price reduction (`.reduce()`), session persistence via `localStorage`, and regex validation.
* **Node.js & Express.js:** Serves static assets via `express.static()` and provides REST API routes (`GET /api/products`, `POST /api/contact`).
* **Why No React or Angular?** Frameworks introduce complex dependency trees (`node_modules`), build steps, and potential version mismatches during the timed 3-hour examination. Multi-page vanilla web technologies run natively with zero build failures.
