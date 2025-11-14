// frontend/src/pages/UserProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Sidebar from '../components/SidebarComponent';
import Navbar from '../components/Navbar';
import { formatDistanceToNow } from 'date-fns';
import { GET_USER_BY_USERNAME_URL } from '../ApiRoutes';

const UserProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(GET_USER_BY_USERNAME_URL(username));
        
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError('Failed to load user profile');
          toast.error(response.data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Error loading profile. Please try again later.');
        toast.error('Error loading profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <Loader />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] w-screen flex overflow-hidden">
        <Sidebar />
        <div className="w-full">
          <Navbar />
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-red-500 text-lg">
              {error || 'User not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] w-screen flex overflow-hidden">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <div className="w-full overflow-y-auto h-[calc(100vh-64px)] p-6">
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-6">
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.username} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {user.firstname} {user.lastname}
                  </h1>
                  <p className="text-gray-400">@{user.username}</p>
                  {user.title && (
                    <p className="text-purple-400 mt-1">{user.title}</p>
                  )}
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                    <span>{user.followers_count || 0} Followers</span>
                    <span>•</span>
                    <span>{user.following_count || 0} Following</span>
                    <span>•</span>
                    <span>Joined {formatDistanceToNow(new Date(user.createdAt))} ago</span>
                  </div>
                </div>
              </div>
              
              {user.bio && (
                <p className="mt-4 text-gray-300">{user.bio}</p>
              )}
            </div>

            {/* User Posts */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>
              {user.posts && user.posts.length > 0 ? (
                <div className="space-y-4">
                  {user.posts.map((post) => (
                    <div key={post._id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-white">{post.title}</h3>
                          <p className="text-gray-300 mt-1">{post.content}</p>
                        </div>
                        <span className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="mt-3 rounded-lg w-full max-h-64 object-cover"
                        />
                      )}
                      <div className="flex items-center mt-3 text-sm text-gray-400">
                        <span className="flex items-center mr-4">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.likes_count || 0}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {post.comments_count || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No posts yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserProfilePage };