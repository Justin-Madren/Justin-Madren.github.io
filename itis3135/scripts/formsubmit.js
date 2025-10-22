// ================================
// MAIN FUNCTION (defined first)
// ================================
function generateIntroduction() {
  const form = document.getElementById("introForm");

  // --- General info
  const firstName = form.firstName.value.trim();
  const middleName = form.middleName.value.trim();
  const nickName = form.nickName ? form.nickName.value.trim() : "";
  const lastName = form.lastName.value.trim();

  const ackStatement = form.ackStatment ? form.ackStatment.value.trim() : "";
  const ackDate = form.ackDate ? form.ackDate.value.trim() : "";

  const divider = form.divider ? form.divider.value.trim() : "~";

  // --- Picture handling (use uploaded or default)
  const pictureInput = form.picture;
  const imageFile = pictureInput && pictureInput.files ? pictureInput.files[0] : null;
  const imageURL = imageFile
    ? URL.createObjectURL(imageFile)
    : (pictureInput && pictureInput.dataset && pictureInput.dataset.defaultImage) || "images/default.jpg";
  const caption = form.caption ? form.caption.value.trim() : "";

  // --- Statements & bullets
  const personalStatement = form.personalStatment ? form.personalStatment.value.trim() : "";
  const bullet1 = form.bullet1 ? form.bullet1.value.trim() : "";
  const bullet2 = form.bullet2 ? form.bullet2.value.trim() : "";
  const bullet3 = form.bullet3 ? form.bullet3.value.trim() : "";
  const bullet4 = form.bullet4 ? form.bullet4.value.trim() : "";
  const bullet6 = form.bullet6 ? form.bullet6.value.trim() : ""; // quote
  const bullet7 = form.bullet7 ? form.bullet7.value.trim() : ""; // author

  // --- Courses
  const courseNodes = Array.from(form.querySelectorAll("#courseList .course"));
  const courses = courseNodes.map((course) => ({
    department: (course.querySelector("[name='department']") && course.querySelector("[name='department']").value.trim()) || "",
    number: (course.querySelector("[name='number']") && course.querySelector("[name='number']").value.trim()) || "",
    name: (course.querySelector("[name='courseName']") && course.querySelector("[name='courseName']").value.trim()) || "",
    reason: (course.querySelector("[name='reason']") && course.querySelector("[name='reason']").value.trim()) || ""
  }));

  const courseHTML = courses.map((c) => `<li>${c.department} ${c.number} - ${c.name}: ${c.reason}</li>`).join("");

  // --- Links (7)
  const links = [
    form.link1 ? form.link1.value.trim() : "",
    form.link2 ? form.link2.value.trim() : "",
    form.link3 ? form.link3.value.trim() : "",
    form.link4 ? form.link4.value.trim() : "",
    form.link5 ? form.link5.value.trim() : "",
    form.link6 ? form.link6.value.trim() : "",
    form.link7 ? form.link7.value.trim() : ""
  ].filter((link) => link !== "");

  const linksHTML = links.map((l) => `<a href="${l}" target="_blank">|| ${l} ||</a>`).join(" ");

  // --- Build the final HTML in the correct order (image appears after acknowledgment)
  const resultHTML = `
    <section id="introResult">
      <h2>Introduction Form Result</h2>

      <h3>${lastName}${firstName ? " " + firstName : ""}${middleName ? " " + middleName : ""}${nickName ? ' ("' + nickName + '")' : ""}</h3>

      <p style="text-align: center;">${ackStatement}${ackDate ? " " + ackDate : ""}</p>

      

      <div class="photo-block">
        <img src="${imageURL}" alt="${caption}" style="max-width:260px; display:block; margin:12px auto;">
        ${caption ? `<p class="caption" style="text-align:center; font-style:italic;">${caption}</p>` : ""}
      </div>

      <p><strong>Personal Statement:</strong> ${personalStatement}</p>

      <ul>
        <li><strong>Personal Background:</strong> ${bullet1}</li>
        <li><strong>Academic Background:</strong> ${bullet2}</li>
        <li><strong>Professional Background:</strong> ${bullet3}</li>
        <li><strong>Primary Computer:</strong> ${bullet4}</li>
        <li><strong>Courses I’m Taking and Why:</strong>
          <ul>${courseHTML}</ul>
        </li>
        <li><strong>Favorite Quote:</strong> “${bullet6}” — ${bullet7}</li>
      </ul>

      <p class="links" style="text-align:center; margin-top:12px;">${linksHTML}</p>

      <div style="text-align:center; margin-top:18px;">
        <button type="button" id="resetForm">Start Over</button>
      </div>
    </section>
  `;

  // Replace the form with the result markup
  form.outerHTML = resultHTML;

  // Attach reset behavior
  const resetBtn = document.getElementById("resetForm");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      location.reload();
    });
  }
}

// ================================
// DOMContentLoaded: setup (after function)
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("introForm");
  if (!form) return;

  const addCourseBtn = document.getElementById("addCourseBtn");
  const clearButton = document.getElementById("clearButton");
  const pictureInput = document.getElementById("picture");

  // set default image path (adjust if your default image is different)
  if (pictureInput) {
    pictureInput.dataset.defaultImage = "images/default.jpg";
  }

  // Submit listener (calls generateIntroduction which is already defined)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    generateIntroduction();
  });

  // Add new course (clone template .course if exists)
  if (addCourseBtn) {
    addCourseBtn.addEventListener("click", () => {
      const courseList = document.getElementById("courseList");
      const firstCourse = courseList && courseList.querySelector(".course");
      const newCourse = document.createElement("div");
      newCourse.classList.add("course");

      // If we have a template course, clone its markup (but clear values)
      if (firstCourse) {
        newCourse.innerHTML = firstCourse.innerHTML;
        newCourse.querySelectorAll("input").forEach((inp) => (inp.value = ""));
      } else {
        // fallback: create inputs
        newCourse.innerHTML = `
          <input type="text" name="department" placeholder="department" required>
          <input type="text" name="number" placeholder="number" required>
          <input type="text" name="courseName" placeholder="course name" required>
          <input type="text" name="reason" placeholder="reason" required>
          <button type="button" class="deleteCourse">Delete</button>
        `;
      }

      courseList.appendChild(newCourse);

      // attach delete handler
      const del = newCourse.querySelector(".deleteCourse");
      if (del) {
        del.addEventListener("click", () => {
          const all = courseList.querySelectorAll(".course");
          if (all.length > 1) {
            newCourse.remove();
          } else {
            // keep one course minimum
            alert("You must have at least one course.");
          }
        });
      }
    });
  }

  // Attach delete handlers to existing course delete buttons
  const courseListEl = document.getElementById("courseList");
  if (courseListEl) {
    courseListEl.querySelectorAll(".deleteCourse").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const courseDiv = e.target.closest(".course");
        const all = courseListEl.querySelectorAll(".course");
        if (all.length > 1) {
          courseDiv.remove();
        } else {
          alert("You must have at least one course.");
        }
      });
    });
  }

  // Clear button: clear text inputs & textareas; reset file inputs
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      Array.from(form.querySelectorAll("input, textarea")).forEach((field) => {
        if (!["file", "button", "submit", "reset"].includes(field.type)) {
          field.value = "";
        } else if (field.type === "file") {
          field.value = null;
        }
      });
    });
  }
});
