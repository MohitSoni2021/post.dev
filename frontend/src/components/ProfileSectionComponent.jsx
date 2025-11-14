import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Users, MapPin, Link as LinkIcon, Twitter, Github, Mail,
  Edit, AlertTriangle, RefreshCw
} from 'lucide-react';
import ProfileError from '../AdditionalNecessaryElements/ProfileError';
import { FetchUserProfile } from '../utils/AuthFunctions';
import { UserProfileStorageGetter } from '../utils/localStorageEncrypter';
import { UPDATE_USER_PROFILE_URL } from '../ApiRoutes';
import Loader from './Loader';
import { ToastContainer, toast } from 'react-toastify';
import { MdModeEditOutline } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { UploadPicture } from '../utils/CloudinaryHandlers';
import LoaderwaveComponent from './Loaderwave';
import { redirect, useNavigate } from 'react-router-dom';

// Utility function for generating avatar
const generateAvatar = (username) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'anonymous'}`;

// Initial state structure
let INITIAL_USER_STATE = {
  username: '',
  fullName: '',
  email: '',
  avatar: '',
  bio: '',
  title: '',
  followersCount: 0,
  followingCount: 0,
  socialLinks: {
    twitter: '',
    github: '',
    portfolio: ''
  }
};

const INITIAL_EDIT_STATE = {
  firstname: '',
  lastname: '',
  bio: '',
  title: '',
  socialLinks: {
    twitter: '',
    github: '',
    portfolio: ''
  }
};



const ProfileSectionComponent = () => {
  // State Management
  const [userData, setUserData] = useState(INITIAL_USER_STATE);
  const [editFormData, setEditFormData] = useState(INITIAL_EDIT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [popupProfileImageEdit, setPopupProfileImageEdit] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadingInProgress, setUploadingInProgress] = useState(false);
  const navigate = useNavigate()

  // Fetch User Profile
  const fetchUserProfile = useCallback(async () => {
    const uid = localStorage.getItem('POST.dev@accessToken');

    if (!uid) {
      setisLoggedIn(false);
      return;
    }

    try {
      const serverResponse = await UserProfileStorageGetter("postDevUserConfigs");
      const parsedData = JSON.parse(serverResponse.data);

      if (parsedData.status === 201) {
        setUserData(parsedData);
        setIsLoading(false);
        setisLoggedIn(true);
      } else {
        setIsError(true);
        setErrorMessage('Failed to fetch profile');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setIsError(true);
      setErrorMessage('Failed to fetch profile');
      setIsLoading(false);
    }
  }, []);

  // Open Edit Modal
  const handleEditModalOpen = () => {
    setEditFormData({
      firstname: userData.fullName.split(' ')[0] || '',
      lastname: userData.fullName.split(' ')[1] || '',
      bio: userData.bio || '',
      title: userData.title || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle Form Changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const linkType = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [linkType]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Submit Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile((prev) => !prev);
    const uid = localStorage.getItem('POST.dev@accessToken');

    try {
      await axios.put(
        UPDATE_USER_PROFILE_URL(uid),
        {
          firstname: editFormData.firstname,
          lastname: editFormData.lastname,
          bio: editFormData.bio,
          title: editFormData.title,
        },
        { headers: { Authorization: uid } }
      );

      // Update local state
      setUserData(prev => ({
        ...prev,
        fullName: `${editFormData.firstname} ${editFormData.lastname}`,
        bio: editFormData.bio,
        title: editFormData.title,
        socialLinks: editFormData.socialLinks
      }));

      setIsEditModalOpen(false);
      setIsUpdatingProfile((prev) => !prev);
      toast("Profile Updated Successfully", {
        style: {
          backgroundColor: '#21212A',    // Dark background
          color: '#fff',              // White text
          borderRadius: '10px',       // Rounded corners
          padding: '15px',            // Padding around toast
          fontSize: '16px',           // Font size
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', // Add shadow for effect
        }, progressStyle: {
          background: '#4caf50', // Green progress bar for success
        }
      })
    } catch (error) {
      console.error('Profile update error:', error);
    }
    finally{
      await FetchUserProfile()
      navigate('/profile')
    }

    


  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail((file))
    }
  }

  const UpdateUserProfile = async () => {
    setUploadingInProgress(true);
    const uid = localStorage.getItem('POST.dev@accessToken');
    const profileImageURL = await UploadPicture(thumbnail);
    console.log(profileImageURL);
    setUserData((prev) => ({...prev, avatar: profileImageURL}))
    try {
      await axios.put(
        UPDATE_USER_PROFILE_URL(uid),
        {
          profileimage: profileImageURL
        },
        { headers: { Authorization: uid } }
      );
      
      await FetchUserProfile()
      toast("Profile Image Updated Successfully", {
        style: {
          backgroundColor: '#21212A',    // Dark background
          color: '#fff',              // White text
          borderRadius: '10px',       // Rounded corners
          padding: '15px',            // Padding around toast
          fontSize: '16px',           // Font size
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', // Add shadow for effect
        }, progressStyle: {
          background: '#4caf50', // Green progress bar for success
        }
      })

    } catch (error) {
      console.log(error);
    } finally {
      
      setPopupProfileImageEdit(false);
      setUploadingInProgress(false);
      redirect('/profile')
    }


  }

  // Initial Data Fetch
  useEffect(() => {
    (async()=>await fetchUserProfile())();
    console.log(userData)
  }, [fetchUserProfile]);

  // Render Loading State
  if (isLoading) return (
    <div className="min-h-screen bg-[#18181E] flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading Profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#18181E] text-gray-100 flex justify-center py-12  w-full">

      <ToastContainer />

      {!isLoggedIn && (
        <ProfileError
          title="Profile Access Denied"
          message="Please log in to view your profile details"
        />
      )}

      {
        (popupProfileImageEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {uploadingInProgress ? (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
                <LoaderwaveComponent additionalStyling="w-full bg-gradient-to-r from-blue-500 to-purple-600" />
                <p className="mt-4 text-lg font-medium text-gray-200">Updating your profile picture...</p>
                <p className="text-sm text-gray-400 mt-1">This will just take a moment</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden w-full max-w-md">
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-bold text-white">Update Profile Picture</h3>
                  <p className="text-sm text-gray-400 mt-1">Upload a new image to update your profile</p>
                </div>
                
                {/* Upload Area */}
                <div className="p-6">
                  <label className="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-xl bg-gray-800/50 hover:border-blue-500 transition-all duration-300 cursor-pointer">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleThumbnailChange} 
                    />
                    {thumbnail ? (
                      <div className="relative w-full">
                        <img 
                          src={URL.createObjectURL(thumbnail)} 
                          alt="Profile preview" 
                          className="w-full h-48 rounded-lg object-cover border border-gray-700"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <BsImage className="h-10 w-10 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-700/50 p-4 mb-4 group-hover:bg-blue-500/20 transition-colors">
                          <BsImage className="h-10 w-10 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-medium text-white">Drag & drop your image</p>
                          <p className="text-sm text-gray-400">or click to browse files</p>
                          <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 p-6 pt-0">
                  <button
                    onClick={() => setPopupProfileImageEdit(false)}
                    className="flex-1 py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={UpdateUserProfile}
                    disabled={!thumbnail}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${thumbnail ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600/50 cursor-not-allowed'}`}
                  >
                    Update Picture
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      }

      <div className={`container  w-full px-4 ${(!isLoggedIn) ? 'hidden' : 'block'}`}>
        <div className="bg-[#1f1f28] w-full border-gray-700 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
          <div className="relative">
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#282834]/70 to-[#1f1f28]/90 opacity-90 pointer-events-none"></div>

            {/* Profile Content */}
            <div className="p-6 md:p-10 relative z-10 text-center">
              {/* Profile Header with Image and Basic Info */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4 ">
                  <div className="edit-icon-container border border-gray-500 p-2 text-2xl w-fit rounded-full absolute bottom-0 right-0 z-30 backdrop-blur-lg cursor-pointer" onClick={() => setPopupProfileImageEdit(true)}>
                    <MdModeEditOutline />
                  </div>
                  <div className=" w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg transform transition-transform duration-300 hover:scale-105">
                    <img
                      src={(userData.avatar) ? userData.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={`Profile of ${userData?.fullName || 'User'}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/default-avatar.png' }}
                    />
                  </div>
                  {/* Verified Badge */}
                  {userData?.isVerified && (
                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976c.418-.491.672-1.102.723-1.745a3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    {userData?.fullName || 'User Name Not Set'}
                  </h1>
                  <p className="text-gray-400 text-sm md:text-base">
                    {userData?.username ? `@${userData.username}` : 'Username Not Available'}
                  </p>
                </div>
              </div>

              {userData?.title && (
                <div className="bg-[#282834] rounded-xl p-3 flex items-center justify-center gap-3  mb-6 w-fit mx-auto">
                  <span className="text-gray-300 truncate text-center">{userData.title}</span>
                </div>
              )}

              {/* Bio and Edit Profile */}
              <div className="mb-6 space-y-4">
                {userData?.bio && (
                  <p className="text-gray-300 text-base max-w-xl mx-auto mb-4">
                    {userData.bio}
                  </p>
                )}

              </div>

              {/* Stats and Contact */}
              <div className="grid grid-cols-3 gap-4 mb-6 bg-[#282834] rounded-2xl p-4 shadow-inner">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <Users size={18} className="text-gray-400" />
                    <span className="font-semibold text-white">{userData?.followersCount || 0}</span>
                  </div>
                  <span className="text-gray-500 text-sm">Followers</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <span className="font-semibold text-white">{userData?.followingCount || 0}</span>
                  </div>
                  <span className="text-gray-500 text-sm">Following</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <span className="font-semibold text-white">{userData?.postsCount || 0}</span>
                  </div>
                  <span className="text-gray-500 text-sm">Posts</span>
                </div>
              </div>

              {/* Contact and Social Links */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  {userData?.email && (
                    <div className="bg-[#282834] rounded-xl p-3 flex items-center gap-3 shadow-md w-full">
                      <Mail size={18} className="text-gray-400" />
                      <span className="text-gray-300 truncate">{userData.email}</span>
                    </div>
                  )}

                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-6 mt-4">
                  {userData?.socialLinks?.twitter && (
                    <a
                      href={userData.socialLinks.twitter.startsWith('http')
                        ? userData.socialLinks.twitter
                        : `https://twitter.com/${userData.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter size={24} />
                    </a>
                  )}
                  {userData?.socialLinks?.github && (
                    <a
                      href={userData.socialLinks.github.startsWith('http')
                        ? userData.socialLinks.github
                        : `https://github.com/${userData.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={24} />
                    </a>
                  )}
                  {userData?.socialLinks?.portfolio && (
                    <a
                      href={userData.socialLinks.portfolio.startsWith('http')
                        ? userData.socialLinks.portfolio
                        : `https://${userData.socialLinks.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <LinkIcon size={24} />
                    </a>
                  )}

                  <div className='w-full'>
                    <button
                      onClick={handleEditModalOpen}
                      className="px-6 py-3 bg-blue-600 text-white rounded-full text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <Edit size={18} />
                      Edit Profile
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div 
              className={`bg-gradient-to-br from-[#1E1E2A] to-[#2A2A3A] rounded-2xl w-full max-w-lg mx-auto p-0 overflow-hidden shadow-2xl transform transition-all duration-300 ${
                isUpdatingProfile 
                  ? "w-40 h-40 flex items-center justify-center" 
                  : "max-h-[90vh] overflow-y-auto"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {isUpdatingProfile ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-300 font-medium">Updating Profile...</p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      Edit Profile
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Update your personal information</p>
                  </div>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">First Name</label>
                        <input
                          type="text"
                          name="firstname"
                          value={editFormData.firstname}
                          onChange={handleFormChange}
                          className="w-full bg-[#252533] text-gray-100 border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                          placeholder="John"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Last Name</label>
                        <input
                          type="text"
                          name="lastname"
                          value={editFormData.lastname}
                          onChange={handleFormChange}
                          className="w-full bg-[#252533] text-gray-100 border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-300">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleFormChange}
                        className="w-full bg-[#252533] text-gray-100 border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-300">Bio</label>
                        <span className="text-xs text-gray-500">{editFormData.bio?.length || 0}/250</span>
                      </div>
                      <textarea
                        name="bio"
                        value={editFormData.bio}
                        onChange={handleFormChange}
                        maxLength={250}
                        className="w-full bg-[#252533] text-gray-100 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 min-h-[120px] resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ProfileSectionComponent;

