let currentData = {};
let token = localStorage.getItem("adminToken");

// Check if already logged in
if (token) {
  showDashboard();
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass })
  })
  .then(res => {
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  })
  .then(data => {
    token = data.token;
    localStorage.setItem("adminToken", token);
    showDashboard();
  })
  .catch(err => {
    document.getElementById("login-error").style.display = "block";
  });
}

function logout() {
  token = null;
  localStorage.removeItem("adminToken");
  document.getElementById("login-section").style.display = "flex";
  document.getElementById("dashboard-section").style.display = "none";
}

function showDashboard() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "block";
  loadData();
}

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function loadData() {
  fetch("/api/content")
  .then(res => res.json())
  .then(data => {
    currentData = data;
    populateGeneral();
    populateHero();
    renderServices();
    renderProjects();
  });
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  };
}

function populateGeneral() {
  const g = currentData.general || {};
  document.getElementById("gen-logo-text").value = g.logo_text || "";
  document.getElementById("gen-logo-accent").value = g.logo_accent || "";
  document.getElementById("gen-contact-email").value = g.contact_email || "";
  document.getElementById("gen-contact-phone").value = g.contact_phone || "";
}

function saveGeneral() {
  const data = {
    logo_text: document.getElementById("gen-logo-text").value,
    logo_accent: document.getElementById("gen-logo-accent").value,
    contact_email: document.getElementById("gen-contact-email").value,
    contact_phone: document.getElementById("gen-contact-phone").value,
  };
  fetch("/api/content/general", { method: "POST", headers: authHeaders(), body: JSON.stringify(data) })
  .then(() => alert("General settings saved!"));
}

function populateHero() {
  const h = currentData.hero || {};
  document.getElementById("hero-badge").value = h.badge || "";
  document.getElementById("hero-title1").value = h.title_line1 || "";
  document.getElementById("hero-title2").value = h.title_line2 || "";
  document.getElementById("hero-title-glow").value = h.title_glow || "";
  document.getElementById("hero-subtitle").value = h.subtitle || "";
  document.getElementById("hero-image").value = h.image || "";
}

function saveHero() {
  const data = {
    badge: document.getElementById("hero-badge").value,
    title_line1: document.getElementById("hero-title1").value,
    title_line2: document.getElementById("hero-title2").value,
    title_glow: document.getElementById("hero-title-glow").value,
    subtitle: document.getElementById("hero-subtitle").value,
    image: document.getElementById("hero-image").value,
    stats: currentData.hero.stats // keeping stats same for now
  };
  fetch("/api/content/hero", { method: "POST", headers: authHeaders(), body: JSON.stringify(data) })
  .then(() => alert("Hero section saved!"));
}

// Services
function renderServices() {
  const list = document.getElementById("services-list");
  list.innerHTML = "";
  list.className = "";
  
  const services = currentData.services || [];
  services.forEach((s, idx) => {
    list.innerHTML += `
      <div class="item-card" data-idx="${idx}">
        <div class="form-group"><label>ID</label><input type="text" value="${s.id}" class="s-id"></div>
        <div class="form-group"><label>Icon</label><input type="text" value="${s.icon}" class="s-icon"></div>
        <div class="form-group"><label>Badge</label><input type="text" value="${s.badge}" class="s-badge"></div>
        <div class="form-group"><label>Title</label><input type="text" value="${s.title}" class="s-title"></div>
        <div class="form-group"><label>Description</label><textarea class="s-desc">${s.description}</textarea></div>
        <div class="form-group"><label>Features (comma separated)</label><textarea class="s-feat">${s.features.join(", ")}</textarea></div>
        <button class="btn btn-danger" onclick="deleteService(${idx})">Delete</button>
      </div>
    `;
  });
}

function addService() {
  currentData.services = currentData.services || [];
  currentData.services.push({ id: "new", icon: "✨", badge: "", title: "New Service", description: "", features: [] });
  renderServices();
}

function deleteService(idx) {
  currentData.services.splice(idx, 1);
  renderServices();
}

function saveServices() {
  const list = document.getElementById("services-list");
  const newServices = [];
  list.querySelectorAll(".item-card").forEach(card => {
    newServices.push({
      id: card.querySelector(".s-id").value,
      icon: card.querySelector(".s-icon").value,
      badge: card.querySelector(".s-badge").value,
      title: card.querySelector(".s-title").value,
      description: card.querySelector(".s-desc").value,
      features: card.querySelector(".s-feat").value.split(",").map(i => i.trim()).filter(i => i)
    });
  });
  fetch("/api/content/services", { method: "POST", headers: authHeaders(), body: JSON.stringify(newServices) })
  .then(() => { currentData.services = newServices; alert("Services saved!"); });
}

// Projects
function renderProjects() {
  const list = document.getElementById("projects-list");
  list.innerHTML = "";
  list.className = "";
  
  const projects = currentData.projects || [];
  projects.forEach((p, idx) => {
    list.innerHTML += `
      <div class="item-card" data-idx="${idx}">
        <div class="form-group"><label>ID</label><input type="text" value="${p.id}" class="p-id"></div>
        <div class="form-group"><label>Tag Filter</label><input type="text" value="${p.tag}" class="p-tag"></div>
        <div class="form-group"><label>Gradient/Background</label><input type="text" value="${p.gradient}" class="p-grad"></div>
        <div class="form-group"><label>Art Icon</label><input type="text" value="${p.art_icon}" class="p-icon"></div>
        <div class="form-group"><label>Art Text</label><input type="text" value="${p.art_text}" class="p-arttext"></div>
        <div class="form-group"><label>Title</label><input type="text" value="${p.title}" class="p-title"></div>
        <div class="form-group"><label>Description</label><textarea class="p-desc">${p.description}</textarea></div>
        <div class="form-group"><label>Specs (comma separated)</label><textarea class="p-specs">${p.specs.join(", ")}</textarea></div>
        <div class="form-group">
          <label>Project Image (URL or Upload)</label>
          <input type="text" value="${p.image || ''}" class="p-image" id="p-img-${idx}">
          <br><br>
          <input type="file" id="p-file-${idx}" accept="image/*" />
          <button class="btn" onclick="uploadImage('p-file-${idx}', 'p-img-${idx}')">Upload</button>
          ${p.image ? `<br><img src="${p.image}" class="image-preview" />` : ''}
        </div>
        <button class="btn btn-danger" onclick="deleteProject(${idx})">Delete</button>
      </div>
    `;
  });
}

function addProject() {
  currentData.projects = currentData.projects || [];
  currentData.projects.push({ id: "proj-new", tag: "custom", gradient: "linear-gradient(135deg,#000,#333)", art_icon: "📸", art_text: "New Project", title: "New", description: "", specs: [], image: "" });
  renderProjects();
}

function deleteProject(idx) {
  currentData.projects.splice(idx, 1);
  renderProjects();
}

function saveProjects() {
  const list = document.getElementById("projects-list");
  const newProjects = [];
  list.querySelectorAll(".item-card").forEach(card => {
    newProjects.push({
      id: card.querySelector(".p-id").value,
      tag: card.querySelector(".p-tag").value,
      gradient: card.querySelector(".p-grad").value,
      art_icon: card.querySelector(".p-icon").value,
      art_text: card.querySelector(".p-arttext").value,
      title: card.querySelector(".p-title").value,
      description: card.querySelector(".p-desc").value,
      specs: card.querySelector(".p-specs").value.split(",").map(i => i.trim()).filter(i => i),
      image: card.querySelector(".p-image").value
    });
  });
  fetch("/api/content/projects", { method: "POST", headers: authHeaders(), body: JSON.stringify(newProjects) })
  .then(() => { currentData.projects = newProjects; alert("Projects saved!"); renderProjects(); });
}

// Upload Image helper
function uploadImage(fileInputId, targetInputId) {
  const fileInput = document.getElementById(fileInputId);
  if (!fileInput.files.length) {
    alert("Please select a file first");
    return;
  }
  
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  
  fetch("/api/upload", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    },
    body: formData
  })
  .then(res => {
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  })
  .then(data => {
    document.getElementById(targetInputId).value = data.url;
    alert("Image uploaded successfully!");
  })
  .catch(err => {
    alert("Error: " + err.message);
  });
}
