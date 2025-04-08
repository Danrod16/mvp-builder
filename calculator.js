document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const nextBtn1 = document.getElementById('next-step-1');
  const nextBtn2 = document.getElementById('next-step-2');
  const backBtn1 = document.getElementById('back-step-1');
  const backBtn2 = document.getElementById('back-step-2');
  const submitBtn = document.getElementById('submit-form');
  const progressBar = document.getElementById('form-progress');
  const stepIndicator = document.getElementById('step-indicator');
  const selectedAppType = document.getElementById('selected-app-type');
  const totalPrice = document.getElementById('total-price');
  const finalPrice = document.getElementById('final-price');
  const selectedCount = document.getElementById('selected-count');
  const appTypeOptions = document.querySelectorAll('.app-type-option');
  const featureCheckboxes = document.querySelectorAll('.feature');
  
  // Initialize the calculator
  function initCalculator() {
    // Handle app type selection styling
    appTypeOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove selected class from all options
        appTypeOptions.forEach(opt => opt.classList.remove('border-primary', 'bg-primary/5'));
        
        // Add selected class to clicked option
        this.classList.add('border-primary', 'bg-primary/5');
        
        // Check the radio input
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
      });
    });
    
    // Navigation - Step 1 to Step 2
    if (nextBtn1) {
      nextBtn1.addEventListener('click', function() {
        const selectedType = document.querySelector('input[name="appType"]:checked');
        
        if (selectedType) {
          // Show selected app type in step 2
          selectedAppType.textContent = selectedType.value + " app";
          
          // Hide step 1, show step 2
          step1.classList.add('hidden');
          step2.classList.remove('hidden');
          
          // Update progress
          progressBar.value = 66;
          stepIndicator.textContent = "Step 2 of 3: Select Features";
        } else {
          alert("Please select an app type to continue");
        }
      });
    }
    
    // Navigation - Step 2 to Step 1
    if (backBtn1) {
      backBtn1.addEventListener('click', function() {
        // Hide step 2, show step 1
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        
        // Update progress
        progressBar.value = 33;
        stepIndicator.textContent = "Step 1 of 3: Select Your App Type";
      });
    }
    
    // Navigation - Step 2 to Step 3
    if (nextBtn2) {
      nextBtn2.addEventListener('click', function() {
        // Hide step 2, show step 3
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        
        // Update progress
        progressBar.value = 100;
        stepIndicator.textContent = "Step 3 of 3: Your Information";
        
        // Copy price to final price display
        if (finalPrice && totalPrice) {
          finalPrice.textContent = totalPrice.textContent;
        }
      });
    }
    
    // Navigation - Step 3 to Step 2
    if (backBtn2) {
      backBtn2.addEventListener('click', function() {
        // Hide step 3, show step 2
        step3.classList.add('hidden');
        step2.classList.remove('hidden');
        
        // Update progress
        progressBar.value = 66;
        stepIndicator.textContent = "Step 2 of 3: Select Features";
      });
    }
    
    // Form submission
    if (submitBtn) {
      submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const source = document.getElementById('contact-source').value;
        
        // Validate form
        if (!name || !email || !source) {
          alert('Please fill in all required fields');
          return;
        }
        
        // Get selected app type
        const appType = document.querySelector('input[name="appType"]:checked').value;
        
        // Get selected features
        const selectedFeatures = Array.from(featureCheckboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value);
        
        // Calculate total price
        const price = calculateTotalPrice();
        
        // Prepare data for submission
        const formData = {
          name,
          email,
          source,
          comments: document.getElementById('contact-comments').value,
          appType,
          features: selectedFeatures,
          price
        };
        
        // TODO: Send data to server (replace with your actual form submission code)
        console.log('Form data:', formData);
        
        // Show success message
        alert('Thank you! Your request has been submitted. We will contact you shortly.');
        
        // Optional: Redirect to thank you page or clear form
        // window.location.href = '/thank-you.html';
      });
    }
    
    // Calculate price when features are selected
    featureCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updatePrice);
    });
  }
  
  // Update price based on selected features
  function updatePrice() {
    const total = calculateTotalPrice();
    let count = 0;
    
    featureCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        count++;
      }
    });
    
    if (totalPrice) totalPrice.textContent = '$' + total;
    if (selectedCount) selectedCount.textContent = count;
  }
  
  // Calculate total price
  function calculateTotalPrice() {
    let total = 0;
    
    featureCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        total += parseInt(checkbox.dataset.price);
      }
    });
    
    return total;
  }
  
  // Initialize calculator when DOM is loaded
  initCalculator();
});
  