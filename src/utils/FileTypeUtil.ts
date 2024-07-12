const getFileTypeIcon = (fileType: string): string => {
  if (!fileType) return 'file-document-outline';
  if (fileType.includes('image')) return 'image-outline';
  if (fileType.includes('video')) return 'video-outline';
  if (fileType.includes('text')) return 'text-box-outline';
  return 'file-document-outline';
};

const getFileType = (fileType: string | undefined): string => {
  if (!fileType) return '';
  if (fileType.includes('image')) return 'image';
  if (fileType.includes('video')) return 'video';
  if (fileType.includes('text')) return 'text';
  return '';
};

const getFileTypeSimple = (fileType: string): string => {
  if (!fileType) return 'file';
  if (fileType.includes('image')) return 'image';
  if (fileType.includes('video')) return 'video';
  if (fileType.includes('text')) return 'text';
  return 'file';
};

const FileTypeUtil = {
  getFileTypeIcon,
  getFileType,
  getFileTypeSimple,
};

export { FileTypeUtil };
