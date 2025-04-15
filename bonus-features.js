// Email capture functionality
document.addEventListener('DOMContentLoaded', function() {
  // Email subscription form
  const emailForm = document.querySelector('.email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!email) {
        alert('Please enter a valid email address');
        return;
      }
      
      // Here you would typically send this to your backend or email service
      // For now, we'll just show a success message
      const formContainer = this.closest('.email-capture');
      formContainer.innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle"></i>
          <h3>Thank you for subscribing!</h3>
          <p>We'll keep you updated with the latest news and features.</p>
        </div>
      `;
      
      // You could also store this in localStorage to remember the user subscribed
      localStorage.setItem('scriptli_subscribed', 'true');
    });
  }
  
  // Refer-a-friend functionality
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
        alert('Failed to copy link. Please try again.');
      });
    });
  }
  
  // Social sharing functionality
  const shareButtons = document.querySelectorAll('.social-buttons a');
  if (shareButtons.length > 0) {
    shareButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Track share event (in a real app, you might send this to your analytics)
        const platform = this.classList.contains('btn-twitter') ? 'twitter' : 
                         this.classList.contains('btn-facebook') ? 'facebook' : 'email';
        
        console.log(`Shared on ${platform}`);
        
        // For email links, we don't need to do anything special
        if (platform !== 'email') {
          e.preventDefault();
          
          // Open share dialog in a popup window
          const url = this.getAttribute('href');
          window.open(url, 'share-dialog', 'width=600,height=400');
        }
      });
    });
  }
  
  // First-time user onboarding popup
  const showOnboarding = localStorage.getItem('scriptli_onboarding_shown') !== 'true';
  const onboardingPopup = document.getElementById('onboarding-popup');
  
  if (showOnboarding && onboardingPopup) {
    // Show the popup with a slight delay for better UX
    setTimeout(() => {
      onboardingPopup.style.display = 'flex';
    }, 1000);
    
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
});
