// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    if (sidebar && sidebar.classList.contains('active') && 
        !sidebar.contains(event.target) && 
        event.target !== menuToggle) {
      sidebar.classList.remove('active');
    }
  });
  
  // Copy script to clipboard functionality
  const copyButtons = document.querySelectorAll('.copy-script');
  if (copyButtons.length > 0) {
    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const scriptId = this.getAttribute('data-id');
        const scriptContent = document.getElementById(`script-content-${scriptId}`).textContent;
        
        navigator.clipboard.writeText(scriptContent).then(() => {
          // Show success message
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i> Copied!';
          
          setTimeout(() => {
            this.innerHTML = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  }
  
  // Copy referral link functionality
  const copyReferralBtn = document.getElementById('copy-referral-link');
  if (copyReferralBtn) {
    copyReferralBtn.addEventListener('click', function() {
      const referralLink = document.getElementById('referral-link').value;
      
      navigator.clipboard.writeText(referralLink).then(() => {
        // Show success message
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }
  
  // Delete script confirmation
  const deleteButtons = document.querySelectorAll('.delete-script');
  if (deleteButtons.length > 0) {
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const scriptId = this.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this script? This action cannot be undone.')) {
          // Send delete request
          fetch(`/scripts/${scriptId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              // Remove script from DOM
              const scriptElement = document.getElementById(`script-${scriptId}`);
              if (scriptElement) {
                scriptElement.remove();
              }
            } else {
              alert('Failed to delete script. Please try again.');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
          });
        }
      });
    });
  }
  
  // First-time user onboarding popup
  const showOnboarding = localStorage.getItem('scriptli_onboarding_shown') !== 'true';
  const onboardingPopup = document.getElementById('onboarding-popup');
  
  if (showOnboarding && onboardingPopup) {
    onboardingPopup.style.display = 'flex';
    
    const closeOnboarding = document.getElementById('close-onboarding');
    if (closeOnboarding) {
      closeOnboarding.addEventListener('click', function() {
        onboardingPopup.style.display = 'none';
        localStorage.setItem('scriptli_onboarding_shown', 'true');
      });
    }
    
    // Close when clicking outside the popup content
    onboardingPopup.addEventListener('click', function(e) {
      if (e.target === onboardingPopup) {
        onboardingPopup.style.display = 'none';
        localStorage.setItem('scriptli_onboarding_shown', 'true');
      }
    });
  }
  
  // Script generation form validation
  const scriptForm = document.getElementById('script-generator-form');
  if (scriptForm) {
    scriptForm.addEventListener('submit', function(e) {
      const productName = document.getElementById('productName').value;
      const highlights = document.getElementById('highlights').value;
      
      if (!productName || !highlights) {
        e.preventDefault();
        alert('Please fill in all required fields.');
      }
    });
  }
});
