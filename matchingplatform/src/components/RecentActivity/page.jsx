import { initialAct } from "./activities";

export default function RecentActivity() {
  return (
    <div>
      <div>
        <h2>Recent Activity</h2>
      </div>
      <div>
        {initialAct.map((item, index) => (
          <div key={index}>
            <div>
              <p>{item.content}</p>
              <p>{item.group}</p>
            </div>
            <p>{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}