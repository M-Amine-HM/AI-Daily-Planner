import PropTypes from "prop-types";

const AiPanel = ({
    selectedDate,
    plans,
    weather,
    loading,
    aiResponse,
    chatHistory,
    chatInput,
    onChatInputChange,
    onSendMessage,
    onAnalyze
}) => {
    const canAnalyze = weather && selectedDate;

    return (
        <div className="ai">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">AI Assistant</p>
                    <h2>Analyze my day</h2>
                </div>
            </div>
            <p className="muted">
                Provide weather and plans, then let the assistant optimize your schedule.
            </p>
            <div className="ai-thread">
                {chatHistory.length === 0 ? (
                    <p className="muted">Start the conversation to get guidance.</p>
                ) : (
                    chatHistory.map((entry, index) => (
                        <div key={`${entry.role}-${index}`} className={`chat-bubble ${entry.role}`}>
                            <p className="chat-role">{entry.role}</p>
                            <p>{entry.text}</p>
                        </div>
                    ))
                )}
            </div>

            <label className="ai-input">
                Chat with the assistant
                <textarea
                    rows="3"
                    value={chatInput}
                    onChange={(event) => onChatInputChange(event.target.value)}
                    placeholder="Ask for constraints or advice. Press Enter to send."
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            if (!canAnalyze || loading) {
                                return;
                            }
                            onSendMessage();
                        }
                    }}
                />
            </label>
            <button className="primary" onClick={onAnalyze} disabled={!canAnalyze || loading}>
                {loading ? "Analyzing..." : "Analyze my day"}
            </button>

            <div className="ai-response">
                {aiResponse ? (
                    <pre>{aiResponse}</pre>
                ) : (
                    <p className="muted">Awaiting recommendations.</p>
                )}
            </div>

            <div className="ai-context">
                <p>
                    <strong>Date:</strong> {selectedDate}
                </p>
                <p>
                    <strong>Plans:</strong> {plans.length}
                </p>
                <p>
                    <strong>Weather:</strong> {weather ? weather.description : "Not loaded"}
                </p>
            </div>
        </div>
    );
};

AiPanel.propTypes = {
    selectedDate: PropTypes.string.isRequired,
    plans: PropTypes.array.isRequired,
    weather: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    aiResponse: PropTypes.string.isRequired,
    chatHistory: PropTypes.array.isRequired,
    chatInput: PropTypes.string.isRequired,
    onChatInputChange: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onAnalyze: PropTypes.func.isRequired
};

export default AiPanel;
