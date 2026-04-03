

function StatsCard({icon, label, value}) {
    return (
        <div className = "stats-card">
            <div className = "stats-card-icon">
                {/*icon*/}
            </div>
        <div className = "stats-card-content">
            <p className = "stats-card-label">{label}</p>
            <p className = "stats-card-value">{value}</p>
        </div>
    </div>
);
}

export default StatsCard;

