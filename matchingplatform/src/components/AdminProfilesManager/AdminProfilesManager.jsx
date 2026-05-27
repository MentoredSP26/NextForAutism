'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    deleteManagedRoleDetails,
    getManagedProfileWithDetails,
    saveManagedProfile,
} from '../../api/profile';
import { getAspiringProfessionals, getEstablishedProfessionals } from '../../api/queries';
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

function normalize(values) {
    return Object.fromEntries(
        Object.entries(values || {}).map(([key, value]) => [key, value ?? ''])
    );
}

function getFriendlyProfileError(error) {
    const message = error?.message || '';
    if (
        message.includes('JSON object requested') ||
        message.includes('multiple (or no) rows returned') ||
        message.includes('no rows') ||
        message.includes('could not be found') ||
        message.includes('no longer exists')
    ) {
        return 'This profile could not be loaded. It may have been deleted or changed by another admin. Select another profile or refresh the page.';
    }
    return message || 'Something went wrong. Please try again.';
}

function AdminProfilesManager() {
    const [people, setPeople] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [selectedRole, setSelectedRole] = useState('aspiring');
    const [profile, setProfile] = useState(emptyCommon);
    const [details, setDetails] = useState(emptyDetails.aspiring);
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadPeople = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [aspiring, established] = await Promise.all([
                getAspiringProfessionals(),
                getEstablishedProfessionals(),
            ]);

            const nextPeople = [
                ...aspiring.map(person => ({
                    id: person.id,
                    role: 'aspiring',
                    name: person.full_name,
                    email: person.email,
                    primary: person.aspiring_professionals?.[0]?.field_of_interest || person.aspiring_professionals?.[0]?.major || '',
                    secondary: person.aspiring_professionals?.[0]?.university || '',
                    status: person.activity_status,
                })),
                ...established.map(person => ({
                    id: person.id,
                    role: 'established',
                    name: person.full_name,
                    email: person.email,
                    primary: person.established_professionals?.[0]?.field || person.established_professionals?.[0]?.job_title || '',
                    secondary: person.established_professionals?.[0]?.company || '',
                    status: person.activity_status,
                })),
            ];

            setPeople(nextPeople);
            if (!selectedId && nextPeople.length > 0) {
                setSelectedId(nextPeople[0].id);
                setSelectedRole(nextPeople[0].role);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [selectedId]);

    const loadSelectedProfile = useCallback(async (profileId, role) => {
        setError('');
        setMessage('');
        try {
            const current = await getManagedProfileWithDetails(profileId, role);
            setProfile({
                ...emptyCommon,
                ...normalize(current.profile),
            });
            setDetails({
                ...(emptyDetails[role] || {}),
                ...normalize(current.details),
            });
        } catch (err) {
            setProfile(emptyCommon);
            setDetails(emptyDetails[role] || {});
            setError(getFriendlyProfileError(err));
        }
    }, []);

    useEffect(() => {
        loadPeople();
    }, [loadPeople]);

    useEffect(() => {
        if (selectedId) loadSelectedProfile(selectedId, selectedRole);
    }, [selectedId, selectedRole, loadSelectedProfile]);

    const filteredPeople = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return people.filter(person => {
            const roleMatches = filter === 'all' || person.role === filter;
            const queryMatches = !normalizedQuery || [
                person.name,
                person.email,
                person.primary,
                person.secondary,
                person.status,
            ].some(value => String(value || '').toLowerCase().includes(normalizedQuery));
            return roleMatches && queryMatches;
        });
    }, [people, filter, query]);

    const selectedPerson = people.find(person => person.id === selectedId);

    const selectPerson = (person) => {
        setSelectedId(person.id);
        setSelectedRole(person.role);
    };

    const updateProfile = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const updateDetails = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (!selectedId) return;

        setSaving(true);
        setError('');
        setMessage('');

        try {
            const updated = await saveManagedProfile(selectedId, selectedRole, { profile, details });
            setProfile({ ...emptyCommon, ...normalize(updated.profile) });
            setDetails({ ...(emptyDetails[selectedRole] || {}), ...normalize(updated.details) });
            setMessage('Profile saved.');
            await loadPeople();
        } catch (err) {
            if (getFriendlyProfileError(err).includes('could not be loaded')) {
                setProfile(emptyCommon);
                setDetails(emptyDetails[selectedRole] || {});
            }
            setError(getFriendlyProfileError(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteDetails = async () => {
        if (!selectedId) return;
        const confirmed = window.confirm('Delete role-specific details for this profile? Basic account information will remain.');
        if (!confirmed) return;

        setSaving(true);
        setError('');
        setMessage('');

        try {
            await deleteManagedRoleDetails(selectedId, selectedRole);
            setDetails(emptyDetails[selectedRole] || {});
            setMessage('Role-specific details deleted.');
            await loadPeople();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-profiles-manager">
            <aside className="admin-profiles-list">
                <div className="admin-profiles-tools">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search profiles"
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All roles</option>
                        <option value="aspiring">Students</option>
                        <option value="established">Mentors</option>
                    </select>
                </div>

                {loading ? (
                    <p className="admin-profiles-empty">Loading...</p>
                ) : filteredPeople.length === 0 ? (
                    <p className="admin-profiles-empty">No profiles found.</p>
                ) : (
                    filteredPeople.map(person => (
                        <button
                            type="button"
                            key={person.id}
                            className={`admin-profile-row ${person.id === selectedId ? 'selected' : ''}`}
                            onClick={() => selectPerson(person)}
                        >
                            <span className="admin-profile-row-name">{person.name}</span>
                            <span className="admin-profile-row-meta">{person.role} · {person.primary || 'No field'}</span>
                            <span className="admin-profile-row-sub">{person.secondary || person.email}</span>
                        </button>
                    ))
                )}
            </aside>

            <form className="admin-profile-form" onSubmit={handleSave}>
                <div className="admin-profile-form-header">
                    <div>
                        <h2>{selectedPerson?.name || 'Select a profile'}</h2>
                        <p>{selectedPerson ? `${selectedPerson.role} profile` : 'Choose a student or mentor to edit'}</p>
                    </div>
                </div>

                <section className="admin-profile-section">
                    <h3>Basic Information</h3>
                    <div className="admin-profile-grid">
                        <label>
                            Full Name
                            <input value={profile.full_name} onChange={(e) => updateProfile('full_name', e.target.value)} required />
                        </label>
                        <label>
                            Phone
                            <input value={profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} />
                        </label>
                        <label>
                            Location
                            <input value={profile.location} onChange={(e) => updateProfile('location', e.target.value)} />
                        </label>
                        <label>
                            Status
                            <select value={profile.activity_status} onChange={(e) => updateProfile('activity_status', e.target.value)}>
                                <option value="available">Available</option>
                                <option value="busy">Busy</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </label>
                    </div>
                    <label>
                        Bio / Notes
                        <textarea value={profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} rows={3} />
                    </label>
                </section>

                {selectedRole === 'aspiring' && (
                    <section className="admin-profile-section">
                        <h3>Student Details</h3>
                        <div className="admin-profile-grid">
                            <label>
                                University
                                <input value={details.university} onChange={(e) => updateDetails('university', e.target.value)} required />
                            </label>
                            <label>
                                Major
                                <input value={details.major} onChange={(e) => updateDetails('major', e.target.value)} required />
                            </label>
                            <label>
                                Field of Interest
                                <input value={details.field_of_interest} onChange={(e) => updateDetails('field_of_interest', e.target.value)} required />
                            </label>
                            <label>
                                Graduation Year
                                <input type="number" value={details.graduation_year} onChange={(e) => updateDetails('graduation_year', e.target.value)} />
                            </label>
                        </div>
                        <label>
                            Goals / Preferences
                            <textarea value={details.goals} onChange={(e) => updateDetails('goals', e.target.value)} rows={3} />
                        </label>
                    </section>
                )}

                {selectedRole === 'established' && (
                    <section className="admin-profile-section">
                        <h3>Mentor Details</h3>
                        <div className="admin-profile-grid">
                            <label>
                                Company
                                <input value={details.company} onChange={(e) => updateDetails('company', e.target.value)} required />
                            </label>
                            <label>
                                Job Title
                                <input value={details.job_title} onChange={(e) => updateDetails('job_title', e.target.value)} required />
                            </label>
                            <label>
                                Mentoring Field
                                <input value={details.field} onChange={(e) => updateDetails('field', e.target.value)} required />
                            </label>
                            <label>
                                University
                                <input value={details.university} onChange={(e) => updateDetails('university', e.target.value)} />
                            </label>
                            <label>
                                Years Experience
                                <input type="number" value={details.years_experience} onChange={(e) => updateDetails('years_experience', e.target.value)} />
                            </label>
                            <label>
                                Mentoring Capacity
                                <input type="number" value={details.mentoring_capacity} onChange={(e) => updateDetails('mentoring_capacity', e.target.value)} />
                            </label>
                        </div>
                    </section>
                )}

                {error && <div className="admin-profile-error">{error}</div>}
                {message && <div className="admin-profile-success">{message}</div>}

                <div className="admin-profile-actions">
                    <button type="submit" className="admin-profile-save" disabled={saving || !selectedId}>
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button type="button" className="admin-profile-delete" onClick={handleDeleteDetails} disabled={saving || !selectedId}>
                        Delete Details
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminProfilesManager;
