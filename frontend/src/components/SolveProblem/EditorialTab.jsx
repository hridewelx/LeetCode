import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import { toast, Toaster } from "react-hot-toast";

const EditorialTab = ({ problem }) => {
  const { user, isAuthenticated } = useSelector((state) => state.authentication);
  const isAdmin = user?.role === "admin";

  const [editorials, setEditorials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);

  const problemId = problem?._id;
  // console.log(problemId);

  useEffect(() => {
    if (problemId) {
      fetchEditorials();
    }
  }, [problemId]);

  const fetchEditorials = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosClient.get(`/editorial/fetch/${problem._id}`);
      setEditorials(data.editorials || []);
    } catch (error) {
      console.error("Error fetching editorials:", error);
      toast.error("Failed to load editorials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error("Video size must be less than 100MB");
      return;
    }

    setSelectedVideo(file);
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      toast.error("Please select a video file");
      return;
    }

    if (!isAuthenticated || !isAdmin) {
      toast.error("You must be an admin to upload videos");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Step 1: Get upload signature from backend
      const { data: signatureData } = await axiosClient.get(
        `/editorial/create/${problem._id}`
      );

      // Step 2: Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedVideo);
      formData.append("api_key", signatureData.api_key);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);
      formData.append("public_id", signatureData.public_id);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status === 200) {
          const cloudinaryResponse = JSON.parse(xhr.responseText);

          // Step 3: Save metadata to backend
          try {
            await axiosClient.post("/editorial/save", {
              problemId: problem._id,
              publicId: cloudinaryResponse.public_id,
              secureUrl: cloudinaryResponse.secure_url,
              duration: cloudinaryResponse.duration,
              fileType: "video",
            });

            toast.success("Video uploaded successfully!");
            setSelectedVideo(null);
            setUploadProgress(0);
            fetchEditorials();
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          } catch (error) {
            console.error("Error saving metadata:", error);
            const errorMessage = error.response?.data?.error || error.message || "Failed to save video metadata";
            console.error("Detailed error:", errorMessage);
            toast.error(errorMessage);
          }
        } else {
          toast.error("Upload failed. Please try again.");
        }
        setIsUploading(false);
      });

      xhr.addEventListener("error", () => {
        toast.error("Upload failed. Please check your connection.");
        setIsUploading(false);
      });

      xhr.open("POST", signatureData.upload_url);
      xhr.send(formData);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (editorialId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await axiosClient.delete(`/editorial/delete/${editorialId}`);
      toast.success("Video deleted successfully");
      fetchEditorials();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.error || "Failed to delete video");
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading editorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-full">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Video Editorial</h2>
        <p className="text-slate-400 text-sm">
          Watch detailed video explanations and solutions for this problem
        </p>
      </div>

      {/* Admin Upload Section */}
      {isAuthenticated && isAdmin && (
        <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload New Video
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className={`flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 cursor-pointer hover:bg-slate-600 transition-colors ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {selectedVideo
                  ? selectedVideo.name
                  : "Choose video file (Max 100MB)"}
              </label>
              <button
                onClick={handleUpload}
                disabled={!selectedVideo || isUploading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Videos List */}
      {editorials.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No Videos Available
          </h3>
          <p className="text-slate-500">
            {isAdmin
              ? "Upload the first video editorial for this problem"
              : "Video editorials will be available soon"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {editorials.map((editorial) => (
            <div
              key={editorial._id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
            >
              <div className="aspect-video bg-slate-900 relative group">
                <video
                  controls
                  className="w-full h-full"
                  poster={editorial.thumbnailUrl}
                  preload="metadata"
                >
                  <source src={editorial.secureUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDuration(editorial.duration)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span>{formatDate(editorial.createdAt)}</span>
                      {editorial.userId && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {editorial.userId.name || editorial.userId.email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(editorial._id)}
                      className="ml-4 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete video"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorialTab;
