import axios from "axios";
import { Bitcoin, MessageSquare, ThumbsUp, Link2, Bookmark, BookmarkCheck } from "lucide-react"
import { useState } from "react"
import { LIKE_A_POST_URL, UNLIKE_A_POST_URL } from "../ApiRoutes";
import { FetchUserProfile } from "../utils/AuthFunctions";
import PostCommentPopUp from "./PostCommentPopUp";

export default function GenericCardComponent({title, desc, image, likes_count, comments_count, postID, user_image, isLiked=false }) {
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes_count);
  const [openPostCommentModel, setOpenPostCommentModel] = useState(false);



  const handleLikeToggle = async() => {
    const uid = localStorage.getItem('POST.dev@accessToken');
    setLiked(!liked);
    setCurrentLikes(liked ? currentLikes - 1 : currentLikes + 1);
    if(liked){
      UNLIKE_A_POST_URL
      try {
        const data = await axios.patch(UNLIKE_A_POST_URL(postID),{},
        { headers: { Authorization: uid } }
        )        
        console.log("working")
      } catch (error) {
          console.log(error)
      }finally{
        await FetchUserProfile()
      }
    }else {
      console.log("unliked")
      console.log(postID)
      console.log(uid)
      try {
        const data = await axios.patch(LIKE_A_POST_URL(postID),{},
        { headers: { Authorization: uid } }
        )        
        console.log("working")
      } catch (error) {
          console.log(error)
      } finally {
        await FetchUserProfile()
      }
    }
    
  };

  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-zinc-700 group hover:-translate-y-0.5">
      {/* Post Comment Model */}
      {openPostCommentModel && (
        <PostCommentPopUp postID={postID} CommentModelStateSetter={setOpenPostCommentModel} />
      )}

      {/* Header with User Info */}
      <div className="p-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 transition-opacity -z-10"></div>
            <img 
              src={user_image} 
              alt="User" 
              className="w-12 h-12 rounded-full border-2 border-zinc-800 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-white truncate leading-tight">{title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-zinc-800/80 text-zinc-300 px-2.5 py-1 rounded-full">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent font-medium">
                @{title?.split(' ')[0].toLowerCase() || 'user'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-5 pb-4">
        <p className="text-sm text-zinc-300 mb-4 leading-relaxed line-clamp-3">
          {desc || 'No description available for this post.'}
        </p>
        {image && (
          <div className="relative h-56 w-full overflow-hidden rounded-xl bg-zinc-800/50 group-hover:bg-zinc-800/70 transition-colors">
            <img
              src={image}
              alt="Post content"
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-3 border-t border-zinc-800/50 bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                liked 
                  ? "text-blue-400 hover:text-blue-300 bg-blue-500/10" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <ThumbsUp className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </button>
            <span className="text-xs font-medium text-zinc-300 ml-1">{currentLikes}</span>
            
            <button 
              onClick={() => setOpenPostCommentModel(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <span className="text-xs font-medium text-zinc-300 ml-1">{comments_count}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-full transition-all duration-300 ${
                bookmarked 
                  ? "text-yellow-400 hover:text-yellow-300 bg-yellow-500/10" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </button>
            <button 
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // You might want to add a toast notification here
              }}
            >
              <Link2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}