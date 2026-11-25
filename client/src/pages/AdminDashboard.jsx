import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from "../config/api";

function AdminDashboard() {
    const { user } = useAuth();

    // sidebar navigation
    const [activeSection, setActiveSection] = useState('dashboard');

    const serviceFormRef = useRef(null);
    const staffFormRef = useRef(null);

    ////////////////////////////////////////////////////////////
    // services data 
    const [serviceList, setServiceList] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState('');

     // Service form
    const [serviceForm, setServiceForm] = useState({
        name: '',
        description: '',
        price: '',
        image_url: ''
    });

    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);

    // Service messages
    const [serviceError, setServiceError] = useState('');
    const [serviceSuccess, setServiceSuccess] = useState('');
    const [isSavingService, setIsSavingService] = useState(false);

    // fetch services
    async function fetchServices() {
        try {
            setServicesError('');

            const response = await fetch(
                `${API_URL}/api/services`,
                {
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch services.')
            }

            const data = await response.json();

            setServiceList(
                Array.isArray(data) ? data : data.services || []
            );

        } catch (error) {
            console.error('Error fetching services:', error);
            setServicesError('Unable to load services.');

        } finally {
            setServicesLoading(false);
        }
    }

    // Handle service form input changes
    function handleServiceInputChange(event) {
        const { name, value } = event.target;

        setServiceForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    }

    // Reset service form
    function resetServiceForm() {
        setServiceForm({
            name: '',
            description: '',
            price: '',
            image_url: ''
        });

        setEditingServiceId(null);
        setShowServiceForm(false);
        setServiceError('');
    }

    // Open form to add a service
    function handleOpenAddServiceForm() {
        setServiceForm({
            name: '',
            description: '',
            price: '',
            image_url: ''
        });

        setEditingServiceId(null);
        setShowServiceForm(true);
        setServiceError('');
        setServiceSuccess('');
    }

    // Open form to edit a service
    function handleEditService(service) {
        setServiceForm({
            name: service.name || '',
            description: service.description || '',
            price: service.price ?? '',
            image_url: service.image_url || ''
        });

        setEditingServiceId(service.id);
        setShowServiceForm(true);
        setServiceError('');
        setServiceSuccess('');
    }

    // Add or update service
    async function handleSaveService(event) {
        event.preventDefault();

        setServiceError('');
        setServiceSuccess('');
        setIsSavingService(true);

        const isEditing = editingServiceId !== null;

        const url = isEditing
            ? `${API_URL}/api/services/${editingServiceId}`
            : `${API_URL}/api/services`;

        const method = isEditing ? 'PUT' : 'POST';

        const serviceData = {
            ...serviceForm,
            price: Number(serviceForm.price),
            image_url: serviceForm.image_url.trim() || null
        };

        try {
            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setServiceError(
                    data.message || 'Unable to save service.'
                );
                return;
            }

            setServiceSuccess(
                isEditing
                    ? 'Service updated successfully!'
                    : 'Service added successfully!'
            );

            resetServiceForm();

            await fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            setServiceError('Unable to connect to the server.');
        } finally {
            setIsSavingService(false);
        }
    }

    // Delete service
    async function handleDeleteService(service) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${service.name}?`
        );

        if (!confirmed) {
            return;
        }

        setServiceError('');
        setServiceSuccess('');

        try {
            const response = await fetch(
                `${API_URL}/api/services/${service.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setServiceError(
                    data.message || 'Unable to delete service.'
                );
                return;
            }

            setServiceSuccess('Service deleted successfully!');

            await fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            setServiceError('Unable to connect to the server.');
        }
    }

    ////////////////////////////////////////////////////////////
    // staff data
    const [staffList, setStaffList] = useState([]);
    // staff form
    const [showStaffForm, setShowStaffForm] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState(null);

    const [staffForm, setStaffForm] = useState({
        name: '',
        job_title: '',
        bio: '',
        image_url: ''
    })

    // Messages
    const [staffError, setStaffError] = useState('');
    const [staffSuccess, setStaffSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Fetch staff members
    async function fetchStaff() {
        try {
            const response = await fetch(
                `${API_URL}/api/staff`,
                {
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch staff members.');
            }

            const data = await response.json();

            setStaffList(
                Array.isArray(data) ? data : data.staff || []
            );
        } catch (error) {
            console.error('Error fetching staff:', error);
            setStaffError('Unable to load staff members.');
        }
    }

    // Load staff when dashboard opens
    useEffect(() => {
        Promise.resolve().then(() => {
            fetchServices();
            fetchStaff();
        });      
    }, []);

        // Scroll to the staff form when it opens
    useEffect(() => {
        if (showStaffForm && activeSection === 'staff') {
            staffFormRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [showStaffForm, activeSection]);

    // Scroll to the service form when it opens
useEffect(() => {
    if (showServiceForm && activeSection === 'services') {
        serviceFormRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}, [showServiceForm, activeSection, editingServiceId]);

    // Handle form input changes
    function handleStaffInputChange(event) {
        const { name, value } = event.target;

        setStaffForm({
            ...staffForm,
            [name]: value
        });
    }

    // Reset staff form
    function resetStaffForm() {
        setStaffForm({
            name: '',
            job_title: '',
            bio: '',
            image_url: ''
        });

        setEditingStaffId(null);
        setShowStaffForm(false);
        setStaffError('');
    }

    // Open form to add a staff member
    function handleOpenAddForm() {
        setStaffForm({
            name: '',
            job_title: '',
            bio: '',
            image_url: ''
        });

        setEditingStaffId(null);
        setShowStaffForm(true);
        setStaffError('');
        setStaffSuccess('');
    }

    // Open form to update a staff member
    function handleEditStaff(staff) {
        setStaffForm({
            name: staff.name || '',
            job_title: staff.job_title || '',
            bio: staff.bio || '',
            image_url: staff.image_url || ''
        });

        setEditingStaffId(staff.id);
        setShowStaffForm(true);
        setStaffError('');
        setStaffSuccess('');
    }

    // Add or update staff member
    async function handleSaveStaff(event) {
        event.preventDefault();

        setStaffError('');
        setStaffSuccess('');
        setIsSaving(true);

        const isEditing = editingStaffId !== null;

        const url = isEditing
            ? `${API_URL}/api/staff/${editingStaffId}`
            : `${API_URL}/api/staff`;

        const method = isEditing ? 'PUT' : 'POST';

        const staffData = {
            ...staffForm,
            image_url: staffForm.image_url.trim() || null
        };

        try {
            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(staffData)
            });

            const data = await response.json();

            if (!response.ok) {
                setStaffError(
                    data.message || 'Unable to save staff member.'
                );
                return;
            }

            setStaffSuccess(
                isEditing
                    ? 'Staff member updated successfully!'
                    : 'Staff member added successfully!'
            );

            resetStaffForm();

            await fetchStaff();

        } catch (error) {
            console.error('Error saving staff:', error);
            setStaffError('Unable to connect to the server.');
        } finally {
            setIsSaving(false);
        }
    }

    // Delete staff member
    async function handleDeleteStaff(staff) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${staff.name}?`
        );

        if (!confirmed) {
            return;
        }

        setStaffError('');
        setStaffSuccess('');

        try {
            const response = await fetch(
                `${API_URL}/api/staff/${staff.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setStaffError(
                    data.message || 'Unable to delete staff member.'
                );
                return;
            }

            setStaffSuccess('Staff member deleted successfully!');

            await fetchStaff();

        } catch (error) {
            console.error('Error deleting staff:', error);
            setStaffError('Unable to connect to the server.');
        }
    }


    return (

        <main className="admin-dashboard">

            {/* full width welcome banner */}
            <section className="admin-welcome">
                <div>
                    <h1>Admin Dashboard</h1>
                    <h2>Welcome back, {user.name}!</h2>
                </div>
            </section>
            

            {/* Sidebar and main content */}
            <div className="admin-layout">
                {/* sidebar */}
                <aside className="admin-sidebar">
                    <h2>Admin Panel</h2>

                    <nav>
                        <button
                            className={activeSection === 'dashboard' ? 'active' : ''}
                            onClick={() => setActiveSection('dashboard')}
                        >
                            Dashboard
                        </button>



                        <button
                            className={activeSection === 'services' ? 'active' : ''}
                            onClick={() => setActiveSection('services')}
                        >
                            Manage Services
                        </button>
                        
                        <button
                            className={activeSection === 'staff' ? 'active' : ''}
                            onClick={() => setActiveSection('staff')}
                        >
                            Manage Staff
                        </button>

                         <button
                            className={activeSection === 'users' ? 'active' : ''}
                            onClick={() => setActiveSection('users')}
                        >
                            Manage Customers
                        </button>

                        <button
                            className={activeSection === 'images' ? 'active' : ''}
                            onClick={() => setActiveSection('images')}
                        >
                            Manage Images
                        </button>

                        <button
                            className={activeSection === 'profile' ? 'active' : ''}
                            onClick={() => setActiveSection('profile')}
                        >
                            My Profile
                        </button>

                       
                    </nav>
                </aside>


                {/* Main dashboard content */}
                <section className="admin-main">

                    {/* Dashboard Overview */}
                    {activeSection === 'dashboard' && (
                        <>
                            <section className="admin-stats">
                                <h1>Overview</h1>
                                <div className="dashboard-stats-grid">
                                    <div className="dashboard-stat-card">
                                        <h3>Total Services</h3>
                                        <p>{serviceList.length}</p>
                                    </div>

                                    <div className="dashboard-stat-card">
                                        <h3>Total Staff</h3>
                                        <p>{staffList.length}</p>
                                    </div>


                                </div>
                                            
                            </section>

                            <section className="admin-management">
                                <h3>Website Management</h3>
                                <p>
                                    Select a section from the sidebar to manage the Bob's Garage Website.
                                </p>
                            </section>
                        </>
                    )}




                    {/* Manage Services */}
                    {activeSection === 'services' && (
                        <section className="admin-section">
                            <h2>Manage Services</h2>
                            <p>Manage the services offered by Bob's garage.</p>

                            {!showServiceForm && (
                                <button
                                    className="admin-add-button"
                                    onClick={handleOpenAddServiceForm}
                                >
                                    Add Service
                                </button>
                            )}

                             {/* Add or edit service form */}
                            {showServiceForm && (
                                <form
                                    ref={serviceFormRef}
                                    className="admin-staff-form"
                                    onSubmit={handleSaveService}
                                >
                                    <h3>
                                        {editingServiceId !== null
                                            ? 'Update Service'
                                            : 'Add Service'}
                                    </h3>

                                    <label htmlFor="service-name">
                                        Service Name
                                    </label>
                                    <input
                                        id="service-name"
                                        type="text"
                                        name="name"
                                        value={serviceForm.name}
                                        onChange={handleServiceInputChange}
                                        required
                                    />

                                    <label htmlFor="service-description">
                                        Description
                                    </label>
                                    <textarea
                                        id="service-description"
                                        name="description"
                                        value={serviceForm.description}
                                        onChange={handleServiceInputChange}
                                        required
                                    />

                                    <label htmlFor="service-price">
                                        Price
                                    </label>
                                    <input
                                        id="service-price"
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={serviceForm.price}
                                        onChange={handleServiceInputChange}
                                        required
                                    />

                                    <label htmlFor="service-image">
                                        Image URL
                                    </label>
                                    <input
                                        id="service-image"
                                        type="text"
                                        name="image_url"
                                        value={serviceForm.image_url}
                                        onChange={handleServiceInputChange}
                                        placeholder="/images/service-name.jpg"
                                    />

                                    {servicesError && (
                                        <p className="admin-form-error">
                                            {servicesError}
                                        </p>
                                    )}

                                    <button 
                                        type="submit"
                                        className="admin-save-button"
                                        disabled={isSavingService}
                                    >
                                        {isSavingService
                                            ? 'Saving...'
                                            : editingServiceId !== null
                                            ? 'Update Service'
                                            : 'Save Service'}
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-cancel-button"
                                        onClick={resetServiceForm}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}

                             {serviceSuccess && (
                                <p className="admin-form-success">
                                    {serviceSuccess}
                                </p>
                            )}

                            {serviceError && !showServiceForm && (
                                <p className="admin-form-error">
                                    {serviceError}
                                </p>
                            )}


                            {servicesLoading && (
                                <p>Loading services...</p>
                            )}
                        

                            {!servicesLoading && !servicesError && (
                                <div className="admin-service-list">
                                    {serviceList.map((service) => (
                                        <div
                                            className="admin-service-card"
                                            key={service.id}
                                        >
                                            {service.image_url ? (
                                                <img
                                                    src={service.image_url}
                                                    alt={service.name}
                                                />
                                            ) : (
                                                <div className="admin-service-placeholder">
                                                    No image available
                                                </div>
                                            )}

                                            <div className="admin-service-card-content">
                                                <h3>{service.name}</h3>
                                                <p>{service.description}</p>
                                                <p className="admin-service-price">
                                                    $
                                                    {Number(
                                                        service.price
                                                    ).toFixed(2)}
                                                </p>


                                                <div className="admin-staff-actions">
                                                    <button
                                                        className="admin-edit-button"
                                                        onClick={() =>
                                                            handleEditService(service)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="admin-delete-button"
                                                        onClick={() =>
                                                            handleDeleteService(service)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                
                                    {serviceList.length === 0 && (
                                        <p>No services found.</p>
                                    )}
                                </div>
                            )}

                            {servicesError && (
                                <p className="admin-form-error">
                                    {servicesError}
                                </p>
                            )}
                        </section>
                    )}


                    {/* Manage Staff */}
                    {activeSection === 'staff' && (
                        <section className="admin-section">
                            <h2>Manage Staff</h2>
                            <p>Manage the staff profiles displayed on the about page.</p>

                            {!showStaffForm && (
                                <button
                                    className="admin-add-button"
                                    onClick={handleOpenAddForm}
                                >Add Staff Member</button>
                            )}

                             {/* Add or edit staff form */}
                            {showStaffForm && (
                                <form
                                    ref={staffFormRef}
                                    className="admin-staff-form"
                                    onSubmit={handleSaveStaff}
                                >
                                    <h3>
                                        {editingStaffId !== null
                                            ? 'Update Staff Member'
                                            : 'Add Staff Member'}
                                    </h3>

                                    <label htmlFor="staff-name">
                                        Name
                                    </label>

                                    <input
                                        id="staff-name"
                                        type="text"
                                        name="name"
                                        value={staffForm.name}
                                        onChange={handleStaffInputChange}
                                        required
                                    />

                                    <label htmlFor="staff-job-title">
                                        Job Title
                                    </label>

                                    <input
                                        id="staff-job-title"
                                        type="text"
                                        name="job_title"
                                        value={staffForm.job_title}
                                        onChange={handleStaffInputChange}
                                        required
                                    />

                                    <label htmlFor="staff-bio">
                                        Bio
                                    </label>

                                    <textarea
                                        id="staff-bio"
                                        name="bio"
                                        value={staffForm.bio}
                                        onChange={handleStaffInputChange}
                                        required
                                    />

                                    <label htmlFor="staff-image">
                                        Image URL
                                    </label>

                                    <input
                                        id="staff-image"
                                        type="text"
                                        name="image_url"
                                        value={staffForm.image_url}
                                        onChange={handleStaffInputChange}
                                        placeholder="/images/staff-name.jpg"
                                    />

                                    {staffError && (
                                        <p className="admin-form-error">
                                            {staffError}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className="admin-save-button"
                                        disabled={isSaving}
                                    >
                                        {isSaving
                                            ? 'Saving...'
                                            : editingStaffId !== null
                                                ? 'Update Staff Member'
                                                : 'Save Staff Member'}
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-cancel-button"
                                        onClick={resetStaffForm}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}

                            {/* Success message */}
                            {staffSuccess && (
                                <p className="admin-form-success">
                                    {staffSuccess}
                                </p>
                            )}

                            {/* Error message */}
                            {staffError && !showStaffForm && (
                                <p className="admin-form-error">
                                    {staffError}
                                </p>
                            )}

                            {/* Staff cards */}
                            <div className="admin-staff-grid">

                                {staffList.map((staff) => (
                                    <div
                                        className="admin-staff-card"
                                        key={staff.id}
                                    >

                                        {staff.image_url ? (
                                            <img
                                                src={staff.image_url}
                                                alt={staff.name}
                                            />
                                        ) : (
                                            <div className="admin-staff-placeholder">
                                                No image available
                                            </div>
                                        )}

                                        <div className="admin-staff-card-content">

                                            <h3>{staff.name}</h3>

                                            <p className="staff-job-title">
                                                {staff.job_title}
                                            </p>

                                            <p>{staff.bio}</p>

                                            {/* Staff actions */}
                                            <div className="admin-staff-actions">

                                                <button
                                                    className="admin-edit-button"
                                                    onClick={() =>
                                                        handleEditStaff(staff)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="admin-delete-button"
                                                    onClick={() =>
                                                        handleDeleteStaff(staff)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>

                            {staffList.length === 0 && (
                                <p>No staff members found.</p>
                            )}

                        </section>
                    )}



                       
                    
                    
                    {/* Manage Images */}
                    {activeSection === 'images' && (
                        <section className="admin-section">
                            <h2>Manage Images</h2>
                            <p>Manage the images displayed on the website.</p>
                        </section>
                    )}
                    
                    {/* Manage Users */}
                    {activeSection === 'users' && (
                        <section className="admin-section">
                            <h2>Manage Customers</h2>
                            <p>Manage customer accounts.</p>
                        </section>
                    )}
                    
                    {/* My Profile */}
                    {activeSection === 'profile' && (
                        <section className="admin-section">
                            <h2>My Profile</h2>
                            <p>Manage your account details.</p>
                        </section>
                    )}
                </section>
            </div>
        </main>
    );
}

export default AdminDashboard;