document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');
    
    if (!listingId) {
        showError('No property selected. Please return to the listings page.');
        return;
    }

    document.getElementById('listing_id').value = listingId;
    
    loadPropertyDetails(listingId);
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check_in').min = today;
    document.getElementById('check_out').min = today;
});

async function loadPropertyDetails(listingId) {
    try {
        const response = await fetch(`/api/listings/${listingId}`);
        if (!response.ok) throw new Error('Failed to load property details');
        
        const property = await response.json();
        
        document.getElementById('propertyName').textContent = property.name;
        document.getElementById('propertySummary').textContent = property.summary;
        document.getElementById('propertyPrice').textContent = `$${property.price} USD`;
    } catch (error) {
        showError('Failed to load property details. Please try again later.');
        console.error('Error:', error);
    }
}

const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (bookingForm.checkValidity()) {
        try {
 
            const formData = {
                listing_id: document.getElementById('listing_id').value,
                check_in: document.getElementById('check_in').value,
                check_out: document.getElementById('check_out').value,
                guest_name: document.getElementById('guest_name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                mobile: document.getElementById('mobile').value,
                postal_address: document.getElementById('postal_address').value,
                residential_address: document.getElementById('residential_address').value
            };

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create booking');
            }

            const result = await response.json();
            window.location.href = `/confirmation?booking_id=${result.booking_id}`;
        } catch (error) {
            showError(error.message || 'Failed to create booking. Please try again.');
            console.error('Error:', error);
        }
    }

    bookingForm.classList.add('was-validated');
});

document.getElementById('check_in').addEventListener('change', function() {
    const checkOutInput = document.getElementById('check_out');
    checkOutInput.min = this.value;
    
    if (checkOutInput.value < this.value) {
        checkOutInput.value = this.value;
    }
});


function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}