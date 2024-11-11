document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded');
    try {
        const testResponse = await fetch('/test');
        const testData = await testResponse.json();
        console.log('Database test:', testData);

        await loadFormData();
        await fetchListings();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize application: ' + error.message);
    }
});


function formatPrice(price) {
    console.log('Price input:', {
        value: price,
        type: typeof price,
        isObject: typeof price === 'object',
        keys: price ? Object.keys(price) : []
    });

    if (!price) {
        console.warn('Price is null or undefined');
        return '0.00';
    }

    try {
        if (typeof price === 'object') {
            const decimalValue = price.numberDecimal || price.$numberDecimal || price.value;
            
            if (decimalValue) {
                const parsedValue = parseFloat(decimalValue);
                console.log('Parsed decimal value:', parsedValue);
                if (!isNaN(parsedValue)) {
                    return parsedValue.toFixed(2);
                }
            }
        }

        if (typeof price === 'number') {
            return price.toFixed(2);
        }

        if (typeof price === 'string') {
            const parsedValue = parseFloat(price);
            if (!isNaN(parsedValue)) {
                return parsedValue.toFixed(2);
            }
        }

        console.warn('Could not parse price:', price);
        return '0.00';

    } catch (error) {
        console.error('Price formatting error:', error);
        return '0.00';
    }
}

function displayListings(listings) {
    const container = document.getElementById('propertyListings');
    container.innerHTML = '';

    if (!listings || listings.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No properties found. Try different search criteria.
                </div>
            </div>
        `;
        return;
    }

    listings.forEach(listing => {
        console.log('Listing price details:', {
            id: listing._id,
            price: listing.price,
            priceType: typeof listing.price,
            priceKeys: listing.price ? Object.keys(listing.price) : [],
            priceStringified: JSON.stringify(listing.price)
        });

        const formattedPrice = formatPrice(listing.price);
        console.log(`Formatted price for ${listing._id}:`, formattedPrice);

        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${listing.name || 'Unnamed Property'}</h5>
                    <p class="card-text">${listing.summary || 'No description available'}</p>
                    <p><strong>Price:</strong> $${formattedPrice}/night</p>
                    <p><strong>Type:</strong> ${listing.property_type || 'Not specified'}</p>
                    <p><strong>Bedrooms:</strong> ${listing.bedrooms || 'Not specified'}</p>
                    <p><strong>Location:</strong> ${listing.address?.market || 'Not specified'}</p>
                    <a href="/booking?id=${listing._id}" class="btn btn-primary">Book Now</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function debugPrice(price) {
    console.log('Price debug:', {
        value: price,
        type: typeof price,
        isObject: typeof price === 'object',
        keys: price ? Object.keys(price) : [],
        stringified: JSON.stringify(price),
        prototype: Object.getPrototypeOf(price),
        formatted: formatPrice(price)
    });
}

async function loadFormData() {
    try {
        const locationsResponse = await fetch('/api/locations');
        const locations = await locationsResponse.json();
        console.log('Locations loaded:', locations);
        
        const locationSelect = document.getElementById('location');
        locationSelect.innerHTML = '<option value="">Select Location</option>';
        locations.forEach(location => {
            if (location) {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            }
        });

        const typesResponse = await fetch('/api/property-types');
        const types = await typesResponse.json();
        console.log('Property types loaded:', types);
        
        const typeSelect = document.getElementById('propertyType');
        typeSelect.innerHTML = '<option value="">All Types</option>';
        types.forEach(type => {
            if (type) {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading form data:', error);
        showError('Failed to load form data: ' + error.message);
    }
}

async function fetchListings() {
    try {
        const location = document.getElementById('location').value;
        const propertyType = document.getElementById('propertyType').value;
        const bedrooms = document.getElementById('bedrooms').value;

        let url = '/api/listings';
        const params = new URLSearchParams();
        
        if (location) params.append('location', location);
        if (propertyType) params.append('propertyType', propertyType);
        if (bedrooms) params.append('bedrooms', bedrooms);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        console.log('Fetching listings from:', url);
        const response = await fetch(url);
        const listings = await response.json();
        console.log('Listings received:', listings);

        displayListings(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        showError('Failed to fetch listings: ' + error.message);
    }
}

function displayListings(listings) {
    const container = document.getElementById('propertyListings');
    container.innerHTML = '';

    if (!listings || listings.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No properties found. Try different search criteria.
                </div>
            </div>
        `;
        return;
    }

    listings.forEach(listing => {
        console.log(`Processing listing ${listing._id}:`, {
            name: listing.name,
            rawPrice: listing.price,
            priceType: typeof listing.price,
            formattedPrice: formatPrice(listing.price)
        });

        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${listing.name || 'Unnamed Property'}</h5>
                    <p class="card-text">${listing.summary || 'No description available'}</p>
                    <p><strong>Price:</strong> $${formatPrice(listing.price)}/night</p>
                    <p><strong>Type:</strong> ${listing.property_type || 'Not specified'}</p>
                    <p><strong>Bedrooms:</strong> ${listing.bedrooms || 'Not specified'}</p>
                    <p><strong>Location:</strong> ${listing.address?.market || 'Not specified'}</p>
                    <a href="/booking?id=${listing._id}" class="btn btn-primary">Book Now</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function debugListing(listingId) {
    try {
        const response = await fetch(`/api/listings/${listingId}`);
        const listing = await response.json();
        console.log('Debug listing data:', {
            id: listing._id,
            name: listing.name,
            rawPrice: listing.price,
            priceType: typeof listing.price,
            formattedPrice: formatPrice(listing.price)
        });
    } catch (error) {
        console.error('Debug error:', error);
    }
}

document.getElementById('filterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetchListings();
});

function showError(message) {
    const container = document.getElementById('propertyListings');
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
                ${message}
            </div>
        </div>
    `;
}