document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Interest options
    const interestOptions = [
        'Adventure', 'Beaches', 'Culture', 'Food', 'History',
        'Nature', 'Nightlife', 'Shopping', 'Relaxation', 'Sports'
    ];

    // Initialize interest buttons
    const interestsContainer = document.getElementById('interestsContainer');
    interestOptions.forEach(interest => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'interest-btn py-1 px-2 border border-gray-300 rounded-md text-sm';
        btn.textContent = interest;
        btn.dataset.value = interest.toLowerCase();
        btn.addEventListener('click', function() {
            this.classList.toggle('selected');
            // Limit to 3 selections
            const selected = document.querySelectorAll('.interest-btn.selected');
            if (selected.length > 3) {
                this.classList.remove('selected');
            }
        });
        interestsContainer.appendChild(btn);
    });

    // Form submission
    const travelForm = document.getElementById('travelForm');
    const generateBtn = document.getElementById('generateBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const itineraryContainer = document.getElementById('itineraryContainer');

    travelForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            destination: document.getElementById('destination').value,
            travelDates: {
                start: document.getElementById('startDate').value,
                end: document.getElementById('endDate').value
            },
            travelers: document.getElementById('travelers').value,
            budget: document.querySelector('input[name="budget"]:checked').value,
            travelStyle: document.querySelector('input[name="travelStyle"]:checked').value,
            interests: Array.from(document.querySelectorAll('.interest-btn.selected')).map(btn => btn.dataset.value),
            specialRequirements: document.getElementById('specialRequirements').value
        };

        // Validate
        if (!formData.destination) {
            showError('Please enter a destination');
            return;
        }

        // Show loading
        generateBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        // Simulate API call (in a real app, you would call your backend here)
        setTimeout(() => {
            try {
                const itinerary = generateMockItinerary(formData);
                displayItinerary(itinerary);
            } catch (error) {
                showError('Failed to generate itinerary. Please try again.');
                console.error(error);
            } finally {
                generateBtn.disabled = false;
                loadingSpinner.classList.add('hidden');
            }
        }, 1500);
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        generateBtn.disabled = false;
        loadingSpinner.classList.add('hidden');
    }

    function generateMockItinerary(formData) {
        // This is mock data - in a real app, you would get this from your AI backend
        const days = Math.ceil((new Date(formData.travelDates.end) - new Date(formData.travelDates.start)) / (1000 * 60 * 60 * 24)) || 3;
        
        const activitiesPool = {
            adventure: ['Hiking tour', 'Whitewater rafting', 'Zip-lining adventure', 'Rock climbing'],
            beaches: ['Beach relaxation', 'Snorkeling excursion', 'Sunset cruise', 'Beach volleyball'],
            culture: ['Museum visit', 'Local festival', 'Historical walking tour', 'Traditional craft workshop'],
            food: ['Food market tour', 'Cooking class', 'Wine tasting', 'Fine dining experience'],
            history: ['Ancient ruins visit', 'Castle tour', 'Historical reenactment', 'Guided city history walk'],
            nature: ['National park visit', 'Wildlife safari', 'Bird watching', 'Botanical gardens'],
            nightlife: ['Jazz club', 'Rooftop bar', 'Night market', 'Local music venue'],
            shopping: ['Boutique shopping', 'Local artisan market', 'Antique stores', 'Mall visit'],
            relaxation: ['Spa day', 'Yoga session', 'Meditation retreat', 'Leisurely cafe hopping'],
            sports: ['Local game tickets', 'Golf outing', 'Tennis match', 'Surfing lesson']
        };

        // Select activities based on interests
        let selectedActivities = [];
        if (formData.interests.length > 0) {
            formData.interests.forEach(interest => {
                if (activitiesPool[interest]) {
                    selectedActivities = selectedActivities.concat(activitiesPool[interest]);
                }
            });
        } else {
            // Default activities if no interests selected
            selectedActivities = selectedActivities.concat(
                activitiesPool.culture,
                activitiesPool.food,
                activitiesPool.nature
            );
        }

        // Generate itinerary days
        const itinerary = {
            destination: formData.destination,
            summary: `A ${days}-day ${formData.travelStyle} trip to ${formData.destination} for ${formData.travelers} ${formData.travelers > 1 ? 'people' : 'person'}`,
            days: []
        };

        for (let i = 1; i <= days; i++) {
            const dayActivities = [];
            const numActivities = formData.travelStyle === 'fast' ? 4 : formData.travelStyle === 'relaxed' ? 2 : 3;
            
            for (let j = 0; j < numActivities; j++) {
                const randomIndex = Math.floor(Math.random() * selectedActivities.length);
                dayActivities.push({
                    time: j === 0 ? 'Morning' : j === 1 ? 'Afternoon' : 'Evening',
                    activity: selectedActivities[randomIndex],
                    description: `Enjoy this ${formData.budget} ${selectedActivities[randomIndex].toLowerCase()} experience.`,
                    location: `${formData.destination} city center`,
                    duration: '2-3 hours'
                });
            }

            itinerary.days.push({
                day: i,
                date: new Date(new Date(formData.travelDates.start).getTime() + (i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                activities: dayActivities
            });
        }

        return itinerary;
    }

    function displayItinerary(itinerary) {
        let html = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="bg-indigo-600 text-white p-6">
                    <h2 class="text-2xl font-bold">${itinerary.summary}</h2>
                    <p class="mt-2">${itinerary.days.length} days in ${itinerary.destination}</p>
                </div>
                <div class="p-6 space-y-8">
        `;

        itinerary.days.forEach(day => {
            html += `
                <div class="itinerary-day border border-gray-200 rounded-lg overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 class="font-semibold text-lg">Day ${day.day} - ${day.date}</h3>
                    </div>
                    <div class="divide-y divide-gray-200">
            `;

            day.activities.forEach(activity => {
                html += `
                        <div class="activity-item p-4 hover:bg-gray-50">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                                    <i class="fas fa-${getActivityIcon(activity.activity)}"></i>
                                </div>
                                <div>
                                    <h4 class="font-medium">${activity.time}: ${activity.activity}</h4>
                                    <p class="text-gray-600 mt-1">${activity.description}</p>
                                    <div class="flex items-center mt-2 text-sm text-gray-500">
                                        <i class="fas fa-map-marker-alt mr-1"></i>
                                        <span class="mr-4">${activity.location}</span>
                                        <i class="fas fa-clock mr-1"></i>
                                        <span>${activity.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <button id="saveItineraryBtn" class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                        <i class="fas fa-save mr-2"></i> Save Itinerary
                    </button>
                </div>
            </div>
        `;

        itineraryContainer.innerHTML = html;

        // Add event listener for save button
        document.getElementById('saveItineraryBtn')?.addEventListener('click', function() {
            alert('Itinerary saved! (This is a demo - in a real app, this would save to your account)');
        });
    }

    function getActivityIcon(activity) {
        if (activity.includes('tour') || activity.includes('walk')) return 'walking';
        if (activity.includes('food') || activity.includes('dining')) return 'utensils';
        if (activity.includes('beach') || activity.includes('cruise')) return 'umbrella-beach';
        if (activity.includes('museum') || activity.includes('historical')) return 'landmark';
        if (activity.includes('shopping')) return 'shopping-bag';
        if (activity.includes('spa') || activity.includes('yoga')) return 'spa';
        if (activity.includes('bar') || activity.includes('club')) return 'glass-cheers';
        return 'map-marked-alt';
    }
});