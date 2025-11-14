import { useState } from "react"
import { BsImage, BsTags } from "react-icons/bs"
import { FaBitcoin, FaPencilAlt } from "react-icons/fa"
import { MdOutlinePreview, MdEdit, MdPublish } from "react-icons/md"
import { RiDraftLine } from "react-icons/ri"
import { UploadPicture } from "../utils/CloudinaryHandlers"
import LoaderwaveComponent from "./Loaderwave"
import axios from "axios"
import { UPLOAD_POST_URL } from "../ApiRoutes"
import { FetchUserProfile } from "../utils/AuthFunctions"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20 }
};

const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

const buttonTap = {
  scale: 0.98
};



export default function ContentEditor() {
  const [mode, setMode] = useState("write")
  const [content, setContent] = useState("")
  const [heading, setHeading] = useState("")
  const [tags, setTags] = useState("")
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailImage, setThumbnailImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    title: '',
    content: '',
    thumbnail: ''
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { title: '', content: '', thumbnail: '' }

    if (!heading.trim()) {
      newErrors.title = 'Title is required'
      isValid = false
    } else if (heading.length > 255) {
      newErrors.title = 'Title must be less than 255 characters'
      isValid = false
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required'
      isValid = false
    }

    if (!thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const navigate = useNavigate();

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleHeadingChange = (e) => {
    setHeading(e.target.value)
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(URL.createObjectURL(file))
      setThumbnailImage(file);
    }
  }

  const handlePublish = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.keys(errors).find(key => errors[key]);
      if (firstError) {
        document.querySelector(`[data-field="${firstError}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const uid = localStorage.getItem('POST.dev@accessToken');
      
      setIsUploading(true);
      const url = await UploadPicture(thumbnailImage);
      await axios.post(
        UPLOAD_POST_URL,
        {
          user_id: uid,
          title: heading,
          content: content,
          tags: tags.split("#").filter(tag => tag.trim() !== '').map((tag) => tag.trim()),
          image: url,
        },
        { headers: { Authorization: uid } }
      );

      await FetchUserProfile();
      navigate('/profile');
      
      // Reset form
      setHeading("");
      setContent("");
      setTags("");
      setThumbnail(null);
      setThumbnailImage(null);
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    // Implement draft saving logic here
    alert('Draft saved successfully!');
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length


  const UploadingModal = () => (
    <AnimatePresence>
      {isUploading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4"
          >
            <LoaderwaveComponent additionalStyling="w-full" />
            <motion.p 
              className="mt-4 text-xl font-medium text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Publishing your masterpiece...
            </motion.p>
            <p className="mt-2 text-zinc-400">This may take a moment</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Preview component
  const PostPreview = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <article className="prose prose-invert max-w-none">
          {thumbnail && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img 
                src={thumbnail} 
                alt="Post thumbnail" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 break-words">
              {heading || 'Your Post Title'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 text-sm text-zinc-400">
              <span>By You</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</span>
              <span>•</span>
              <span>{Math.ceil(content.split(/\s+/).length / 200) || 1} min read</span>
            </div>
          </header>

          <div className="prose prose-invert max-w-none text-zinc-300">
            {content ? (
              content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 leading-relaxed break-words">
                  {paragraph || 'Start writing to see your content here...'}
                </p>
              ))
            ) : (
              <p className="text-zinc-500 italic">
                Your content will appear here. Start writing to see a preview.
              </p>
            )}
          </div>

          {tags && (
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex flex-wrap gap-2">
                {tags.split('#').filter(tag => tag.trim() !== '').map((tag, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );

  return (
    <div className="min-h-fit w-full bg-gradient-to-br from-zinc-900 to-zinc-800">
      <UploadingModal />
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-white bg-clip-text text-transparent">
              Create New Post
            </h1>
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={handleSaveDraft}
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                disabled={isSubmitting}
              >
                <RiDraftLine className="h-4 w-4" />
                Save Draft
              </motion.button>
              <motion.button
                type="submit"
                form="post-form"
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                disabled={isSubmitting || isUploading}
              >
                <MdPublish className="h-4 w-4" />
                {isSubmitting || isUploading ? 'Publishing...' : 'Publish Now'}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form 
          id="post-form"
          onSubmit={handlePublish} 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Editor Column */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
          {/* Thumbnail Upload */}
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className={`relative group rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border-2 border-dashed ${
              errors.thumbnail ? 'border-red-500' : 'border-zinc-700 hover:border-blue-500/50'
            } transition-all duration-300 overflow-hidden`}
            data-field="thumbnail"
          >
            <label className="flex flex-col items-center justify-center p-8 cursor-pointer min-h-[200px] w-full">
              {errors.thumbnail && (
                <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                  {errors.thumbnail}
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleThumbnailChange} 
                required
              />
              {thumbnail ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <img 
                    src={thumbnail} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full">
                      <BsImage className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 p-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-700/50 group-hover:bg-blue-500/20 transition-colors">
                    <BsImage className="h-8 w-8 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">Upload a thumbnail</p>
                    <p className="mt-1 text-sm text-zinc-400">Drag & drop an image, or click to browse</p>
                    <p className="mt-2 text-xs text-zinc-500">Recommended: 1200x630px (16:9)</p>
                  </div>
                </div>
              )}
            </label>
          </motion.div>

          {/* Title Input */}
          <motion.div variants={fadeIn} className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
              Title <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  id="title"
                  type="text"
                  value={heading}
                  onChange={handleHeadingChange}
                  placeholder="Catchy title that captures attention"
                  className={`w-full px-5 py-4 text-xl font-semibold bg-zinc-800/50 border ${
                    errors.title ? 'border-red-500' : 'border-zinc-700'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-500 text-white transition-all`}
                  maxLength={255}
                  data-field="title"
                />
                <div className="absolute bottom-0 left-0 h-1 bg-zinc-700 rounded-full w-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((heading.length / 255) * 100, 100)}%`
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mt-1 flex justify-between items-center">
                  {errors.title && (
                    <span className="text-sm text-red-400">{errors.title}</span>
                  )}
                  <span className={`text-xs ml-auto ${
                    heading.length > 200 ? 'text-amber-400' : 'text-zinc-500'
                  }`}>
                    {heading.length}/255 characters
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Tabs */}
          <motion.div variants={fadeIn} className="border-b border-zinc-800">
            <nav className="flex space-x-6">
              <button
                type="button"
                onClick={() => setMode("write")}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  mode === "write"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-600"
                }`}
              >
                <FaPencilAlt className="h-4 w-4" />
                Write
              </button>
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  mode === "preview"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-600"
                }`}
              >
                <MdOutlinePreview className="h-5 w-5" />
                Preview
              </button>
            </nav>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            variants={fadeIn}
            className="rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800 shadow-lg"
          >
            {mode === "write" ? (
              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-medium text-zinc-300">
                    Content <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write your story..."
                        className={`min-h-[400px] w-full resize-none bg-zinc-900/50 border ${
                          errors.content ? 'border-red-500' : 'border-zinc-800'
                        } rounded-xl p-6 text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        data-field="content"
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        {errors.content && (
                          <span className="text-red-400 text-sm">{errors.content}</span>
                        )}
                        <span className="bg-zinc-800/80 backdrop-blur-sm text-xs text-zinc-400 px-2 py-1 rounded">
                          {content.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="tags" className="block text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <BsTags className="h-4 w-4" />
                      Tags
                    </label>
                    <span className="text-xs text-zinc-500">Separate with #</span>
                  </div>
                  <div className="relative">
                    <textarea
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="#webdev #react #design #programming"
                      className="min-h-[100px] w-full resize-none bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
                      {tags.split('#').filter(tag => tag.trim() !== '').length} tags
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="mb-8 flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {thumbnail ? (
                      <img 
                        src={thumbnail} 
                        alt="Article" 
                        className="h-20 w-20 rounded-xl object-cover shadow-lg" 
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg">
                        <FaBitcoin className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {heading || "Your Awesome Blog Post Title"}
                    </h2>
                    <div className="mt-2 flex items-center text-sm text-zinc-400">
                      <span>By You</span>
                      <span className="mx-2">•</span>
                      <span>{new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                      <span className="mx-2">•</span>
                      <span>{Math.ceil(content.split(/\s+/).length / 200) || 1} min read</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-zinc-300">
                  {content ? (
                    content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 leading-relaxed">
                        {paragraph || 'Start writing to see your content here...'}
                      </p>
                    ))
                  ) : (
                    <p className="text-zinc-500 italic">
                      Your content will appear here. Start writing to see a preview.
                    </p>
                  )}
                </div>

                {tags && (
                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.split('#').filter(tag => tag.trim() !== '').map((tag, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          </motion.div>

          {/* Preview Column */}
          <motion.div 
            variants={fadeIn}
            className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-hidden bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 shadow-xl"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MdOutlinePreview className="h-5 w-5 text-blue-400" />
                  Live Preview
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Changes appear as you type</p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <PostPreview />
              </div>
            </div>
          </motion.div>

          {/* Add custom scrollbar styles */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(255, 255, 255, 0.2);
            }
          `}</style>
        </form>
      </main>
    </div>
  )
}
