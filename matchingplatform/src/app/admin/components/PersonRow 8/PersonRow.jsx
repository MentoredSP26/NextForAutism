import "./styles.css";

function PersonRow({name, major, university, isMatched}) {
    const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("");

    return (
        <div className = "person-row">
            <div className = "person-row-avatar">
                <span> {initials}</span>
            </div>
            <div className = "person-row-info">
                <p className = "person-row-name"> {name}</p>
                <p className = "person-row-detail"> {major}, {university}</p>
            </div>
            <div className = "person-row-status">
                {isMatched ? (
                    <span className = "status-matched">Matched</span>
                ) : (
                    <span className = "status-pending">Pending</span>
                )}
            </div>
        </div>
    )
}

export default PersonRow; 