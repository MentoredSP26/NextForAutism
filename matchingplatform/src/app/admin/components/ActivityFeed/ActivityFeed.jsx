function ActivityFeed({activities}) {
    return (
        <div className = "activity-feed">
            <h3 className = "activity-feed-title">Recent Activity</h3>
            <div className = "activity-feed-list">{activities.map((activity, index) => (
                <div className = "activity-item" key = {index}>
                    <div className = "activity-feed-item-content">
                        <p className = "activity-feed-action">{activity.action}</p>
                        <p className = "activity-feed-user">{activity.user}</p>
                        </div>
                        <span className = "activity-feed-time">{activity.time}</span>
                </div>
            ))}
            </div>
        </div>
    );    
}

export default ActivityFeed;
