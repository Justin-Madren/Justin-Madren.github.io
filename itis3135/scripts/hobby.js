function showSection(id) {
    /*
    The ccs the is needed to make the script
    to work.
       section {
        display: none;
        }
      .active {
        display: block;
        }
     */
    // Hides all the section on the webpage
      document.querySelectorAll('section').forEach((sec) => sec.classList.remove('active'));
    // activates the section element that the user clicked 
      document.getElementById(id).classList.add('active');
    }