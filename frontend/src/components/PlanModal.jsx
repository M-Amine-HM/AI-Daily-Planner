import { useState } from "react";
import PropTypes from "prop-types";

const PlanModal = ({ open, date, plans, onClose, onCreatePlan }) => {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [color, setColor] = useState("#f97316");
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setTitle("");
        setTime("");
        setColor("#f97316");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title || !time) {
            return;
        }
        setSubmitting(true);
        try {
            await onCreatePlan(date, { title, time, color });
            resetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div className="modal-backdrop" role="presentation">
            <div className="modal">
                <header className="modal-header">
                    <div>
                        <p className="modal-label">Plan for</p>
                        <h2>{date}</h2>
                    </div>
                    <button className="ghost" onClick={onClose}>
                        Close
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <label>
                        Title
                        <input
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Morning run"
                            required
                        />
                    </label>
                    <label>
                        Time
                        <input
                            type="time"
                            value={time}
                            onChange={(event) => setTime(event.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Color
                        <input
                            type="color"
                            value={color}
                            onChange={(event) => setColor(event.target.value)}
                            required
                        />
                    </label>
                    <button className="primary" type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Add plan"}
                    </button>
                </form>

                <div className="plan-list">
                    <h3>Plans</h3>
                    {plans.length === 0 ? (
                        <p className="muted">No plans yet. Add the first one.</p>
                    ) : (
                        plans.map((plan) => (
                            <div key={plan.id} className="plan-item">
                                <span className="plan-color" style={{ background: plan.color }} />
                                <div>
                                    <p className="plan-title">{plan.title}</p>
                                    <p className="plan-time">{plan.time}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

PlanModal.propTypes = {
    open: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
    plans: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreatePlan: PropTypes.func.isRequired
};

export default PlanModal;
