document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("project-form");
  const projectList = document.getElementById("project-list");
  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  function renderProjects() {
    projectList.innerHTML = "";
    if (projects.length === 0) {
      projectList.innerHTML =
          '<p style="text-align: center; color: #777;">Belum ada proyek ditambahkan.</p>';
        localStorage.removeItem("projects");
      return;
    }

    let row = document.createElement("div");
    row.className = "row";
    projects.forEach((project) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      const startDate = new Date(project.startDate).getFullYear();
      const endDate = new Date(project.endDate).getFullYear();
      const dateRange =
        startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          ${
            project.imageData
              ? `<img src="${project.imageData}" class="card-img-top" alt="Project Image" style="object-fit:cover;max-height:180px;">`
              : ""
          }
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${project.name}</h5>
            <p class="card-text text-muted mb-1" style="font-size:0.95em;">Tahun: ${dateRange}</p>
            <p class="card-text">${project.description.substring(0, 100)}...</p>
            <div class="mb-2">${project.technologies
              .map((t) => `<span class='badge bg-secondary me-1'>${t}</span>`)
              .join("")}</div>
            <div class="mt-auto d-flex gap-2">
              <a class="btn btn-sm btn-primary" href="detail.html?id=${
                project.id
              }">Detail</a>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${
                project.id
              }">Delete</button>
            </div>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
    projectList.appendChild(row);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectName = document.getElementById("projectName").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const description = document.getElementById("description").value.trim();
    const technologies = Array.from(
      document.querySelectorAll(".tech-checkboxes input:checked")
    ).map((cb) => cb.value);
    
    const fileInput = document.getElementById("projectImage");
    let imageData = "";
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          imageData = ev.target.result;
          saveProject();
        };
        reader.readAsDataURL(file);
        return; 
      }
    }
    saveProject();

    function saveProject() {
      if (
        !projectName ||
        !startDate ||
        !endDate ||
        !description ||
        technologies.length === 0
      ) {
        alert("Semua field wajib diisi dan pilih minimal satu teknologi!");
        return;
      }
      const newProject = {
        id: Date.now(),
        name: projectName,
        startDate,
        endDate,
        description,
        technologies,
        imageData,
      };
      projects.push(newProject);
      renderProjects();
      form.reset();
      const previewImg = document.getElementById("imagePreview");
      const previewContainer = document.getElementById("imagePreviewContainer");
      if (previewImg && previewContainer) {
        previewImg.src = "";
        previewContainer.style.display = "none";
      }
    }
  });

  projectList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const projectId = parseInt(e.target.dataset.id);
      projects = projects.filter((p) => p.id !== projectId);
      renderProjects();
    }
  });

  renderProjects();
});
