
// API Structure:
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation,visibility,wind_speed_120m,uv_index
// sample response:
// {
//     "2024-11-08": {
//         "temperature_min": 4.4,
//         "temperature_max": 6,
//         "precipitation_min": 0,
//         "precipitation_max": 0,
//         "visibility_min": 9040,
//         "visibility_max": 32320,
//         "wind_speed_min": 11.5,
//         "wind_speed_max": 30.2,
//         "uv_index_min": 0,
//         "uv_index_max": 1.7
//     },
//     "2024-11-09": {
//         "temperature_min": 2,
//         "temperature_max": 7.5,
//         "precipitation_min": 0,
//         "precipitation_max": 0,
//         "visibility_min": 3300,
//         "visibility_max": 41120,
//         "wind_speed_min": 12.7,
//         "wind_speed_max": 27.1,
//         "uv_index_min": 0,
//         "uv_index_max": 1.7
//     },
//     "2024-11-10": {
//         "temperature_min": 0.7,
//         "temperature_max": 3.7,
//         "precipitation_min": 0,
//         "precipitation_max": 0,
//         "visibility_min": 80,
//         "visibility_max": 7580,
//         "wind_speed_min": 1.1,
//         "wind_speed_max": 22.5,
//         "uv_index_min": 0,
//         "uv_index_max": 1.7
//     },
//     "2024-11-11": {
//         "temperature_min": 3.5,
//         "temperature_max": 8.5,
//         "precipitation_min": 0,
//         "precipitation_max": 0.9,
//         "visibility_min": 1060,
//         "visibility_max": 25900,
//         "wind_speed_min": 1.3,
//         "wind_speed_max": 21.7,
//         "uv_index_min": 0,
//         "uv_index_max": 0.6
//     },
//     "2024-11-12": {
//         "temperature_min": 4.3,
//         "temperature_max": 6.9,
//         "precipitation_min": 0,
//         "precipitation_max": 0,
//         "visibility_min": 1240,
//         "visibility_max": 10420,
//         "wind_speed_min": 1.1,
//         "wind_speed_max": 19.1,
//         "uv_index_min": 0,
//         "uv_index_max": 1.6
//     },
//     "2024-11-13": {
//         "temperature_min": 2.1,
//         "temperature_max": 4.1,
//         "precipitation_min": 0,
//         "precipitation_max": 0.1,
//         "visibility_min": 3480,
//         "visibility_max": 24140,
//         "wind_speed_min": 7.1,
//         "wind_speed_max": 20.9,
//         "uv_index_min": 0,
//         "uv_index_max": 1.45
//     },
//     "2024-11-14": {
//         "temperature_min": 0.9,
//         "temperature_max": 4.6,
//         "precipitation_min": 0,
//         "precipitation_max": 0,
//         "visibility_min": 24140,
//         "visibility_max": 24140,
//         "wind_speed_min": 3.2,
//         "wind_speed_max": 15.5,
//         "uv_index_min": 0,
//         "uv_index_max": 0.3
//     }
// }

// sample request:
// http://localhost:3000/weather?latitude=52.52&longitude=13.41

const axios = require('axios');
// Controller function to get weather forecast
const getWeatherForecast = async (req, res) => {
    // Extract latitude and longitude from query parameters
    const { latitude, longitude } = req.query;

    // Check if latitude and longitude are provided
    if (!latitude || !longitude) {
        console.log("error requesting error information. No latitude or longitude parameters provided");
        return res.status(400).json({ error: 'Please provide latitude and longitude parameters' });
    }

    try {
        // Build the API URL with the given latitude and longitude
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,visibility,wind_speed_120m,uv_index`;

        // Make GET request to Open-Meteo API
        const response = await axios.get(apiUrl);

        // Get the data from response
        const data = response.data;

        // Process the data to calculate daily min and max
        const hourlyData = data.hourly;
        const times = hourlyData.time;
        const temperatures = hourlyData.temperature_2m;
        const precipitations = hourlyData.precipitation;
        const visibilities = hourlyData.visibility;
        const wind_speeds = hourlyData.wind_speed_120m;
        const uv_indices = hourlyData.uv_index;

        // Initialize an object to store daily data
        const dailyData = {};

        // Loop over the times and build daily data
        for (let i = 0; i < times.length; i++) {
            const time = times[i];
            const date = time.split('T')[0];  // Get date part

            // Initialize date entry if not exists
            if (!dailyData[date]) {
                dailyData[date] = {
                    temperatures: [],
                    precipitations: [],
                    visibilities: [],
                    wind_speeds: [],
                    uv_indices: []
                };
            }

            // Push data into the arrays, ensuring they are numbers
            dailyData[date].temperatures.push(Number(temperatures[i]));
            dailyData[date].precipitations.push(Number(precipitations[i]));
            dailyData[date].visibilities.push(Number(visibilities[i]));
            dailyData[date].wind_speeds.push(Number(wind_speeds[i]));
            dailyData[date].uv_indices.push(Number(uv_indices[i]));
        }

        // Now for each date, compute min and max
        const result = {};

        for (const date in dailyData) {
            const temps = dailyData[date].temperatures;
            const precs = dailyData[date].precipitations;
            const visibs = dailyData[date].visibilities;
            const winds = dailyData[date].wind_speeds;
            const uvs = dailyData[date].uv_indices;

            result[date] = {
                temperature_min: Math.min(...temps),
                temperature_max: Math.max(...temps),
                precipitation_min: Math.min(...precs),
                precipitation_max: Math.max(...precs),
                visibility_min: Math.min(...visibs),
                visibility_max: Math.max(...visibs),
                wind_speed_min: Math.min(...winds),
                wind_speed_max: Math.max(...winds),
                uv_index_min: Math.min(...uvs),
                uv_index_max: Math.max(...uvs)
            };
        }

        // Respond with the result
        res.json(result);
        console.log("successful requesting weather forecast");

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data from Open-Meteo API' });
        console.log("An error occurred while fetching data from Open-Meteo API");
    }
};

module.exports = { getWeatherForecast };
