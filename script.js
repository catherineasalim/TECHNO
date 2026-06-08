/* =====================================================
   PATHLY SCRIPT - FINAL FULL VERSION
   Navbar, Login, Profile, Loker, Mentoring, Campus, Modals
===================================================== */


/* =========================
   GLOBAL STATE
========================= */

let activeFilter = "Semua";
let searchQ = "";

let selectedJobTitle = "";
let selectedMentorName = "";
let selectedSessionType = "Mentoring Saja";

let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];


/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();

  if (document.getElementById("lokerGrid")) {
    renderJobs();
  }

  if (document.getElementById("mentorGrid")) {
    renderMentors();
  }
});


/* =========================
   NAVBAR
========================= */

function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  fetch("components/navbar.html")
    .then(res => res.text())
    .then(data => {
      navbar.innerHTML = data;
      setActiveNavbar();
      checkLoginState();
    })
    .catch(err => {
      console.error("Navbar gagal dimuat:", err);
    });
}

function setActiveNavbar() {
  const currentPage = window.location.pathname.split("/").pop() || "home.html";

  document.querySelectorAll(".nav-links a").forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function goTo(page) {
  window.location.href = page;
}


/* =========================
   HELPER
========================= */

function escapeQuote(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");
}

function showSuccess(title, message) {
  const modal = document.getElementById("successModal");
  const titleEl = document.getElementById("successTitle");
  const messageEl = document.getElementById("successMessage");

  if (!modal || !titleEl || !messageEl) {
    alert(`${title}\n${message}`);
    return;
  }

  titleEl.innerText = title;
  messageEl.innerText = message;
  modal.classList.add("show");
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) modal.classList.remove("show");
}


/* =========================
   LOGIN / REGISTER / PROFILE
========================= */

function openRegisterModal() {
  const modal = document.getElementById("registerModal");

  if (modal) {
    modal.classList.add("show");
  } else {
    window.location.href = "login.html";
  }
}

function closeRegister() {
  const modal = document.getElementById("registerModal");
  if (modal) modal.classList.remove("show");
}

function registerUser() {
  const name = document.getElementById("regName")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();

  if (!name || !email) {
    alert("Nama dan email wajib diisi.");
    return;
  }

  localStorage.setItem("pathly_user", JSON.stringify({
    name,
    email,
    birth: document.getElementById("regBirth")?.value || "",
    city: document.getElementById("regCity")?.value || "",
    social: document.getElementById("regSocial")?.value || "",
    linkedin: document.getElementById("regLinkedin")?.value || "",
    university: "Universitas Kristen Petra",
    major: "Informatika",
    status: "Mahasiswa Semester Akhir"
  }));

  closeRegister();
  checkLoginState();

  showSuccess(
    "Akun Berhasil Dibuat",
    "Selamat datang di Pathly. Kamu bisa mulai mencari mentor dan lowongan kerja."
  );
}

function dummyLogin() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!email || !password) {
    alert("Email dan password wajib diisi.");
    return;
  }

  localStorage.setItem("pathly_user", JSON.stringify({
    name: "Christopher Aaron",
    email: email,
    city: "Surabaya",
    university: "Universitas Kristen Petra",
    major: "Informatika",
    status: "Mahasiswa Semester Akhir"
  }));

  window.location.href = "home.html";
}

function checkLoginState() {
  const user = JSON.parse(localStorage.getItem("pathly_user") || "null");

  const navCta = document.querySelector(".nav-cta");
  const profileMenu = document.getElementById("profileMenu");
  const profileInitial = document.getElementById("profileInitial");

  if (!navCta || !profileMenu) return;

  if (user) {
    navCta.classList.add("hidden");
    profileMenu.classList.remove("hidden");

    if (profileInitial) {
      profileInitial.textContent = user.name ? user.name.charAt(0).toUpperCase() : "U";
    }
  } else {
    navCta.classList.remove("hidden");
    profileMenu.classList.add("hidden");
  }
}

function toggleDropdown(event) {
  if (event) event.stopPropagation();

  const dropdown = document.getElementById("dropdownMenu");
  if (!dropdown) return;

  dropdown.classList.toggle("hidden");
}

function goProfile(event) {
  if (event) event.stopPropagation();
  window.location.href = "profile.html";
}

function logout(event) {
  if (event) event.stopPropagation();

  localStorage.removeItem("pathly_user");
  localStorage.removeItem("savedJobs");
  localStorage.removeItem("appliedJobs");

  window.location.href = "login.html";
}

function showProfile() {
  window.location.href = "profile.html";
}

function saveProfile() {
  showSuccess(
    "Profile Disimpan",
    "Perubahan profile berhasil disimpan."
  );
}


/* Close dropdown when clicking outside */
document.addEventListener("click", function (event) {
  const profileMenu = document.getElementById("profileMenu");
  const dropdown = document.getElementById("dropdownMenu");

  if (!profileMenu || !dropdown) return;

  if (!profileMenu.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});


/* =========================
   JOB DATA
========================= */

const jobs = [
  {
    title: "Frontend Developer",
    company: "Astra Digital",
    icon: "⚙️",
    location: "Remote",
    type: "Full-time",
    exp: "Fresh Graduate",
    salary: "Rp 6–9 Juta",
    tags: ["Remote", "Full-time", "IT"],
    urgent: true
  },
  {
    title: "Data Analyst",
    company: "Grab Indonesia",
    icon: "🚗",
    location: "Surabaya",
    type: "Full-time",
    exp: "0–2 Tahun",
    salary: "Rp 7–10 Juta",
    tags: ["Surabaya", "Full-time", "IT"],
    urgent: false
  },
  {
    title: "UI/UX Designer",
    company: "Tokopedia",
    icon: "🎨",
    location: "Remote",
    type: "Full-time",
    exp: "Fresh Graduate",
    salary: "Rp 5–8 Juta",
    tags: ["Remote", "Full-time", "Design"],
    urgent: false
  },
  {
    title: "Digital Marketing Intern",
    company: "Shopee Indonesia",
    icon: "📣",
    location: "Surabaya",
    type: "Internship",
    exp: "Mahasiswa",
    salary: "Rp 2–4 Juta",
    tags: ["Marketing", "Business", "Surabaya"],
    urgent: true
  },
  {
    title: "Business Development Associate",
    company: "Ruangguru",
    icon: "💼",
    location: "Jakarta",
    type: "Full-time",
    exp: "Fresh Graduate",
    salary: "Rp 5–7 Juta",
    tags: ["Business", "Full-time"],
    urgent: false
  },
  {
    title: "Product Designer",
    company: "Traveloka",
    icon: "✨",
    location: "Remote",
    type: "Full-time",
    exp: "0–2 Tahun",
    salary: "Rp 8–12 Juta",
    tags: ["Remote", "Design", "Full-time"],
    urgent: false
  }
];


/* =========================
   RENDER JOBS
========================= */

function renderJobs() {
  const grid = document.getElementById("lokerGrid");
  if (!grid) return;

  const filteredJobs = jobs.filter(j => {
    const matchFilter =
      activeFilter === "Semua" || j.tags.includes(activeFilter);

    const matchSearch =
      j.title.toLowerCase().includes(searchQ) ||
      j.company.toLowerCase().includes(searchQ) ||
      j.location.toLowerCase().includes(searchQ) ||
      j.type.toLowerCase().includes(searchQ);

    return matchFilter && matchSearch;
  });

  if (filteredJobs.length === 0) {
    grid.innerHTML = `
      <div class="glass job-card empty-card">
        <h3>Tidak ada lowongan ditemukan</h3>
        <p>Coba gunakan kata kunci atau filter lain.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredJobs.map(j => `
    <div class="glass job-card">

      <div class="job-card-top">
        <div class="company-logo">${j.icon}</div>
        ${j.urgent ? `<span class="urgent-badge">🔥 Butuh Cepat</span>` : ""}
      </div>

      <h3>${j.title}</h3>
      <div class="company-name">${j.company}</div>

      <div class="job-meta">
        <span class="meta-pill">📍 ${j.location}</span>
        <span class="meta-pill">💼 ${j.type}</span>
        <span class="meta-pill">🎓 ${j.exp}</span>
      </div>

      <div class="salary">${j.salary}</div>

      <div class="job-actions">
        <button class="btn-primary job-btn" onclick="openApplyModal('${escapeQuote(j.title)}')">
          Apply →
        </button>

        <button class="bookmark-btn job-btn" onclick="saveJob('${escapeQuote(j.title)}')">
          ⭐ Save
        </button>
      </div>

    </div>
  `).join("");
}

function filterJobs() {
  const input = document.getElementById("jobSearch");
  searchQ = input ? input.value.toLowerCase() : "";
  renderJobs();
}

function setFilter(filter, button) {
  activeFilter = filter;

  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.remove("active");
  });

  if (button) button.classList.add("active");

  renderJobs();
}

function showSaved() {
  const grid = document.getElementById("lokerGrid");
  if (!grid) return;

  const savedData = jobs.filter(j => savedJobs.includes(j.title));

  if (savedData.length === 0) {
    showSuccess(
      "Belum Ada Lowongan Tersimpan",
      "Lowongan yang kamu simpan akan muncul di sini."
    );
    return;
  }

  grid.innerHTML = savedData.map(j => `
    <div class="glass job-card">

      <div class="job-card-top">
        <div class="company-logo">${j.icon}</div>
      </div>

      <h3>${j.title}</h3>
      <div class="company-name">${j.company}</div>

      <div class="job-meta">
        <span class="meta-pill">📍 ${j.location}</span>
        <span class="meta-pill">💼 ${j.type}</span>
        <span class="meta-pill">🎓 ${j.exp}</span>
      </div>

      <div class="salary">${j.salary}</div>

      <div class="job-actions">
        <button class="btn-primary job-btn" onclick="openApplyModal('${escapeQuote(j.title)}')">
          Apply →
        </button>

        <button class="bookmark-btn job-btn" onclick="saveJob('${escapeQuote(j.title)}')">
          ⭐ Save
        </button>
      </div>

    </div>
  `).join("");
}

function showApplied() {
  const grid = document.getElementById("lokerGrid");
  if (!grid) return;

  const appliedData = jobs.filter(j => appliedJobs.includes(j.title));

  if (appliedData.length === 0) {
    showSuccess(
      "Belum Ada Lamaran",
      "Lamaran yang sudah kamu kirim akan muncul di sini."
    );
    return;
  }

  grid.innerHTML = appliedData.map(j => `
    <div class="glass job-card">

      <div class="job-card-top">
        <div class="company-logo">${j.icon}</div>
      </div>

      <h3>${j.title}</h3>
      <div class="company-name">${j.company}</div>

      <div class="job-meta">
        <span class="meta-pill">📍 ${j.location}</span>
        <span class="meta-pill">💼 ${j.type}</span>
        <span class="meta-pill">🎓 ${j.exp}</span>
      </div>

      <div class="salary">${j.salary}</div>

      <div class="job-actions">
        <button class="bookmark-btn job-btn">
          Sudah Dilamar
        </button>
      </div>

    </div>
  `).join("");
}

function saveJob(jobTitle = "") {
  if (!savedJobs.includes(jobTitle)) {
    savedJobs.push(jobTitle);
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  }

  showSuccess(
    "Lowongan Disimpan",
    `${jobTitle} berhasil ditambahkan ke daftar tersimpan.`
  );
}


/* =========================
   APPLY MODAL
========================= */

function openApplyModal(jobTitle = "") {
  selectedJobTitle = jobTitle;

  const modal = document.getElementById("applyModal");

  if (!modal) {
    console.error("Modal applyModal tidak ditemukan di HTML.");
    return;
  }

  modal.classList.add("show");
}

function closeApplyModal() {
  const modal = document.getElementById("applyModal");
  if (modal) modal.classList.remove("show");
}

function submitApplyForm() {
  const name = document.getElementById("applyName")?.value.trim();
  const email = document.getElementById("applyEmail")?.value.trim();
  const phone = document.getElementById("applyPhone")?.value.trim();
  const university = document.getElementById("applyUniversity")?.value.trim();

  if (!name || !email || !phone || !university) {
    alert("Nama, email, nomor WhatsApp, dan universitas wajib diisi.");
    return;
  }

  if (selectedJobTitle && !appliedJobs.includes(selectedJobTitle)) {
    appliedJobs.push(selectedJobTitle);
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
  }

  closeApplyModal();

  showSuccess(
    "Lamaran Terkirim",
    `Lamaran kamu untuk posisi ${selectedJobTitle} berhasil dikirim. Pantau update melalui email atau WhatsApp.`
  );

  clearApplyForm();
}

function clearApplyForm() {
  const fields = [
    "applyName",
    "applyEmail",
    "applyPhone",
    "applyUniversity",
    "applyMajor",
    "applyLinkedin",
    "applyReason"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}


/* =========================
   MENTOR DATA
========================= */

const mentors = [
  {
    name: "Nadia Putri",
    role: "HR Specialist",
    company: "Unilever Indonesia",
    initials: "NP",
    rating: "4.9",
    reviews: "128",
    price: "Rp75K",
    color: "#3B82F6",
    tags: ["CV Review", "Interview", "Career Planning"]
  },
  {
    name: "Kevin Wijaya",
    role: "Product Designer",
    company: "Gojek",
    initials: "KW",
    rating: "4.8",
    reviews: "96",
    price: "Rp100K",
    color: "#8B5CF6",
    tags: ["UI/UX", "Portfolio", "Design Career"]
  },
  {
    name: "Raka Pratama",
    role: "Data Analyst",
    company: "Tokopedia",
    initials: "RP",
    rating: "4.9",
    reviews: "112",
    price: "Rp85K",
    color: "#06B6D4",
    tags: ["Data", "SQL", "Career Roadmap"]
  },
  {
    name: "Amanda Clarissa",
    role: "Talent Acquisition",
    company: "Bank BCA",
    initials: "AC",
    rating: "4.9",
    reviews: "86",
    price: "Rp90K",
    color: "#22C55E",
    tags: ["HR", "Interview", "Recruitment"]
  },
  {
    name: "Darren Wijaya",
    role: "Business Analyst",
    company: "Traveloka",
    initials: "DW",
    rating: "4.8",
    reviews: "74",
    price: "Rp95K",
    color: "#F97316",
    tags: ["Business", "Case Study", "Consulting"]
  },
  {
    name: "Michelle Tan",
    role: "Digital Marketing Lead",
    company: "Shopee Indonesia",
    initials: "MT",
    rating: "4.9",
    reviews: "101",
    price: "Rp80K",
    color: "#EC4899",
    tags: ["Marketing", "Branding", "Social Media"]
  }
];


/* =========================
   RENDER MENTORS
========================= */

function renderMentors() {
  const grid = document.getElementById("mentorGrid");
  if (!grid) return;

  grid.innerHTML = mentors.map(m => `
    <div class="glass mentor-card">

      <div class="mentor-card-top">
        <div class="avatar" style="background:linear-gradient(135deg, ${m.color}, #0A1931)">
          ${m.initials}
        </div>

        <div>
          <h3>${m.name}</h3>
          <div class="role">${m.role}</div>
          <div class="company">${m.company}</div>
        </div>
      </div>

      <div class="mentor-stars">
        <span style="color:#F0C040; font-size:13px;">★★★★★</span>
        <span style="font-size:12px; color:var(--text-muted); margin-left:6px;">
          ${m.rating} (${m.reviews} review)
        </span>
      </div>

      <div class="mentor-tags">
        ${m.tags.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>

      <div class="mentor-price">
        ${m.price} <span>/ sesi</span>
      </div>

      <button class="book-btn" onclick="openBookingModal('${escapeQuote(m.name)}')">
        Book Sesi →
      </button>

    </div>
  `).join("");
}


/* =========================
   BOOKING MENTOR MODAL
========================= */

function openBookingModal(mentorName = "") {
  selectedMentorName = mentorName;

  const modal = document.getElementById("bookingModal");
  const mentorText = document.getElementById("bookingMentorText");

  if (!modal) {
    console.error("Modal bookingModal tidak ditemukan di HTML.");
    return;
  }

  if (mentorText) {
    mentorText.innerText = mentorName
      ? `Booking dengan ${mentorName}. Lengkapi data diri dan pilih tipe sesi mentoring.`
      : "Lengkapi data diri dan pilih tipe sesi mentoring.";
  }

  modal.classList.add("show");
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.remove("show");
}

function selectSessionType(button, type) {
  selectedSessionType = type;

  document.querySelectorAll(".session-card").forEach(card => {
    card.classList.remove("active");
  });

  button.classList.add("active");
}

function submitBookingForm() {
  const name = document.getElementById("bookName")?.value.trim();
  const email = document.getElementById("bookEmail")?.value.trim();
  const phone = document.getElementById("bookPhone")?.value.trim();
  const university = document.getElementById("bookUniversity")?.value.trim();
  const status = document.getElementById("bookStatus")?.value;
  const dateTime = document.getElementById("bookDateTime")?.value;

  if (!name || !email || !phone || !university || !status || !dateTime) {
    alert("Nama, email, WhatsApp, universitas, status, dan jadwal wajib diisi.");
    return;
  }

  closeBookingModal();

  showSuccess(
    "Booking Berhasil",
    selectedMentorName
      ? `Booking ${selectedSessionType} dengan ${selectedMentorName} berhasil. Mentor akan menghubungi kamu melalui WhatsApp.`
      : `Booking ${selectedSessionType} berhasil. Mentor akan menghubungi kamu melalui WhatsApp.`
  );

  clearBookingForm();
}

function clearBookingForm() {
  const fields = [
    "bookName",
    "bookEmail",
    "bookPhone",
    "bookUniversity",
    "bookMajor",
    "bookStatus",
    "bookDateTime",
    "bookNeeds"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  selectedSessionType = "Mentoring Saja";

  document.querySelectorAll(".session-card").forEach((card, index) => {
    card.classList.toggle("active", index === 0);
  });
}


/* =========================
   REGISTER AS MENTOR MODAL
========================= */

function openMentorRegisterModal() {
  const modal = document.getElementById("mentorRegisterModal");

  if (!modal) {
    console.error("mentorRegisterModal tidak ditemukan di HTML.");
    return;
  }

  modal.classList.add("show");
}

function closeMentorRegisterModal() {
  const modal = document.getElementById("mentorRegisterModal");
  if (modal) modal.classList.remove("show");
}

function submitMentorRegisterForm() {
  const name = document.getElementById("mentorRegName")?.value.trim();
  const email = document.getElementById("mentorRegEmail")?.value.trim();
  const phone = document.getElementById("mentorRegPhone")?.value.trim();
  const linkedin = document.getElementById("mentorRegLinkedin")?.value.trim();
  const role = document.getElementById("mentorRegRole")?.value.trim();
  const company = document.getElementById("mentorRegCompany")?.value.trim();
  const expertise = document.getElementById("mentorRegExpertise")?.value;

  if (!name || !email || !phone || !linkedin || !role || !company || !expertise) {
    alert("Nama, email, WhatsApp, LinkedIn, posisi, perusahaan, dan bidang mentoring wajib diisi.");
    return;
  }

  closeMentorRegisterModal();

  showSuccess(
    "Pendaftaran Mentor Berhasil",
    "Data kamu berhasil dikirim. Tim Pathly akan melakukan verifikasi dan menghubungi kamu melalui WhatsApp."
  );

  clearMentorRegisterForm();
}

function clearMentorRegisterForm() {
  const fields = [
    "mentorRegName",
    "mentorRegEmail",
    "mentorRegPhone",
    "mentorRegLinkedin",
    "mentorRegRole",
    "mentorRegCompany",
    "mentorRegExpertise",
    "mentorRegExperience",
    "mentorRegReason"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}


/* =========================
   CAMPUS MODAL
========================= */

function openCampusModal() {
  const modal = document.getElementById("campusModal");
  if (modal) modal.classList.add("show");
}

function openCampusModalWithPackage(packageName = "") {
  const modal = document.getElementById("campusModal");
  const packageSelect = document.getElementById("campusPackage");

  if (packageSelect && packageName) {
    packageSelect.value = packageName;
  }

  if (modal) modal.classList.add("show");
}

function closeCampusModal() {
  const modal = document.getElementById("campusModal");
  if (modal) modal.classList.remove("show");
}

function submitCampusForm() {
  const campusName = document.getElementById("campusName")?.value.trim();
  const picName = document.getElementById("campusPic")?.value.trim();
  const email = document.getElementById("campusEmail")?.value.trim();
  const phone = document.getElementById("campusPhone")?.value.trim();
  const packageType = document.getElementById("campusPackage")?.value;

  if (!campusName || !picName || !email || !phone || !packageType) {
    alert("Nama universitas, PIC, email, WhatsApp, dan paket wajib diisi.");
    return;
  }

  closeCampusModal();

  showSuccess(
    "Pengajuan Berhasil",
    packageType === "Konsultasi lebih lanjut via WhatsApp"
      ? "Pengajuan berhasil dikirim. Tim Pathly akan menghubungi PIC untuk diskusi lebih lanjut via WhatsApp."
      : `Pengajuan paket ${packageType} berhasil dikirim. Tim Pathly akan menghubungi PIC melalui WhatsApp.`
  );

  clearCampusForm();
}

function clearCampusForm() {
  const fields = [
    "campusName",
    "campusPic",
    "campusEmail",
    "campusPhone",
    "campusRole",
    "campusParticipants",
    "campusPackage",
    "campusNeeds"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}


/* =========================
   CLOSE MODAL
========================= */

document.addEventListener("click", e => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("show");
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.show").forEach(modal => {
      modal.classList.remove("show");
    });
  }
});


/* =========================
   EXPOSE TO WINDOW
========================= */

window.goTo = goTo;

window.openRegisterModal = openRegisterModal;
window.closeRegister = closeRegister;
window.registerUser = registerUser;
window.dummyLogin = dummyLogin;

window.toggleDropdown = toggleDropdown;
window.goProfile = goProfile;
window.logout = logout;
window.showProfile = showProfile;
window.saveProfile = saveProfile;

window.filterJobs = filterJobs;
window.setFilter = setFilter;
window.showSaved = showSaved;
window.showApplied = showApplied;
window.saveJob = saveJob;

window.openApplyModal = openApplyModal;
window.closeApplyModal = closeApplyModal;
window.submitApplyForm = submitApplyForm;

window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.selectSessionType = selectSessionType;
window.submitBookingForm = submitBookingForm;

window.openMentorRegisterModal = openMentorRegisterModal;
window.closeMentorRegisterModal = closeMentorRegisterModal;
window.submitMentorRegisterForm = submitMentorRegisterForm;

window.openCampusModal = openCampusModal;
window.openCampusModalWithPackage = openCampusModalWithPackage;
window.closeCampusModal = closeCampusModal;
window.submitCampusForm = submitCampusForm;

window.showSuccess = showSuccess;
window.closeSuccessModal = closeSuccessModal;