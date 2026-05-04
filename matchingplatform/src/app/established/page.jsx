"use client";
import WeeklyMaterials from "../../components/WeeklyMaterials/WeeklyMaterials";

export default function EstablishedDashboard() {

    return (
        <div className='materials-page'>
            <div className="established-dashboard-header">
                <div className='materials-header'>
                    <h1>Weekly Learning Materials</h1>
                </div>
                <p className='low-opacity-text'>Your curated learning path organized by week</p>
            </div>
            <WeeklyMaterials/>
        </div>
    );
}