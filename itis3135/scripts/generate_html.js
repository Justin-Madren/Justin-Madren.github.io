// generate_html.js
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("introForm");
  if (!form) return;

  // Helper to escape HTML for code display (defined before use)
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Create and add the "Generate HTML" button (place to the right of JSON button if present)
  var htmlButton = document.createElement("button");
  htmlButton.type = "button";
  htmlButton.id = "generateHTML";
  htmlButton.textContent = "Generate HTML";
  htmlButton.style.marginLeft = "10px";

  var jsonBtn = document.getElementById("generateJSON");
  if (jsonBtn && jsonBtn.parentNode) {
    // insert after the JSON button
    jsonBtn.parentNode.insertBefore(htmlButton, jsonBtn.nextSibling);
  } else {
    // fallback: append to end of form controls
    form.appendChild(htmlButton);
  }

  // Handle button click
  htmlButton.addEventListener("click", function () {
    // Collect form values (guard each one in case field missing)
    var firstName = form.firstName ? form.firstName.value.trim() : "";
    var middleName = form.middleName ? form.middleName.value.trim() : "";
    var lastName = form.lastName ? form.lastName.value.trim() : "";
    var nickName = form.nickName ? form.nickName.value.trim() : "";

    // Image handling: use uploaded file preview if available, else default dataset or fallback path
    var pictureInput = form.picture;
    var imageURL = "images/HeadShot2024.jpg";
    if (pictureInput) {
      if (pictureInput.files && pictureInput.files[0]) {
        // Use object URL so image displays in result HTML
        imageURL = URL.createObjectURL(pictureInput.files[0]);
      } else if (pictureInput.getAttribute("data-default-image")) {
        imageURL = pictureInput.getAttribute("data-default-image");
      } else if (pictureInput.dataset && pictureInput.dataset.defaultImage) {
        imageURL = pictureInput.dataset.defaultImage;
      }
    }

    var caption = form.caption ? form.caption.value.trim() : "";
    var personalStatement = form.personalStatment ? form.personalStatment.value.trim() : "";
    var bullet1 = form.bullet1 ? form.bullet1.value.trim() : "";
    var bullet2 = form.bullet2 ? form.bullet2.value.trim() : "";
    var bullet3 = form.bullet3 ? form.bullet3.value.trim() : "";
    var bullet4 = form.bullet4 ? form.bullet4.value.trim() : "";
    var bullet6 = form.bullet6 ? form.bullet6.value.trim() : "";
    var bullet7 = form.bullet7 ? form.bullet7.value.trim() : "";

    // Courses -> build list items
    var courseNodes = form.querySelectorAll("#courseList .course");
    var coursesHTML = "";
    for (var i = 0; i < courseNodes.length; i++) {
      var c = courseNodes[i];
      var dept = c.querySelector("[name='department']");
      var num = c.querySelector("[name='number']");
      var nm = c.querySelector("[name='courseName']");
      var reason = c.querySelector("[name='reason']");
      coursesHTML +=
        "<li>" +
        (dept ? dept.value.trim() : "") +
        " " +
        (num ? num.value.trim() : "") +
        " - " +
        (nm ? nm.value.trim() : "") +
        ": " +
        (reason ? reason.value.trim() : "") +
        "</li>";
    }

    // Links
    var linksArray = [];
    for (var j = 1; j <= 7; j++) {
      var linkField = form["link" + j];
      if (linkField && linkField.value && linkField.value.trim() !== "") {
        linksArray.push(linkField.value.trim());
      }
    }
    var linksHTML = "";
    if (linksArray.length) {
      var linkPieces = [];
      for (var L = 0; L < linksArray.length; L++) {
        linkPieces.push('<a href="' + linksArray[L] + '" target="_blank">|| ' + linksArray[L] + ' ||</a>');
      }
      linksHTML = linkPieces.join(" ");
    }

    // Build the HTML literal (this is the *HTML code* we want to show as text)
    var htmlContent =
      '<h2>Introduction HTML</h2>\n' +
      '<h3>' +
      escapeHTML(lastName) +
      (firstName ? " " + escapeHTML(firstName) : "") +
      (middleName ? " " + escapeHTML(middleName) : "") +
      (nickName ? ' ("' + escapeHTML(nickName) + '")' : "") +
      "</h3>\n" +
      '<figure>\n' +
      '  <img src="' +
      escapeHTML(imageURL) +
      '" alt="' +
      escapeHTML(caption || ("Headshot of " + firstName + " " + lastName)) +
      '" />\n' +
      (caption ? "  <figcaption>" + escapeHTML(caption) + "</figcaption>\n" : "") +
      "</figure>\n" +
      "<ul>\n" +
      "  <li><strong>Personal Background:</strong> " +
      escapeHTML(bullet1) +
      "</li>\n" +
      "  <li><strong>Academic Background:</strong> " +
      escapeHTML(bullet2) +
      "</li>\n" +
      "  <li><strong>Professional Background:</strong> " +
      escapeHTML(bullet3) +
      "</li>\n" +
      "  <li><strong>Primary Computer:</strong> " +
      escapeHTML(bullet4) +
      "</li>\n" +
      "  <li><strong>Courses I’m Taking and Why:</strong>\n    <ul>\n" +
      coursesHTML +
      "    </ul>\n  </li>\n" +
      "  <li><strong>Favorite Quote:</strong> “" +
      escapeHTML(bullet6) +
      "” — " +
      escapeHTML(bullet7) +
      "</li>\n" +
      "</ul>\n" +
      (linksHTML ? '<p class="links">' + linksHTML + "</p>\n" : "");

    // Create the formatted code block (centered box similar to your JSON output)
    var formattedHTML =
      '<section style="text-align:center; margin-top:40px;">' +
      '<h2 style="font-family: Arial, sans-serif; color:#333;">Introduction HTML</h2>' +
      '<div style="display:flex; justify-content:center; margin-top:20px;">' +
      '<div style="background:#f4f4f4; color:#111; text-align:left; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.08); padding:20px; max-width:900px; width:90%; overflow-x:auto;">' +
      '<pre style="margin:0;"><code class="language-html">' +
      escapeHTML(htmlContent) +
      "</code></pre>" +
      "</div></div>" +
      '<div style="text-align:center; margin-top:25px;">' +
      '<button type="button" id="resetForm" style="padding:10px 20px; border:none; border-radius:6px; background-color:#007bff; color:white; cursor:pointer;">Start Over</button>' +
      "</div>" +
      "</section>";

    // Replace the form with the generated block
    form.outerHTML = formattedHTML;

    // Trigger syntax highlighting if Highlight.js is present
    if (window.hljs && typeof window.hljs.highlightAll === "function") {
      window.hljs.highlightAll();
    } else if (window.hljs && typeof window.hljs.highlightElement === "function") {
      var codeBlocks = document.querySelectorAll("pre code");
      for (var m = 0; m < codeBlocks.length; m++) {
        window.hljs.highlightElement(codeBlocks[m]);
      }
    }

    // Attach reset behavior
    var resetBtn = document.getElementById("resetForm");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        location.reload();
      });
    }
  });
});
