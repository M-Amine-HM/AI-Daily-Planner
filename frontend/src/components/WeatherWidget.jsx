import { useState } from "react";
import PropTypes from "prop-types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const WeatherWidget = ({ onWeatherLoaded, weather }) => {
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFetch = async () => {
        if (!city) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/api/weather?city=${encodeURIComponent(city)}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch weather");
            }
            const data = await response.json();
            onWeatherLoaded(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="weather">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Weather</p>
                    <h2>City forecast</h2>
                </div>
            </div>
            <div className="weather-input">
                <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Enter city"
                />
                <button className="primary" onClick={handleFetch} disabled={loading}>
                    {loading ? "Loading..." : "Get weather"}
                </button>
            </div>

            {weather ? (
                <div className="weather-card">
                    <p className="weather-city">{weather.city}</p>
                    <p className="weather-temp">{weather.temperature_c.toFixed(1)} C</p>
                    <p className="weather-desc">{weather.description}</p>
                </div>
            ) : (
                <p className="muted">Search for a city to see the forecast.</p>
            )}
        </div>
    );
};

WeatherWidget.propTypes = {
    onWeatherLoaded: PropTypes.func.isRequired,
    weather: PropTypes.object
};

export default WeatherWidget;
