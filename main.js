// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  // Email form submission
  const emailForm = document.querySelector('.email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value;
      
      if (email) {
        // Here you would typically send this to your backend
        // For now, we'll just show a success message
        emailInput.value = '';
        alert('Thank you for subscribing!');
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('h3');
      const answer = item.querySelector('p');
      
      // Initially hide answers (optional)
      // answer.style.display = 'none';
      
      question.addEventListener('click', function() {
        // Toggle answer visibility
        // answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
        
        // Alternative: add/remove active class for styling
        item.classList.toggle('active');
      });
    });
  }
});
