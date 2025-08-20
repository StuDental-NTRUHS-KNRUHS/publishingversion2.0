// College data for different universities
const collegeData = {
  NTRUHS: [
    "Anil Neerukonda Institute of Dental Sciences, Visakhapatnam",
    "CKS Teja Institute of Dental Sciences and Research, Tirupati",
    "Care Dental College, Guntur",
    "Drs. Sudha & Nageswara Rao Siddhartha Institute of Dental Sciences, Gannavaram",
    "G. Pulla Reddy Dental College and Hospital, Kurnool",
    "GITAM Dental College and Hospital, Visakhapatnam",
    "GSL Dental College and Hospital, Rajahmundry",
    "KIMS Dental College, Amalapuram",
    "Lenora Institute of Dental Sciences, Rajahmundry",
    "Narayana Dental College and Hospital, Nellore",
    "Nimra Institute of Dental Sciences, Vijayawada",
    "Sibar Institute of Dental Sciences, Guntur",
    "Sree Sai Dental College and Research Institute, Srikakulam",
    "St. Joseph Dental College, Duggirala",
    "Vishnu Dental College, Bhimavaram",
    "Government Dental College & Hospital, Vijayawada",
    "Government Dental College, RIMS, Kadapa",
  ],
  KNRUHS: [
    "Government Dental College and Hospital, Hyderabad",
    "Army College of Dental Sciences, Secunderabad",
    "Kamineni Institute of Dental Sciences, Nalgonda",
    "Mamata Institute of Dental Sciences, Khammam",
    "Meghna Institute of Dental Sciences, Nizamabad",
    "Malla Reddy Dental College for Women, Hyderabad",
    "Malla Reddy Institute of Dental Sciences, Hyderabad",
    "Panineeya Mahavidyalaya Institute of Dental Sciences & Research Centre, Hyderabad",
    "Sri Balaji Dental College, Hyderabad",
    "Sri Sai College of Dental Surgery, Vikarabad",
    "Sri Venkata Sai Institute of Dental Sciences, Hyderabad",
    "Tirumala Institute of Dental Sciences & Research Centre",
    "MNR Dental College and Hospital, Medak",
  ],
}

// Subject data for different years
const subjectData = {
  "1st Year": {
    subjects: ["Anatomy", "Physiology & Biochemistry", "Dental Anatomy"],
    singlePrice: 399,
    bundlePrice: 999,
  },
  "2nd Year": {
    subjects: ["Pharmacology", "Pathology & Microbiology", "Dental Materials"],
    singlePrice: 399,
    bundlePrice: 999,
  },
  "3rd Year": {
    subjects: ["General Medicine", "General Surgery", "Oral Pathology"],
    singlePrice: 399,
    bundlePrice: 999,
  },
  "4th Year": {
    subjects: [
      "Oral Medicine & Radiology",
      "Oral & Maxillofacial Surgery",
      "Periodontics",
      "Prosthodontics",
      "Orthodontics",
      "Conservative Dentistry & Endodontics",
      "Public Health Dentistry",
      "Pedodontics",
    ],
    singlePrice: 299,
    bundlePrice: 1699,
  },
}

// DOM elements
const universitySelect = document.getElementById("university")
const yearSelect = document.getElementById("year")
const collegeGroup = document.getElementById("collegeGroup")
const collegeSelect = document.getElementById("college")
const subjectGroup = document.getElementById("subjectGroup")
const subjectOptions = document.getElementById("subjectOptions")
const pricingDisplay = document.getElementById("pricingDisplay")
const priceBreakdown = document.getElementById("priceBreakdown")
const totalAmount = document.getElementById("totalAmount")
const paymentSection = document.getElementById("paymentSection")
const enrollmentForm = document.getElementById("enrollmentForm")
const qrCodeButton = document.getElementById("qrCodeButton") // Added for QR code button
const copyBankDetailsButton = document.getElementById("copyBankDetailsButton") // Added for bank details copy button

// Event listeners
if (universitySelect) {
  universitySelect.addEventListener("change", handleUniversityChange)
}

if (yearSelect) {
  yearSelect.addEventListener("change", handleYearChange)
}

if (enrollmentForm) {
  enrollmentForm.addEventListener("submit", handleFormSubmit)
}

if (qrCodeButton) {
  qrCodeButton.addEventListener("click", downloadQRCode) // Added for QR code download functionality
}

if (copyBankDetailsButton) {
  copyBankDetailsButton.addEventListener("click", copyBankDetails) // Added for bank details copy functionality
}

// Handle university selection
function handleUniversityChange() {
  const selectedUniversity = universitySelect.value

  if (selectedUniversity) {
    // Show college dropdown
    collegeGroup.style.display = "block"
    collegeSelect.required = true

    // Populate colleges
    collegeSelect.innerHTML = '<option value="">Select College</option>'
    collegeData[selectedUniversity].forEach((college) => {
      const option = document.createElement("option")
      option.value = college
      option.textContent = college
      collegeSelect.appendChild(option)
    })
  } else {
    collegeGroup.style.display = "none"
    collegeSelect.required = false
    hideSubjectsAndPricing()
  }
}

// Handle year selection
function handleYearChange() {
  const selectedYear = yearSelect.value

  if (selectedYear) {
    showSubjects(selectedYear)
  } else {
    hideSubjectsAndPricing()
  }
}

// Show subjects for selected year
function showSubjects(year) {
  const yearData = subjectData[year]
  if (!yearData) return

  subjectGroup.style.display = "block"
  subjectOptions.innerHTML = ""

  // Add individual subject options
  yearData.subjects.forEach((subject) => {
    const div = document.createElement("div")
    div.className = "subject-option"
    div.innerHTML = `
            <input type="checkbox" id="${subject}" name="subjects" value="${subject}" onchange="calculatePrice()">
            <label for="${subject}">${subject} - ₹${yearData.singlePrice}</label>
        `
    subjectOptions.appendChild(div)
  })

  // Add bundle option
  const bundleDiv = document.createElement("div")
  bundleDiv.className = "subject-option"
  bundleDiv.innerHTML = `
        <input type="checkbox" id="bundle" name="subjects" value="Complete Bundle" onchange="handleBundleSelection()">
        <label for="bundle"><strong>Complete Bundle (All Subjects) - ₹${yearData.bundlePrice}</strong></label>
    `
  subjectOptions.appendChild(bundleDiv)

  calculatePrice()
}

// Handle bundle selection
function handleBundleSelection() {
  const bundleCheckbox = document.getElementById("bundle")
  const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]:not(#bundle)')

  if (bundleCheckbox.checked) {
    // Uncheck all individual subjects
    subjectCheckboxes.forEach((checkbox) => {
      checkbox.checked = false
      checkbox.disabled = true
    })
  } else {
    // Enable all individual subjects
    subjectCheckboxes.forEach((checkbox) => {
      checkbox.disabled = false
    })
  }

  calculatePrice()
}

// Calculate and display price
function calculatePrice() {
  const selectedYear = yearSelect.value
  if (!selectedYear) return

  const yearData = subjectData[selectedYear]
  const bundleCheckbox = document.getElementById("bundle")
  const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]:not(#bundle):checked')

  let total = 0
  let breakdown = ""

  if (bundleCheckbox && bundleCheckbox.checked) {
    total = yearData.bundlePrice
    breakdown = `<div class="price-item"><span>Complete Bundle (All Subjects)</span><span>₹${yearData.bundlePrice}</span></div>`
  } else if (subjectCheckboxes.length > 0) {
    total = subjectCheckboxes.length * yearData.singlePrice
    breakdown = `<div class="price-item"><span>${subjectCheckboxes.length} Subject(s) × ₹${yearData.singlePrice}</span><span>₹${total}</span></div>`
  }

  if (total > 0) {
    pricingDisplay.style.display = "block"
    paymentSection.style.display = "block"
    priceBreakdown.innerHTML = breakdown
    totalAmount.textContent = total

    // Make transaction reference required
    document.getElementById("transactionRef").required = true
  } else {
    pricingDisplay.style.display = "none"
    paymentSection.style.display = "none"
    document.getElementById("transactionRef").required = false
  }
}

// Hide subjects and pricing
function hideSubjectsAndPricing() {
  subjectGroup.style.display = "none"
  pricingDisplay.style.display = "none"
  paymentSection.style.display = "none"
  document.getElementById("transactionRef").required = false
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(enrollmentForm)
  const selectedSubjects = []

  // Get selected subjects
  const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]:checked')
  subjectCheckboxes.forEach((checkbox) => {
    selectedSubjects.push(checkbox.value)
  })

  // Prepare data for Google Sheets
  const submissionData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    university: formData.get("university"),
    year: formData.get("year"),
    college: formData.get("college"),
    subjects: selectedSubjects.join(", "),
    totalAmount: totalAmount.textContent,
    transactionRef: formData.get("transactionRef"),
    timestamp: new Date().toISOString(),
  }

  try {
    const scriptURL = "https://script.google.com/macros/s/AKfycbz14TSv75Hctybc5IwAY6hlx_y9MZeuJKlx53Mui6mMvHf0_4Nd4wt17-SiIfKGOC5v/exec"

    // Check if URL has been configured
    if (scriptURL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      alert(
        "⚠️ Google Sheets integration not configured yet!\n\nPlease follow the setup instructions in SETUP_INSTRUCTIONS.md to:\n1. Deploy the Google Apps Script\n2. Update the URL in script.js\n\nFor now, please contact us directly at studental.queries@gmail.com",
      )
      return
    }

    const response = await fetch(scriptURL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(submissionData),
    })

    if (response.ok) {
      const result = await response.text()
      console.log("[v0] Response result:", result)

      // Check if the response indicates success (even if it's not exactly "Success")
      if (result.includes("Success") || result.includes("success") || response.status === 200) {
        alert("✅ Enrollment submitted successfully! We will contact you soon.")
        enrollmentForm.reset()
        hideSubjectsAndPricing()
      } else {
        throw new Error("Unexpected response: " + result)
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error("[v0] Submission error:", error)

    if (error.message.includes("CORS") || error.name === "TypeError") {
      alert(
        "❌ CORS Error: Please ensure your Google Apps Script is:\n\n1. Deployed as 'Web app'\n2. Execute as: 'Me'\n3. Who has access: 'Anyone'\n4. URL is correctly updated in script.js\n\nFor immediate assistance, contact us at studental.queries@gmail.com",
      )
    } else {
      alert("❌ Submission Error: Please try again or contact us directly at studental.queries@gmail.com")
    }
  }
}

function downloadQRCode() {
  const qrImage = document.getElementById("upiQR")
  const link = document.createElement("a")
  link.href = qrImage.src
  link.download = "studental-upi-qr-code.png"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function copyBankDetails() {
  const bankDetails = `Account Name: BHUKYA SRI SAINATH
Account Number: 110247531300
IFSC Code: CNRB0013368
Bank: CANARA BANK`

  navigator.clipboard
    .writeText(bankDetails)
    .then(() => {
      alert("✅ Bank details copied to clipboard!")
    })
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = bankDetails
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("✅ Bank details copied to clipboard!")
    })
}

// Tab functionality for resources page
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName("tab-content")
  const tabButtons = document.getElementsByClassName("tab-button")

  // Hide all tab contents
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active")
  }

  // Remove active class from all buttons
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active")
  }

  // Show selected tab and mark button as active
  document.getElementById(tabName).classList.add("active")
  evt.currentTarget.classList.add("active")
}

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})
