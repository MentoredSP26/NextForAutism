import { redirect } from 'next/navigation';
import AspiringDashboard from './aspiring/page';

export default function Home() {
    // redirect('/login');
    return (
        <>
            <AspiringDashboard />
        </>
    )
}
