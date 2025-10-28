// ================================
// generate_json.js (styled JSON output)
// ================================

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("introForm");
  var jsonBtn = document.getElementById("generateJSON");

  if (!form || !jsonBtn) return;

  jsonBtn.addEventListener("click", function () {
    // --- Gather form data ---
    var pictureInput = form.picture;
    var imageFile = pictureInput && pictureInput.files ? pictureInput.files[0] : null;
    var imageURL = imageFile
      ? imageFile.name
      : (pictureInput && pictureInput.getAttribute("data-default-image")) ||
        "images/HeadShot2024.jpg";

    var formData = {
      firstName: form.firstName ? form.firstName.value.trim() : "",
      middleName: form.middleName ? form.middleName.value.trim() : "",
      nickName: form.nickName ? form.nickName.value.trim() : "",
      lastName: form.lastName ? form.lastName.value.trim() : "",
      ackStatement: form.ackStatment ? form.ackStatment.value.trim() : "",
      ackDate: form.ackDate ? form.ackDate.value.trim() : "",
      divider: form.divider ? form.divider.value.trim() : "~",
      caption: form.caption ? form.caption.value.trim() : "",
      personalStatement: form.personalStatment
        ? form.personalStatment.value.trim()
        : "",
      bullet1: form.bullet1 ? form.bullet1.value.trim() : "",
      bullet2: form.bullet2 ? form.bullet2.value.trim() : "",
      bullet3: form.bullet3 ? form.bullet3.value.trim() : "",
      bullet4: form.bullet4 ? form.bullet4.value.trim() : "",
      bullet6: form.bullet6 ? form.bullet6.value.trim() : "",
      bullet7: form.bullet7 ? form.bullet7.value.trim() : "",
      image: imageURL,
      courses: [],
      links: []
    };

    // --- Collect course data (if present) ---
    var courseNodes = form.querySelectorAll("#courseList .course");
    for (var i = 0; i < courseNodes.length; i++) {
      var course = courseNodes[i];
      var deptField = course.querySelector("[name='department']");
      var numField = course.querySelector("[name='number']");
      var nameField = course.querySelector("[name='courseName']");
      var reasonField = course.querySelector("[name='reason']");
      formData.courses.push({
        department: deptField ? deptField.value.trim() : "",
        number: numField ? numField.value.trim() : "",
        name: nameField ? nameField.value.trim() : "",
        reason: reasonField ? reasonField.value.trim() : ""
      });
    }

    // --- Collect links ---
    var links = [];
    for (var j = 1; j <= 7; j++) {
      var linkField = form["link" + j];
      if (linkField && linkField.value.trim() !== "") {
        links.push(linkField.value.trim());
      }
    }
    formData.links = links;

    // --- Convert to JSON string ---
    var jsonText = JSON.stringify(formData, null, 2);

    // --- Replace form with formatted JSON display ---
    var jsonHTML =
      '<section id="introResult" style="text-align:center; margin-top:40px;">' +
      '<h2 style="font-family: Arial, sans-serif; color:#333;">Introduction JSON</h2>' +
      '<div style="display:flex; justify-content:center; margin-top:20px;">' +
      '<div style="background:#1e1e1e; color:#dcdcdc; text-align:left; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.3); padding:20px; max-width:800px; width:90%; overflow-x:auto;">' +
      '<pre style="margin:0;"><code class="language-json">' +
      jsonText.replace(/</g, "&lt;") +
      "</code></pre>" +
      "</div></div>" +
      '<div style="text-align:center; margin-top:25px;">' +
      '<button type="button" id="resetForm" style="padding:10px 20px; border:none; border-radius:6px; background-color:#007bff; color:white; cursor:pointer;">Start Over</button>' +
      "</div>" +
      "</section>";

    form.outerHTML = jsonHTML;

    // --- Highlight syntax if highlight.js is loaded ---
    if (window.hljs) {
      var codeBlocks = document.querySelectorAll("pre code");
      for (var k = 0; k < codeBlocks.length; k++) {
        window.hljs.highlightElement(codeBlocks[k]);
      }
    }

    // --- Reset button ---
    var resetBtn = document.getElementById("resetForm");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        location.reload();
      });
    }
  });
});
