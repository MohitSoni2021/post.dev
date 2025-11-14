import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GET_SINGLE_POST_URL } from '../ApiRoutes';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Sidebar from '../components/SidebarComponent';
import Navbar from '../components/Navbar';
import { formatDistanceToNow } from 'date-fns';

const PostDetailsPage = () => {
  const { postid } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${GET_SINGLE_POST_URL}/${postid}`);
        if (response.data.success) {
          setPost(response.data.data);
        } else {
          setError('Failed to load post');
          toast.error(response.data.message || 'Failed to load post');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Error loading post. Please try again later.');
        toast.error('Error loading post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (postid) {
      fetchPost();
    }
  }, [postid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <Loader />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] w-screen flex overflow-hidden">
        <Sidebar />
        <div className="w-full">
          <Navbar />
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-red-500 text-lg">
              {error || 'Post not found'}
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
            {/* Post Header */}
            <div className="p-6 border-b border-gray-800">
              <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
              <div className="flex items-center text-gray-400 text-sm">
                <img 
                  src={post.user_image || '/default-avatar.png'} 
                  alt={post.user_id} 
                  className="w-8 h-8 rounded-full mr-2 object-cover object-center"
                />
                <span className="font-medium text-white">{post.user_id}</span>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-6">
              {post.image && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-auto max-h-96 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  className={`flex items-center space-x-1 text-gray-400 hover:text-white transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{post.likes_count || 0}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.comments?.length || 0} comments</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
