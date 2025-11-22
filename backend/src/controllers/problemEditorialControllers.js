import cloudinary from "cloudinary";
import Problem from "../models/problemSchema.js";
import Editorial from "../models/problemEditorialSchema.js";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

cloudinary.config(cloudinaryConfig);

const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `algoforge-solutions/${problemId}/${userId}_${timestamp}`;

    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.API_KEY,
      cloud_name: process.env.CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/video/upload`,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Failed to generate upload signature" });
  }
};

const saveFileMetadata = async (req, res) => {
  try {
    const { problemId, publicId, secureUrl, duration, fileType } = req.body;

    console.log("saveFileMetadata request body:", req.body);
    console.log("User from req:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized - No user found" });
    }

    const userId = req.user._id;

    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Check if the file already exists for this problem and user
    const existingFile = await Editorial.findOne({
      problemId,
      userId,
      publicId,
    });

    if (existingFile) {
      return res.status(409).json({ error: `${fileType} already exists` });
    }

    // Generate thumbnail URL from Cloudinary
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [
        {
          width: 400,
          height: 225,
          crop: "fill",
        },
        {
          quality: "auto",
        },
      ],
      format: "jpg"
    });

    const newFile = new Editorial({
      problemId,
      userId,
      publicId,
      secureUrl,
      duration: duration || 0,
      thumbnailUrl,
      fileType: fileType || "video"
    });
    
    console.log("Saving new editorial:", newFile);
    await newFile.save();
    console.log("Editorial saved successfully:", newFile);
    
    res.status(200).json({ 
      message: `${fileType} saved successfully`,
      id: newFile._id,
      thumbnailUrl: newFile.thumbnailUrl,
      secureUrl: newFile.secureUrl,
      duration: newFile.duration,
      uploadedAt: newFile.createdAt
    });
  } catch (error) {
    console.error("Error saving file metadata:", error);
    res.status(500).json({ error: `Failed to save file metadata: ${error.message}` });
  }
};

const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user._id;

        const file = await Editorial.findByIdAndDelete(fileId);

        if (!file) {
            return res.status(404).json({ error: 'File not found'});
        }

        await cloudinary.uploader.destroy(file.publicId, { resource_type: file.fileType, invalidate: true });

        res.json({ message: 'File deleted successfully' });

    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

const getEditorials = async (req, res) => {
    try {
        const { problemId } = req.params;

        const editorials = await Editorial.find({ problemId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ 
            success: true,
            editorials 
        });

    } catch (error) {
        console.error('Error fetching editorials:', error);
        res.status(500).json({ error: 'Failed to fetch editorials' });
    }
};

export { generateUploadSignature, saveFileMetadata, deleteFile, getEditorials };
