import WeeklyMaterials from "@/components/WeeklyMaterials/WeeklyMaterials";

export default function EstablishedDashboard() {

    return (
        <div className='materials-page'>
            <div>
                <div className='materials-header'>
                    <h1>Weekly Learning Materials</h1>
                </div>
                <p><b>Your curated learning path organized by week</b></p>
            </div>

            <br></br>    
            <WeeklyMaterials/>
        </div>
    );
}