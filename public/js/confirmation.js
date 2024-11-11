document.addEventListener('DOMContentLoaded', async () => {
    showLoading();
    
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking_id');

    if (!bookingId) {
        showError('Booking reference not found.');
        return;
    }

    try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load booking details');
        }
        
        const booking = await response.json();
        
         const checkInDate = new Date(booking.check_in).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const checkOutDate = new Date(booking.check_out).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('bookingId').textContent = booking._id;
        document.getElementById('propertyName').textContent = booking.property_name;
        document.getElementById('checkInDate').textContent = checkInDate;
        document.getElementById('checkOutDate').textContent = checkOutDate;
        document.getElementById('guestName').textContent = booking.guest_name;
        document.getElementById('guestEmail').textContent = booking.email;

        if (booking.phone) document.getElementById('phoneNumber')?.textContent = booking.phone;
        if (booking.mobile) document.getElementById('mobileNumber')?.textContent = booking.mobile;
        if (booking.postal_address) document.getElementById('postalAddress')?.textContent = booking.postal_address;
        if (booking.residential_address) document.getElementById('residentialAddress')?.textContent = booking.residential_address;

    } catch (error) {
        showError(`Failed to load booking details. Please keep your booking reference number: ${bookingId}`);
        console.error('Error:', error);
    }
});

function showLoading() {
    const confirmationCard = document.querySelector('.confirmation-card');
    confirmationCard.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-3">Loading booking details...</p>
        </div>
    `;
}

function showError(message) {
    const confirmationCard = document.querySelector('.confirmation-card');
    confirmationCard.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Error</h4>
            <p>${message}</p>
            <hr>
            <p class="mb-0">
                <a href="/" class="btn btn-primary">Return to Homepage</a>
            </p>
        </div>
    `;
}

document.querySelector('button[onclick="window.print()"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.print();
});