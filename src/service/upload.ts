// import multer from 'multer';
// import path from 'path';

// const limits = {
//   fileSize: 2 * 1024 * 1024,
// };

// const fileFilter = (
//   _req: Request,
//   file: Express.Multer.File,
//   callback: multer.FileFilterCallback,
// ) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
//     return callback(new Error("檔案格式錯誤，僅限上傳 jpg、png 與 jpeg 格式。"));
//   }

//   return callback(null, true);
// };

// export const upload = multer({ limits, fileFilter }).any();