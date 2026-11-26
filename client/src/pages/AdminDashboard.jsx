import { useState, useRef, useEffect  } from 'react';
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

    // Service image upload

    

    const [imageDeleteError, setImageDeleteError] = useState('');
    const [imageDeleteSuccess, setImageDeleteSuccess] = useState('');

    const imageLibraryRef = useRef(null);
    const imageDeleteErrorRef = useRef(null);

   useEffect(() => {
    if (imageDeleteSuccess && imageLibraryRef.current) {
        imageLibraryRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    if (imageDeleteError && imageDeleteErrorRef.current) {
        imageDeleteErrorRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    }, [imageDeleteSuccess, imageDeleteError]);
    
    const [isUploadingServiceImage, setIsUploadingServiceImage] = useState(false);
    const [serviceImageUploadError, setServiceImageUploadError] = useState('');

    const serviceImageInputRef = useRef(null);

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


    // Upload service image
    async function handleUploadServiceImage(file) {
        setServiceImageUploadError('');

        if (!file) {
            setServiceImageUploadError(
                'Please select an image to upload.'
            );
            return;
        }

        if (!serviceForm.name.trim()) {
            setServiceImageUploadError(
                'Please enter the service name first.'
            );
            return;
        }

        setIsUploadingServiceImage(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt_text', serviceForm.name.trim());

        try {
            const response = await fetch(
                `${API_URL}/api/images/upload`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setServiceImageUploadError(
                    data.message || 'Unable to upload image.'
                );
                return;
            }

            // Put the uploaded image URL into the service form
            setServiceForm((previousForm) => ({
                ...previousForm,
                image_url: data.image_url
            }));

            

        } catch (error) {
            console.error('Error uploading service image:', error);

            setServiceImageUploadError(
                'Unable to connect to the server. Please check your connection and try uploading the image again.'
            );
        } finally {
            setIsUploadingServiceImage(false);
        }
    }



    // Upload staff image
    async function handleUploadStaffImage(file) {
        setStaffImageUploadError('');

        if (!file) {
            setStaffImageUploadError('Please select an image to upload.');
            return;
        }

        if (!staffForm.name.trim()) {
            setStaffImageUploadError('Please enter the staff member\'s name first.');
            return;
        }

        setIsUploadingStaffImage(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt_text', staffForm.name.trim());

        try {
            const response = await fetch(
                `${API_URL}/api/images/upload`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStaffImageUploadError(
                    data.message || 'Unable to upload image.'
                );
                return;
            }

            // Add the uploaded image URL to the staff form
            setStaffForm(previousForm => ({
                ...previousForm,
                image_url: data.image_url
            }));

        } catch (error) {
            console.error('Error uploading staff image:', error);

            setStaffImageUploadError(
                'Unable to connect to the server. Please check your connection and try uploading the image again.'
            );
        } finally {
            setIsUploadingStaffImage(false);
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


    // Users data
const [userList, setUserList] = useState([]);
const [usersLoading, setUsersLoading] = useState(false);
const [usersError, setUsersError] = useState('');

// Edit user
const [editingUserId, setEditingUserId] = useState(null);

const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'customer'
});

const handleEditUser = (userToEdit) => {
    setEditingUserId(userToEdit.id);

    setUserForm({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role: userToEdit.role || 'customer'
    });
};


const handleSaveUser = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(
            `${API_URL}/api/users/${editingUserId}`,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userForm)
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            window.alert('Your session has expired. Please log in again.');
            return;
        }

        if (!response.ok) {
            window.alert(data.message || 'Failed to update user.');
            return;
        }

        // Update the user in the table
        setUserList((currentUsers) =>
            currentUsers.map((user) =>
                user.id === editingUserId
                    ? { ...user, ...userForm }
                    : user
            )
        );

        setEditingUserId(null);

        window.alert('User updated successfully!');
    } catch (error) {
        console.error('Error updating user:', error);
        window.alert('Something went wrong while updating the user.');
    }
};


const handleDeleteUser = async (userToDelete) => {
    // Prevent deleting your own admin account
    if (String(userToDelete.id) === String(user.id)) {
        window.alert('You cannot delete your own account.');
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to delete ${userToDelete.name}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/users/${userToDelete.id}`,
            {
                method: 'DELETE',
                credentials: 'include'
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            window.alert('Your session has expired. Please log in again.');
            return;
        }

        if (!response.ok) {
            window.alert(data.message || 'Failed to delete user.');
            return;
        }

        // Remove the deleted user from the table
        setUserList((currentUsers) =>
            currentUsers.filter(
                (user) => user.id !== userToDelete.id
            )
        );

        window.alert('User deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error);
        window.alert('Something went wrong while deleting the user.');
    }
};



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

    // Staff image upload state

    const [isUploadingStaffImage, setIsUploadingStaffImage] = useState(false);
    const [staffImageUploadError, setStaffImageUploadError] = useState('');
    const staffImageInputRef = useRef(null);
    const galleryImageInputRef = useRef(null);
    const aboutImageInputRef = useRef(null);

    // Image upload state
    const [imageFile, setImageFile] = useState(null);
    const [imageAltText, setImageAltText] = useState('');
    const [imageType, setImageType] = useState('gallery');


    const [imageList, setImageList] = useState([]);
    const [imagesLoading, setImagesLoading] = useState(false);
    const [imagesLoadError, setImagesLoadError] = useState('');


    const [imageError, setImageError] = useState('');
    const [imageSuccess, setImageSuccess] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);

   

    const imageFileInputRef = useRef(null);

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

    // Fetch users
    const fetchUsers = async () => {
        setUsersLoading(true);
        setUsersError('');

        try {
            const response = await fetch(`${API_URL}/api/users`, {
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    window.alert(
                        'Your session has expired. Please log in again.'
                    );
                    return;
                }

                throw new Error(data.message || 'Failed to fetch users');
            }

            setUserList(Array.isArray(data) ? data : data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsersError('Unable to load users.');
        } finally {
            setUsersLoading(false);
        }
    };

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


    // Handle staff image selection
    function handleStaffImageChange(event) {
        const file = event.target.files[0] || null;

        setStaffImageUploadError('');

        if (file) {
            handleUploadStaffImage(file);
        }
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



    // Fetch images from the database
    async function fetchImages() {
        setImagesLoading(true);
        setImagesLoadError('');

        try {
            const response = await fetch(
                `${API_URL}/api/images`,
                {
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Unable to retrieve images.');
            }

            const data = await response.json();

            setImageList(
                Array.isArray(data) ? data : data.images || []
            );
        } catch (error) {
            console.error('Error fetching images:', error);
            setImagesLoadError('Unable to load images.');
        } finally {
            setImagesLoading(false);
        }
    }


    // Upload image
    async function handleUploadImage(event, imageType = 'gallery') {
        event.preventDefault();

        setImageError('');
        setImageSuccess('');

        if (!imageFile) {
            setImageError('Please select an image to upload.');
            return;
        }

        if (!imageAltText.trim()) {
            setImageError('Please enter image alt text.');
            return;
        }

        setIsUploadingImage(true);

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('alt_text', imageAltText.trim());
        formData.append('image_type', imageType);

        try {
            const response = await fetch(
                `${API_URL}/api/images/upload`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setImageError(
                    data.message || 'Unable to upload image.'
                );
                return;
            }

            

            setImageFile(null);

            if (imageFileInputRef.current) {
                imageFileInputRef.current.value = '';
            }

            if (aboutImageInputRef.current) {
                aboutImageInputRef.current.value = '';
            }

            if (galleryImageInputRef.current) {
                galleryImageInputRef.current.value = '';
            }

            setImageAltText('');

            setImageSuccess('Image uploaded successfully!');

            await fetchImages();

           

        } catch (error) {
            console.error('Error uploading image:', error);
            setImageError('Unable to connect to the server.');
        } finally {
            setIsUploadingImage(false);
        }
    }



    async function handleDeleteImage(image) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${image.filename}"?`
        );

        if (!confirmed) {
            return;
        }

        setImageDeleteError('');
        setImageDeleteSuccess('');

        try {
            const response = await fetch(
                `${API_URL}/api/images/${image.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (
                    response.status === 401 ||
                    data.message?.toLowerCase().includes('authentication required')
                ) {
                    window.alert(
                        'Your session has expired. Please log in again.'
                    );
                    return;
                }

                setImageDeleteError(data.message || 'Unable to delete image.');
                return;
            }

            await fetchImages();
            setImageDeleteSuccess('Image deleted successfully!');


            
            

        } catch (error) {
            console.error('Error deleting image:', error);
            setImageDeleteError('Unable to connect to the server.');
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
                            onClick={() => {
                                setActiveSection('users');
                                fetchUsers();
                            }}
                        >
                            Manage Users
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
                                        minLength={5}
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
                                        Service Image
                                    </label>

                                    {serviceForm.image_url && (
                                        <div className="admin-image-preview">
                                            <img
                                                src={serviceForm.image_url}
                                                alt={serviceForm.name || 'Service image'}
                                            />
                                            <p>Current image</p>
                                        </div>
                                    )}

                                    <label htmlFor="service-image" className="admin-image-upload-label">
                                        {serviceForm.image_url
                                            ? 'Select a file to change image'
                                            : 'Select a file to upload image'}
                                    </label>

                                    <input
                                        ref={serviceImageInputRef}
                                        id="service-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={(event) => {
                                            const file = event.target.files[0] || null;

                                            
                                            setServiceImageUploadError('');

                                            if (file) {
                                                handleUploadServiceImage(file);
                                            }
                                        }}
                                    />

                                    {isUploadingServiceImage && (
                                        <p>Uploading image...</p>
                                    )}

                                    {serviceImageUploadError && (
                                        <p className="admin-form-error">
                                            {serviceImageUploadError}
                                        </p>
                                    )}



                                    {servicesError && (
                                        <p className="admin-form-error">
                                            {servicesError}
                                        </p>
                                    )}

                                    <button 
                                        type="submit"
                                        className="admin-save-button"
                                        disabled={isSavingService || isUploadingServiceImage}
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
                                        Upload Staff Image
                                    </label>

                                    <input
                                        ref={staffImageInputRef}
                                        id="staff-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleStaffImageChange}
                                    />

                                    {staffImageUploadError && (
                                        <p className="admin-form-error">
                                            {staffImageUploadError}
                                        </p>
                                    )}

                                    {isUploadingStaffImage && (
                                        <p>Uploading staff image...</p>
                                    )}



                                    {staffForm.image_url && (
                                        <div className="admin-image-preview">
                                            <img
                                                src={staffForm.image_url}
                                                alt={staffForm.name || 'Staff image'}
                                            />
                                            <p>Current image</p>
                                        </div>
                                    )}


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
                            <p>Upload and manage the images displayed on the website.</p>

                            {/* Home Page Image */}
                            <div className="image-management-section">
                                <h3>Home Page Image</h3>
                                <p>
                                    Upload an image to display on the Home page.
                                </p>

                                <div className="current-image-preview">
                                    <p>Current Home Page Image:</p>
                                    <img
                                        className="current-image-preview-img"
                                        src="/images/Autumn-Car-roberto-nickson-unsplash - Copy.jpg"
                                        alt="Current Home page image"
                                    />
                                </div>

                                <form
                                    className="admin-staff-form"
                                    onSubmit={(event) => handleUploadImage(event, 'home')}
                                >
                                    <label htmlFor="home-image-file">
                                        Select Image
                                    </label>

                                    <input
                                        ref={imageFileInputRef}
                                        id="home-image-file"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={(event) => {
                                            setImageFile(event.target.files[0] || null);
                                            setImageError('');
                                            setImageSuccess('');
                                        }}
                                        required
                                    />

                                    {imageFile && (
                                        <p>
                                            Selected file: {imageFile.name}
                                        </p>
                                    )}

                                    <label htmlFor="home-image-alt-text">
                                        Image Alt Text
                                    </label>

                                    <input
                                        id="home-image-alt-text"
                                        type="text"
                                        value={imageAltText}
                                        onChange={(event) => {
                                            setImageAltText(event.target.value);
                                            setImageError('');
                                            setImageSuccess('');
                                        }}
                                        placeholder="Describe the image"
                                        maxLength={255}
                                        required
                                    />

                                    {imageError && (
                                        <p className="admin-form-error">
                                            {imageError}
                                        </p>
                                    )}

                                    {imageSuccess && (
                                        <p className="admin-form-success">
                                            {imageSuccess}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className="admin-save-button"
                                        disabled={isUploadingImage}
                                    >
                                        {isUploadingImage
                                            ? 'Uploading...'
                                            : 'Upload Home Page Image'}
                                    </button>
                                </form>
                            </div>


                            {/* About Page Image */}
                            <div className="image-management-section">
                                <h3>About Page Image</h3>
                                <p>
                                    Upload an image to display on the About page.
                                </p>

                                <div className="current-image-preview">
                                    <p>Current About Page Image:</p>
                                    <img
                                        className="current-image-preview-img"
                                        src="/images/car-workshop-tommy-anderson-unsplash.jpg"
                                        alt="Current About page image"
                                    />
                                </div>

                                <form
                                    className="admin-staff-form"
                                    onSubmit={(event) => handleUploadImage(event, 'about')}
                                >
                                    <label htmlFor="about-image-file">
                                        Select Image
                                    </label>

                                    <input
                                        ref={aboutImageInputRef}
                                        id="about-image-file"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={(event) => {
                                            setImageFile(event.target.files[0] || null);
                                            setImageError('');
                                            setImageSuccess('');
                                        }}
                                        required
                                    />

                                    {imageFile && (
                                        <p>
                                            Selected file: {imageFile.name}
                                        </p>
                                    )}

                                    <label htmlFor="about-image-alt-text">
                                        Image Alt Text
                                    </label>

                                    <input
                                        id="about-image-alt-text"
                                        type="text"
                                        value={imageAltText}
                                        onChange={(event) => {
                                            setImageAltText(event.target.value);
                                            setImageError('');
                                            setImageSuccess('');
                                        }}
                                        placeholder="Describe the image"
                                        maxLength={255}
                                        required
                                    />

                                    {imageError && (
                                        <p className="admin-form-error">
                                            {imageError}
                                        </p>
                                    )}

                                    {imageSuccess && (
                                        <p className="admin-form-success">
                                            {imageSuccess}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className="admin-save-button"
                                        disabled={isUploadingImage}
                                    >
                                        {isUploadingImage
                                            ? 'Uploading...'
                                            : 'Upload About Page Image'}
                                    </button>
                                </form>
                            </div>


                            {/* Image Library */}
                            <div className="image-management-section" 
                                ref={imageLibraryRef}
                            >
                                 
                                <h3>Image Library</h3>
                                <p>
                                    View the images currently stored on the website.
                                </p>

                                <button
                                    type="button"
                                    className="admin-save-button"
                                    onClick={fetchImages}
                                    disabled={imagesLoading}
                                >
                                    {imagesLoading ? 'Loading Images...' : 'Load Image Library'}
                                </button>

                                <form
                                    className="admin-staff-form"
                                    onSubmit={(event) => handleUploadImage(event, 'gallery')}
                                    >
                                    <label htmlFor="gallery-image-file">
                                        Select Image
                                    </label>

                                    <input
                                        ref={galleryImageInputRef}
                                        id="gallery-image-file"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={(event) => {
                                        setImageFile(event.target.files[0] || null);
                                        setImageError('');
                                        setImageSuccess('');
                                        }}
                                        required
                                    />

                                    {imageFile && (
                                        <p>Selected file: {imageFile.name}</p>
                                    )}

                                    <label htmlFor="gallery-image-alt-text">
                                        Image Alt Text
                                    </label>

                                    <input
                                        id="gallery-image-alt-text"
                                        type="text"
                                        value={imageAltText}
                                        onChange={(event) => {
                                        setImageAltText(event.target.value);
                                        setImageError('');
                                        setImageSuccess('');
                                        }}
                                        placeholder="Describe the image"
                                        maxLength={255}
                                        required
                                    />

                                    {imageError && (
                                        <p className="admin-form-error">{imageError}</p>
                                    )}

                                    {imageSuccess && (
                                        <p className="admin-form-success">{imageSuccess}</p>
                                    )}

                                    <button
                                        type="submit"
                                        className="admin-save-button"
                                        disabled={isUploadingImage}
                                    >
                                        {isUploadingImage ? 'Uploading...' : 'Upload to Image Library'}
                                    </button>
                                </form>

                                {imagesLoadError && (
                                    <p className="admin-form-error">
                                        {imagesLoadError}
                                    </p>
                                )}

                                {imageDeleteError && (
                                    <p 
                                        className="admin-form-error"
                                        ref={imageDeleteErrorRef}
                                    >
                                        {imageDeleteError}
                                    </p>
                                )}

                                {imageDeleteSuccess && (
                                    <p className="admin-form-success">
                                        {imageDeleteSuccess}
                                    </p>
                                )}

                                {imagesLoading && (
                                    <p>Loading images...</p>
                                )}

                                {!imagesLoading && imageList.length > 0 && (
                                    <div className="admin-staff-grid">
                                        {imageList.map((image) => (
                                            <div
                                                className="admin-staff-card"
                                                key={image.id}
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt={image.alt_text}
                                                />

                                                <div className="admin-staff-card-content">
                                                    <h4>{image.filename}</h4>

                                                    <p>
                                                        Type: {image.image_type || 'Gallery'}
                                                    </p>

                                                    <p>{image.alt_text}</p>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="admin-delete-button"
                                                    onClick={() => handleDeleteImage(image)}
                                                >
                                                    Delete Image
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!imagesLoading && imageList.length === 0 && (
                                    <p>No images loaded yet. Select "Load Image Library" to view them.</p>
                                )}
                            </div>
                        </section>
                    )}





                    
                    
                    {/* Manage Users */}
                    {activeSection === 'users' && (
                        <section className="admin-section">
                            <h2>Manage Users</h2>


                            {editingUserId !== null && (
                                
                                <form
                                    className="user-edit-form"
                                    onSubmit={handleSaveUser}
                                >
                                    <h3>Edit User</h3>

                                    <label>
                                        Name
                                        <input
                                            type="text"
                                            value={userForm.name}
                                            onChange={(event) =>
                                                setUserForm({
                                                    ...userForm,
                                                    name: event.target.value
                                                })
                                            }
                                        />
                                    </label>

                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            value={userForm.email}
                                            onChange={(event) =>
                                                setUserForm({
                                                    ...userForm,
                                                    email: event.target.value
                                                })
                                            }
                                        />
                                    </label>

                                    <label>
                                        Role
                                        <select
                                            value={userForm.role}
                                            onChange={(event) =>
                                                setUserForm({
                                                    ...userForm,
                                                    role: event.target.value
                                                })
                                            }
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </label>

                                    <button type="submit">
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEditingUserId(null)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}


                            {usersLoading && <p>Loading users...</p>}

                            {usersError && (
                                <p className="error-message">{usersError}</p>
                            )}

                            {!usersLoading && !usersError && userList.length === 0 && (
                                <p>No users found.</p>
                            )}

                            {!usersLoading && !usersError && userList.length > 0 && (
                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {userList.map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditUser(user)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteUser(user)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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