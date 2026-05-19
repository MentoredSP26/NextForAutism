'use client';

import { useEffect, useState } from 'react';
import {
    deleteCurrentRoleDetails,
    getCurrentProfileWithDetails,
    ROLE_DETAIL_TABLES,
    saveCurrentProfile,
} from '../../api/profile';
import './styles.css';

const emptyCommon = {
    full_name: '',
    phone: '',
    location: '',
    activity_status: 'available',
    bio: '',
};

const emptyDetails = {
    aspiring: {
        university: '',
        major: '',
        field_of_interest: '',
        graduation_year: '',
        goals: '',
    },
    established: {
        company: '',
        job_title: '',
        field: '',
        years_experience: '',
        mentoring_capacity: '',
        university: '',
    },
};

function normalizeFormValues(values) {
    return Object.fromEntries(
        Object.entries(values || {}).map(([key, value]) => [key, value ?? ''])
    );
}

function ProfileEditor({ expectedRole, nav, title }) {
    const [profile, setProfile] = useState(emptyCommon);
    const [details, setDetails] = useState(emptyDetails[expectedRole] || {});
    const [role, setRole] = useState(expectedRole);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProfile() {
            try {
                const current = await getCurrentProfileWithDetails();
                if (!current) {
                    setError('Log in to edit your profile.');
                    return;
                }

                setRole(current.profile.role);
                setProfile({
                    ...emptyCommon,
                    ...normalizeFormValues(current.profile),
                });
                setDetails({
                    ...(emptyDetails[current.profile.role] || {}),
                    ...normalizeFormValues(current.details),
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    const updateProfile = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const updateDetails = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setSaving(true);

        try {
            const updated = await saveCurrentProfile({ profile, details });
            setProfile({
                ...emptyCommon,
                ...normalizeFormValues(updated.profile),
            });
            setDetails({
                ...(emptyDetails[updated.profile.role] || {}),
                ...normalizeFormValues(updated.details),
            });
            setMessage('Profile saved.');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteDetails = async () => {
        const confirmed = window.confirm('Delete your role-specific profile details? Your login and basic account information will remain.');
        if (!confirmed) return;

        setError('');
        setMessage('');
        setSaving(true);

        try {
            await deleteCurrentRoleDetails();
            setDetails(emptyDetails[role] || {});
            setMessage('Role-specific profile details deleted.');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const hasRoleMismatch = expectedRole && role !== expectedRole;
    const canDeleteDetails = Boolean(ROLE_DETAIL_TABLES[role]);

    return (
        <div className="profile-editor-page">
            {nav}
            <main className="profile-editor-main">
                <div className="profile-editor-header">
                    <div>
                        <h1>{title}</h1>
                        <p>Keep your matching information current.</p>
                    </div>
                </div>

                {loading ? (
                    <p className="profile-editor-loading">Loading...</p>
                ) : (
                    <form className="profile-editor-card" onSubmit={handleSave}>
                        {hasRoleMismatch && (
                            <div className="profile-editor-error">
                                This account is registered as {role}, so these fields may not match this portal.
                            </div>
                        )}

                        <section className="profile-editor-section">
                            <h2>Basic Information</h2>
                            <div className="profile-editor-grid">
                                <label>
                                    Full Name
                                    <input
                                        value={profile.full_name}
                                        onChange={(e) => updateProfile('full_name', e.target.value)}
                                        required
                                    />
                                </label>
                                <label>
                                    Phone
                                    <input
                                        value={profile.phone}
                                        onChange={(e) => updateProfile('phone', e.target.value)}
                                        placeholder="Optional"
                                    />
                                </label>
                                <label>
                                    Location
                                    <input
                                        value={profile.location}
                                        onChange={(e) => updateProfile('location', e.target.value)}
                                        placeholder="City, State"
                                    />
                                </label>
                                <label>
                                    Status
                                    <select
                                        value={profile.activity_status}
                                        onChange={(e) => updateProfile('activity_status', e.target.value)}
                                    >
                                        <option value="available">Available</option>
                                        <option value="busy">Busy</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </label>
                            </div>
                            <label>
                                Bio / Notes
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => updateProfile('bio', e.target.value)}
                                    rows={4}
                                    placeholder="Short context for staff and matching decisions"
                                />
                            </label>
                        </section>

                        {role === 'aspiring' && (
                            <section className="profile-editor-section">
                                <h2>Student Details</h2>
                                <div className="profile-editor-grid">
                                    <label>
                                        University
                                        <input
                                            value={details.university}
                                            onChange={(e) => updateDetails('university', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Major
                                        <input
                                            value={details.major}
                                            onChange={(e) => updateDetails('major', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Field of Interest
                                        <input
                                            value={details.field_of_interest}
                                            onChange={(e) => updateDetails('field_of_interest', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Graduation Year
                                        <input
                                            type="number"
                                            min="2020"
                                            max="2040"
                                            value={details.graduation_year}
                                            onChange={(e) => updateDetails('graduation_year', e.target.value)}
                                        />
                                    </label>
                                </div>
                                <label>
                                    Goals / Preferences
                                    <textarea
                                        value={details.goals}
                                        onChange={(e) => updateDetails('goals', e.target.value)}
                                        rows={4}
                                    />
                                </label>
                            </section>
                        )}

                        {role === 'established' && (
                            <section className="profile-editor-section">
                                <h2>Mentor Details</h2>
                                <div className="profile-editor-grid">
                                    <label>
                                        Company
                                        <input
                                            value={details.company}
                                            onChange={(e) => updateDetails('company', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Job Title
                                        <input
                                            value={details.job_title}
                                            onChange={(e) => updateDetails('job_title', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Mentoring Field
                                        <input
                                            value={details.field}
                                            onChange={(e) => updateDetails('field', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        University
                                        <input
                                            value={details.university}
                                            onChange={(e) => updateDetails('university', e.target.value)}
                                            placeholder="Optional"
                                        />
                                    </label>
                                    <label>
                                        Years Experience
                                        <input
                                            type="number"
                                            min="0"
                                            max="80"
                                            value={details.years_experience}
                                            onChange={(e) => updateDetails('years_experience', e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Mentoring Capacity
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={details.mentoring_capacity}
                                            onChange={(e) => updateDetails('mentoring_capacity', e.target.value)}
                                        />
                                    </label>
                                </div>
                            </section>
                        )}

                        {error && <div className="profile-editor-error">{error}</div>}
                        {message && <div className="profile-editor-success">{message}</div>}

                        <div className="profile-editor-actions">
                            <button type="submit" className="profile-editor-save" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                            {canDeleteDetails && (
                                <button type="button" className="profile-editor-delete" onClick={handleDeleteDetails} disabled={saving}>
                                    Delete Details
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}

export default ProfileEditor;
