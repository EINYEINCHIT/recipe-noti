import { appApi, getAxiosAuthToken } from "./axios.service";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import { UploadResponse } from "@/types";

export const FILE_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB

export const FILE_TYPE: Record<
  'image' | 'video' | 'application',
  readonly string[]
> = {
  image: ["PNG", "JPEG", "JPG"],
  video: ["MP4"],
  application: ["PDF", "DOC", "DOCX"],
};

type FileType = keyof typeof FILE_TYPE;

export const getFileType = (filename: string): FileType | undefined => {
  const extension = filename.split(".").pop()?.toUpperCase();
  if (!extension) return;

  for (const [key, value] of Object.entries(FILE_TYPE)) {
    if ((value as readonly string[]).includes(extension)) {
      return key as FileType;
    }
  }
};

export type AppFileType = "chat" | "machine" | "recipes";

export const getBase64File = async (
  type: AppFileType,
  filename: string,
  roomId?: string
): Promise<string | null> => {
  try {
    let url: string;
    switch (type) {
      case "chat":
        if (!roomId) throw new Error("roomId is required for chat files");
        url = `${API_ENDPOINTS.file.chat}/${filename}?room_id=${roomId}`;
        break;
      case "machine":
        url = `${API_ENDPOINTS.file.machine}/${filename}`;
        break;
      case "recipes":
        url = `${API_ENDPOINTS.file.recipes}/${filename}`;
        break;
      default:
        throw new Error("Invalid file type");
    }

    // Download blob
    const response = await appApi.get(url, { responseType: "blob" });

    // Convert blob to base64
    const reader = new FileReader();
    const blob: Blob = response.data;

    const base64: string = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return base64;
  } catch (err: any) {
    console.warn("Get Base64 File Error: ", err);
    return null;
  }
};

const getMimeType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toUpperCase();
  switch (extension) {
    case "PNG":
      return "image/png";
    case "JPG":
    case "JPEG":
      return "image/jpeg";
    case "MP4":
      return "video/mp4";
    case "PDF":
      return "application/pdf";
    case "DOC":
      return "application/msword";
    case "DOCX":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};

export const downloadFile = async (
  url: string,
  displayName: string,
  roomId: string
): Promise<string> => {
  try {
    const token = getAxiosAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const path = `${API_ENDPOINTS.file.chat}/${url}?room_id=${Number(roomId)}`;

    const downloadUrl = `${API_BASE_URL}${path}`;

    // First download into app cache
    const baseDir = FileSystem.cacheDirectory || "";
    const fileUri = `${baseDir}${displayName}`;

    const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri, {
      headers,
    });

    // On Android, let the user choose a directory (e.g. Downloads) via SAF
    if (Platform.OS === "android") {
      const permissions =
        await (FileSystem as any).StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        // Fall back to cached file only
        return uri;
      }

      const mimeType = getMimeType(displayName);

      // Read downloaded file as base64
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: (FileSystem as any).EncodingType.Base64,
      });

      // Create file in chosen directory
      const destinationUri =
        await (FileSystem as any).StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          displayName,
          mimeType
        );

      await FileSystem.writeAsStringAsync(destinationUri, fileContent, {
        encoding: (FileSystem as any).EncodingType.Base64,
      });

      return destinationUri;
    }

    // iOS or other platforms: return cached file path
    return uri;
  } catch (err: any) {
    throw err;
  }
};

export const uploadFile = async (data: FormData) => {
  const response = await appApi.post<{ content: UploadResponse }>(
    `${API_ENDPOINTS.file.upload}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.content;
};
