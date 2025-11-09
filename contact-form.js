/**
 * Contact Form Handler for Web3Forms
 * Secure form submission with client-side validation
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    // Initialize form
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });
    }

    // Initialize form
    function initForm() {
        if (!contactForm) return;
        
        // Add event listeners
        contactForm.addEventListener('submit', handleSubmit);
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });
    }

// Validate input field
function validateInput(input) {
    const errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) return;
    
    if (input.validity.valid) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    } else {
        input.classList.add('error');
        errorElement.textContent = getErrorMessage(input);
        errorElement.style.display = 'block';
    }
}

// Get error message for invalid input
function getErrorMessage(input) {
    if (input.validity.valueMissing) {
        return 'This field is required';
    } else if (input.validity.typeMismatch) {
        if (input.type === 'email') {
            return 'Please enter a valid email address';
        }
    }
    return 'Please enter a valid value';
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (!input.validity.valid) {
            validateInput(input);
            isValid = false;
        }
    });
    
    return isValid;
}

    // Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm(contactForm)) {
        showStatus('Please fill in all required fields correctly', 'error');
        return false;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
        // Get form data
        const formData = new FormData(contactForm);
        
        // Add required fields
        const formDataObj = Object.fromEntries(formData.entries());
        formDataObj['access_key'] = '3109333e-1e16-4d4c-9149-cd591deea645';
        formDataObj['to_email'] = 'rahberislam53@gmail.com';
        
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formDataObj)
        });
        
        const result = await response.json();
        console.log('Form submission result:', result);
        
        if (result.success) {
            // Show success message
            showStatus('Your message has been sent successfully! I\'ll get back to you soon.', 'success');
            // Reset form
            contactForm.reset();
        } else {
            // Show error message
            console.error('Form submission error:', result);
            showStatus(`Failed to send message: ${result.message || 'Unknown error'}. Please try again later.`, 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showStatus('An error occurred. Please try again later or email me directly at new-email@example.com', 'error');
    } finally {
        // Reset loading state
        setLoading(false);
    }
    
    return false;
}

// Set loading state
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.classList.add('sending');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('sending');
        submitBtn.disabled = false;
    }
}

// Show status message
function showStatus(message, type = 'info') {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type} show`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formStatus.classList.remove('show');
    }, 5000);
}

});
