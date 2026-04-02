import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'clipboard_transfer',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip'],
    resource_type: 'auto', // automatically detect image/video/raw
    public_id: (req, file) => `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`,
  },
});

export { cloudinary, storage };