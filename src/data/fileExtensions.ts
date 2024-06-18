const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']
const videoExtensions = ['mp4', 'avi', 'mkv', 'webm', 'mov']
const audioExtensions = ['mp3', 'wav', 'ogg', 'flac']
const pdfExtensions = ['pdf']
const wordExtensions = ['doc', 'docx']
const excelExtensions = ['xls', 'xlsx']
const powerpointExtensions = ['ppt', 'pptx']
const archiveExtensions = ['zip', 'rar', 'tar', 'gz', '7z']
const textExtensions = ['txt']

export enum FileExtension {
	Image = 'image',
	Video = 'video',
	Audio = 'audio',
	Pdf = 'pdf',
	Word = 'word',
	Excel = 'excel',
	Powerpoint = 'powerpoint',
	Archive = 'archive',
	Text = 'text',
}

export const fileExtensionMap: Record<FileExtension, string[]> = {
	[FileExtension.Image]: imageExtensions,
	[FileExtension.Video]: videoExtensions,
	[FileExtension.Audio]: audioExtensions,
	[FileExtension.Pdf]: pdfExtensions,
	[FileExtension.Word]: wordExtensions,
	[FileExtension.Excel]: excelExtensions,
	[FileExtension.Powerpoint]: powerpointExtensions,
	[FileExtension.Archive]: archiveExtensions,
	[FileExtension.Text]: textExtensions,
}
