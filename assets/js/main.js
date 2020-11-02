let app = {

  // Configuration
  config: {
    body: document.querySelector('body'),
    navListItems: document.querySelectorAll('nav > ul > li'),
    navItems: document.querySelectorAll('nav > ul > li > a'),
    main: document.querySelector('main'),
    sectionAbout: document.querySelector('.profile'),
    sectionProjects: document.querySelector('.projects'),
    sectionEducation: document.querySelector('.education'),
    sectionContact: document.querySelector('.contact'),
    contactName: document.querySelector('.contact-name'),
    contactEmail: document.querySelector('.contact-email'),
    contactMsg: document.querySelector('.contact-msg'),
    contactSubmit: document.querySelector('.contact-submit'),
    contactReset: document.querySelector('.contact-reset'),
    contactStatus: document.querySelector('.contact-status'),
    reName: /^[a-zA-Z \-\']+$/,
    reEmail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    reMsg: /[A-Za-z0-9,-]/,
    isFormSubmitted: false,
    footer: document.querySelector('footer'),
    animationClasses: {
      animated: 'animated',
      active: 'active',
      zoomInDown: 'zoomInDown',
      zoomOutDown: 'zoomOutDown'
    },
    animateSectionTimer: null,
    clearStatus: null,
    reqStatus: ''
  },

  // Setting class '.active' on element
  setActiveClass: function(elGroup, el) {
    for (let i = 0; i < elGroup.length; i++)
      elGroup[i].classList.remove('active');

    el.parentNode.classList.add('active');
  },

  // Function is used for checking if, for example,
  // we click on About, and if we are already on About section
  // it will return true, else return false.
  isChosenSectionActive: function(chosenNavItem) {
    if (chosenNavItem.innerHTML == '<i class="fas fa-address-card"></i><span>Profile</span>'
      && app.config.sectionAbout.classList.contains('active'))
      return true;

    else if (chosenNavItem.innerHTML == '<i class="fas fa-chart-line"></i><span>Projects</span>'
      && app.config.sectionProjects.classList.contains('active'))
      return true;

    else if (chosenNavItem.innerHTML == '<i class="fas fa-graduation-cap"></i><span>Education</span>'
      && app.config.sectionEducation.classList.contains('active'))
      return true;

    else if (chosenNavItem.innerHTML == '<i class="fas fa-coffee"></i><span>Contact</span>'
      && app.config.sectionContact.classList.contains('active'))
      return true;

    else
      return false;
  },

  // Function is used to determine which section we want to show up,
  // Example: If we click on Project, function returns 'section.projects' element
  getChosenSection: function(chosenNavItem) {
    let chosenSection;

    switch (chosenNavItem.innerHTML) {
      case '<i class="fas fa-address-card"></i><span>Profile</span>':
        chosenSection = app.config.sectionAbout;
        break;

      case '<i class="fas fa-chart-line"></i><span>Projects</span>':
        chosenSection = app.config.sectionProjects;
        break;

      case '<i class="fas fa-graduation-cap"></i><span>Education</span>':
        chosenSection = app.config.sectionEducation;
        break;

      case '<i class="fas fa-coffee"></i><span>Contact</span>':
        chosenSection = app.config.sectionContact;
        break;
    }

    return chosenSection;
  },

  // Function is applying animations for sections.
  // It will animate out something with animation that we choose,
  // then, it will wait the delay that we choose,
  // lastly, it will fade in another section.
  // We pass sections as arguments.
  outAndIn: function(activeSection, chosenSection, outAnimation, inAnimation, delay, elGroup, el) {
    activeSection.classList.add(
      app.config.animationClasses.animated,
      outAnimation
    );

    clearTimeout(app.config.animateSectionTimer);

    app.config.animateSectionTimer = setTimeout(function() {
      activeSection.classList.remove(
        app.config.animationClasses.active,
        app.config.animationClasses.animated,
        outAnimation,
        inAnimation
      );

      chosenSection.classList.add(
        app.config.animationClasses.active,
        app.config.animationClasses.animated,
        inAnimation
      );

      app.setActiveClass(elGroup, el);
      app.adaptHeight();

    }, delay);

    app.config.animateSectionTimer;
  },

  // Combines functions that are needed for animating sections, and animating them.
  animateSection: function(chosenNavItem, activeSection, chosenSection, elGroup, el) {
    if (app.isChosenSectionActive(chosenNavItem)) return;

    app.outAndIn(
      activeSection,
      chosenSection,
      app.config.animationClasses.zoomOutDown,
      app.config.animationClasses.zoomInDown,
      500,
      elGroup,
      el
    );
  },

  // Adding event listener on click to nav items,
  // does all logic to change one section.
  changeSection: function() {
    for (let i = 0; i < app.config.navItems.length; i++) {
      app.config.navItems[i].onclick = function(evt) {
        evt.preventDefault();
        let activeSection = document.querySelector('section.active'),
            chosenSection = app.getChosenSection(this);
        app.animateSection(this, activeSection, chosenSection, app.config.navListItems, this);
        app.setActiveClass(app.config.navListItems, this);
      };
    }
  },

  // Returns height of all absolute elements in one section
  getAbsoluteElementsHeight: function() {
    let activeSection = document.querySelector('section.active'),
        absoluteElementsHeight;

    if (activeSection.classList.contains('about')) {
      absoluteElementsHeight = 45;
    } else {
      absoluteElementsHeight = 40;
    }

    return absoluteElementsHeight;
  },

  // Function is used to adapt height of the main (container),
  // after we change section,
  // to height of 'new shown' section
  adaptHeight: function() {
    let activeSection = document.querySelector('section.active'),
        activeSectionHeight = activeSection.offsetHeight,
        footerHeight = app.config.footer.offsetHeight,
        finalHeight;

    if (window.innerWidth > 768)
      finalHeight = activeSectionHeight + footerHeight + app.getAbsoluteElementsHeight() + 'px';
    else
      finalHeight = activeSectionHeight + footerHeight + 'px';

    app.config.main.style.height = finalHeight;
  },

  adaptHeightOnLoad: function() {
    app.config.body.onload = function() { app.adaptHeight(); }
  },

  validateInput: function(input, reInput, name, errs, data) {
    if (!input.value) {
      input.classList.add('red-shadow');
      errs.push('<li>' + name + ' must not be empty.</li>');
    }
    else if (!reInput.test(input.value)) {
      input.classList.add('red-shadow');
      errs.push('<li>' + name + ' format not valid.</li>');
    }
    else
      data[name.toLowerCase()] = input.value;
  },

  stopIfFormSubmitted: function(contactStatusHTML) {
    contactStatusHTML = '<li>Form is already submitted.</li>';
    app.config.contactStatus.innerHTML = contactStatusHTML;
    app.config.contactStatus.classList.remove('success');
    app.config.contactStatus.classList.add('error');
    window.dispatchEvent(new Event('resize'));
  },

  getInputErrors: function(errs) {
    let status = '';
    errs.forEach(function(err) {
      status += err;
    });
    return status;
  },

  setContactStatusCSS: function(status) {
    if (status) {
      app.config.contactStatus.classList.remove('error');
      app.config.contactStatus.classList.add('success');
    } else {
      app.config.contactStatus.classList.remove('success');
      app.config.contactStatus.classList.add('error');
    }
  },

  sendRequest: function(data) {
    let req = new XMLHttpRequest();
    req.open('POST', 'https://www.nristanovic.com/mailer.php');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        app.config.isFormSubmitted = true;
        app.config.reqStatus = app.returnStatus();
      }
    }
    req.send(JSON.stringify(data));
  },

  returnStatus: function() {
    let status = '';
    if (app.config.isFormSubmitted) {
      app.setContactStatusCSS(app.config.isFormSubmitted);
      status = 'Message sent successfully!';
    }
    else {
      app.setContactStatusCSS(app.config.isFormSubmitted);
      status = 'Sorry. Something went wrong. Please refresh the page and try again.';
    }
    return status;
  },

  clearStatus: function() {
    app.config.contactStatus.classList.remove('success', 'error');
    app.config.contactStatus.innerHTML = '';
    app.clearInputShadow(app.config.contactName);
    app.clearInputShadow(app.config.contactEmail);
    app.clearInputShadow(app.config.contactMsg);
    window.dispatchEvent(new Event('resize'));
  },

  clearStatusTimer: function(delay) {
    clearTimeout(app.config.clearStatus);
    app.config.clearStatus = setTimeout(function() {
      app.clearStatus();
    }, delay);
    app.config.clearStatus;
  },

  submitContactForm: function() {
    app.config.contactSubmit.onclick = function() {
      let errors = [],
          data = {},
          contactStatusHTML = '';

      if (app.config.isFormSubmitted) {
        app.stopIfFormSubmitted(contactStatusHTML)
        return;
      }

      app.validateInput(app.config.contactName, app.config.reName, 'Name', errors, data);
      app.validateInput(app.config.contactEmail, app.config.reEmail, 'Email', errors, data);
      app.validateInput(app.config.contactMsg, app.config.reMsg, 'Message', errors, data);

      if (errors.length != 0) {
        contactStatusHTML = app.getInputErrors(errors);
        app.setContactStatusCSS(app.config.isFormSubmitted);
      } else {
        app.sendRequest(data);
        contactStatusHTML = 'Loading... Please wait.';
        setTimeout(function() {
          app.config.contactStatus.innerHTML = app.config.reqStatus;
          window.dispatchEvent(new Event('resize'));
        }, 2000);
      }

      app.config.contactStatus.innerHTML = contactStatusHTML;
      app.clearStatusTimer(20000);
      window.dispatchEvent(new Event('resize'));
    }
  },

  resetContactForm: function() {
    app.config.contactReset.onclick = function() {
      app.config.isFormSubmitted = false;
      app.config.contactName.value = '';
      app.config.contactEmail.value = '';
      app.config.contactMsg.value = '';
      app.clearStatus();
    }
  },

  clearInputShadow: function(input) {
    input.classList.remove('red-shadow');
  },

  clearInputShadowOnKeyUp: function(input, regex) {
    input.onkeyup = function() {
      if (regex.test(input.value))
        app.clearInputShadow(input);
    }
  },

  // Initialized on main.js load
  init: function() {
    app.adaptHeightOnLoad();
    window.onresize = function() { app.adaptHeight(); };
    app.changeSection();
    window.dispatchEvent(new Event('resize'));
    app.submitContactForm();
    app.resetContactForm();
    app.clearInputShadowOnKeyUp(app.config.contactName, app.config.reName);
    app.clearInputShadowOnKeyUp(app.config.contactEmail, app.config.reEmail);
    app.clearInputShadowOnKeyUp(app.config.contactMsg, app.config.reMsg);
    $('a.project-image').featherlightGallery({
      previousIcon: '«',
      nextIcon: '»',
      galleryFadeIn: 300,
      openSpeed: 300
    });
  }

};

app.init();
