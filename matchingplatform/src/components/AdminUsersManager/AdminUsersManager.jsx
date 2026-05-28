'use client';

import { useEffect, useState } from 'react';
import './styles.css';

function AdminUsersManager() {
    const [admins, setAdmins] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function loadAdmins() {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin/users');
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to load admins.');
            setAdmins(result.admins || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to add admin.');

            setMessage(result.alreadyAdmin ? 'That user is already an admin.' : 'Admin access added.');
            setEmail('');
            await loadAdmins();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="admin-users-panel">
            <div className="admin-users-header">
                <div>
                    <h2>Admin Users</h2>
                    <p>Promote an existing account to admin access.</p>
                </div>
            </div>

            <form className="admin-users-form" onSubmit={handleSubmit}>
                <label>
                    User Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="person@example.org"
                        required
                    />
                </label>
                <button type="submit" disabled={saving}>
                    {saving ? 'Adding...' : 'Add Admin'}
                </button>
            </form>

            {error && <div className="admin-users-error">{error}</div>}
            {message && <div className="admin-users-success">{message}</div>}

            <div className="admin-users-list">
                {loading ? (
                    <p>Loading admins...</p>
                ) : admins.length === 0 ? (
                    <p>No admins found.</p>
                ) : (
                    admins.map((admin) => (
                        <div className="admin-user-row" key={admin.id}>
                            <span>{admin.full_name || admin.email}</span>
                            <small>{admin.email}</small>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default AdminUsersManager;
