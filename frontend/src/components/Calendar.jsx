import PropTypes from "prop-types";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const Calendar = ({
    currentMonth,
    selectedDate,
    plansByDate,
    onSelectDate,
    onPrevMonth,
    onNextMonth
}) => {
    const monthLabel = currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = end.getDate();
    const startOffset = start.getDay();

    const cells = [];
    for (let i = 0; i < startOffset; i += 1) {
        cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button className="ghost" onClick={onPrevMonth}>
                    Prev
                </button>
                <div>
                    <p className="calendar-month">{monthLabel}</p>
                    <p className="calendar-subtitle">Tap a day to plan</p>
                </div>
                <button className="ghost" onClick={onNextMonth}>
                    Next
                </button>
            </div>

            <div className="calendar-grid calendar-weekdays">
                {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
                    <div key={day} className="weekday">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-grid calendar-days">
                {cells.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className="day empty" />;
                    }
                    const formatted = formatDate(date);
                    const plans = plansByDate[formatted] || [];
                    const hasPlans = plans.length > 0;
                    const markerColor = hasPlans ? plans[0].color : "transparent";
                    return (
                        <button
                            key={formatted}
                            className={`day ${formatted === selectedDate ? "selected" : ""}`}
                            onClick={() => onSelectDate(formatted)}
                        >
                            <span>{date.getDate()}</span>
                            <span className="marker" style={{ background: markerColor }} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

Calendar.propTypes = {
    currentMonth: PropTypes.instanceOf(Date).isRequired,
    selectedDate: PropTypes.string.isRequired,
    plansByDate: PropTypes.object.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    onPrevMonth: PropTypes.func.isRequired,
    onNextMonth: PropTypes.func.isRequired
};

export default Calendar;
