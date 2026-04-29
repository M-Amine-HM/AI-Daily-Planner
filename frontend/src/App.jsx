import { useEffect, useMemo, useState } from "react";
import Calendar from "./components/Calendar.jsx";
import PlanModal from "./components/PlanModal.jsx";
import WeatherWidget from "./components/WeatherWidget.jsx";
import AiPanel from "./components/AiPanel.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const App = () => {
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
    const [plansByDate, setPlansByDate] = useState({});
    const [weather, setWeather] = useState(null);
    const [aiResponse, setAiResponse] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingAi, setLoadingAi] = useState(false);

    const selectedPlans = useMemo(
        () => plansByDate[selectedDate] || [],
        [plansByDate, selectedDate]
    );

    const fetchPlans = async (date) => {
        const response = await fetch(`${API_BASE}/api/plans/${date}`);
        if (!response.ok) {
            throw new Error("Failed to load plans");
        }
        const data = await response.json();
        setPlansByDate((prev) => ({ ...prev, [date]: data.plans }));
        return data.plans;
    };

    const handleSelectDate = async (date) => {
        setSelectedDate(date);
        setModalOpen(true);
        try {
            await fetchPlans(date);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreatePlan = async (date, plan) => {
        const response = await fetch(`${API_BASE}/api/plans/${date}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(plan)
        });
        if (!response.ok) {
            throw new Error("Failed to create plan");
        }
        await fetchPlans(date);
    };

    const handleWeatherLoaded = (data) => {
        setWeather(data);
    };

    const buildTranscript = (history) => {
        if (history.length === 0) {
            return "- None";
        }
        return history
            .map((entry) => `${entry.role.toUpperCase()}: ${entry.text}`)
            .join("\n");
    };

    const requestAnalysis = async (history) => {
        if (!weather) {
            setAiResponse("Load weather data before analyzing.");
            return;
        }
        setLoadingAi(true);
        setAiResponse("");
        try {
            const response = await fetch(`${API_BASE}/api/ai/recommendation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: selectedDate,
                    plans: selectedPlans,
                    weather,
                    message: buildTranscript(history)
                })
            });
            if (!response.ok) {
                let errorMessage = "Failed to analyze plans";
                try {
                    const errorPayload = await response.json();
                    if (errorPayload?.detail) {
                        errorMessage = errorPayload.detail;
                    }
                } catch (error) {
                    // Keep default message when response is not JSON.
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setAiResponse(data.recommendation);
            setChatHistory([
                ...history,
                { role: "assistant", text: data.recommendation }
            ]);
        } catch (error) {
            console.error(error);
            setAiResponse("Unable to generate recommendations right now.");
        } finally {
            setLoadingAi(false);
        }
    };

    const handleAnalyze = async () => {
        await requestAnalysis(chatHistory);
    };

    const handleSendMessage = async () => {
        const trimmed = chatInput.trim();
        if (!trimmed) {
            return;
        }
        if (!weather) {
            setAiResponse("Load weather data before analyzing.");
            return;
        }
        const nextHistory = [...chatHistory, { role: "user", text: trimmed }];
        setChatHistory(nextHistory);
        setChatInput("");
        await requestAnalysis(nextHistory);
    };

    useEffect(() => {
        fetchPlans(selectedDate).catch(() => { });
    }, []);

    return (
        <div className="app">
            <header className="hero">
                <div>
                    <p className="eyebrow">Daily Planner + Weather + AI</p>
                    <h1>Weatherwise Agenda</h1>
                    <p className="subtitle">
                        Plan with clarity and adjust your day with real-time weather insights.
                    </p>
                </div>
                <div className="hero-card">
                    <p className="hero-label">Selected date</p>
                    <p className="hero-date">{selectedDate}</p>
                    <p className="hero-note">
                        Click any day to add plans and keep your schedule aligned.
                    </p>
                </div>
            </header>

            <main className="grid">
                <section className="panel calendar-panel">
                    <Calendar
                        currentMonth={currentMonth}
                        selectedDate={selectedDate}
                        plansByDate={plansByDate}
                        onSelectDate={handleSelectDate}
                        onPrevMonth={() =>
                            setCurrentMonth(
                                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                            )
                        }
                        onNextMonth={() =>
                            setCurrentMonth(
                                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                            )
                        }
                    />
                </section>

                <section className="panel weather-panel">
                    <WeatherWidget onWeatherLoaded={handleWeatherLoaded} weather={weather} />
                </section>

                <section className="panel ai-panel">
                    <AiPanel
                        selectedDate={selectedDate}
                        plans={selectedPlans}
                        weather={weather}
                        loading={loadingAi}
                        aiResponse={aiResponse}
                        chatHistory={chatHistory}
                        chatInput={chatInput}
                        onChatInputChange={setChatInput}
                        onSendMessage={handleSendMessage}
                        onAnalyze={handleAnalyze}
                    />
                </section>
            </main>

            <PlanModal
                open={modalOpen}
                date={selectedDate}
                plans={selectedPlans}
                onClose={() => setModalOpen(false)}
                onCreatePlan={handleCreatePlan}
            />
        </div>
    );
};

export default App;
