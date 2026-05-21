// Airline selector
function selAir(btn) {
  var buttons = document.querySelectorAll('button[onclick="selAir(this)"]');
  buttons.forEach(function(b) {
    b.style.backgroundColor = 'white';
    b.style.color = '#333';
    b.style.border = '1.5px solid #E8E0D8';
  });
  btn.style.backgroundColor = '#FF8C00';
  btn.style.color = 'white';
  btn.style.border = '1.5px solid #FF8C00';
}

// Bottom navigation
function showSection(section) {
  var sections = ['home', 'register', 'orgs', 'reviews', 'foster'];
  sections.forEach(function(s) {
    document.getElementById('section-' + s).style.display = 'none';
  });
  document.getElementById('section-' + section).style.display = 'block';

  var navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(function(item) {
    item.classList.remove('active');
  });
  document.getElementById('nav-' + section).classList.add('active');
}