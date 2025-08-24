const apiKey = 'dc04724f90b54744bd760407252408';
const locationInput = document.getElementById('locationInput');
const suggestionsList = document.getElementById('suggestions');

locationInput.addEventListener('input', async function() {
    const query = locationInput.value.trim();
    if (query.length < 2) {
        suggestionsList.style.display = 'none';
        return;
    }
    try {
        const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching suggestions');
        const data = await response.json();
        if (data.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }
        suggestionsList.innerHTML = '';
        data.forEach(loc => {
            const li = document.createElement('li');
            li.textContent = `${loc.name}, ${loc.region ? loc.region + ', ' : ''}${loc.country}`;
            li.addEventListener('mousedown', function(e) {
                locationInput.value = loc.name;
                suggestionsList.style.display = 'none';
            });
            suggestionsList.appendChild(li);
        });
        suggestionsList.style.display = 'block';
    } catch {
        suggestionsList.style.display = 'none';
    }
});

locationInput.addEventListener('blur', function() {
    setTimeout(() => { suggestionsList.style.display = 'none'; }, 100);
});

document.getElementById('weatherForm').addEventListener('submit', async function(e) {
    suggestionsList.style.display = 'none';
    e.preventDefault();
    const location = locationInput.value.trim();
    const resultDiv = document.getElementById('weatherResult');
    resultDiv.innerHTML = '<span style="color:#66a6ff;">Loading...</span>';

    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=yes`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        const temp = data.current.temp_c;
        const condition = data.current.condition.text;
        const icon = data.current.condition.icon;
        const feelslike = data.current.feelslike_c;
        const humidity = data.current.humidity;
        const wind = data.current.wind_kph;
        resultDiv.innerHTML = `
            <div style="display:flex;align-items:center;gap:16px;">
                <img src="${icon}" alt="${condition}" style="width:64px;height:64px;">
                <div>
                    <div style="font-size:1.2rem;font-weight:600;">${data.location.name}, ${data.location.country}</div>
                    <div style="font-size:2rem;font-weight:700;color:#66a6ff;">${temp}°C</div>
                    <div style="font-size:1.1rem;color:#4a5a6a;">${condition}</div>
                </div>
            </div>
            <div style="margin-top:10px;font-size:1rem;color:#2d3a4a;">
                <span>Feels like: <b>${feelslike}°C</b></span> &nbsp;|&nbsp;
                <span>Humidity: <b>${humidity}%</b></span> &nbsp;|&nbsp;
                <span>Wind: <b>${wind} kph</b></span>
            </div>
        `;
    } catch (err) {
        resultDiv.innerHTML = `<span style="color:#e74c3c;">Error: ${err.message}</span>`;
    }
});
