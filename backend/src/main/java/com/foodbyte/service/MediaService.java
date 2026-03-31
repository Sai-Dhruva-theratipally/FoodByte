package com.foodbyte.service;

import com.foodbyte.dto.MediaStatusResponse;
import com.foodbyte.dto.MediaUploadResponse;
import com.foodbyte.exception.ConflictException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${app.media.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${app.media.public-path:/uploads}")
    private String publicPath;

    @Value("${app.media.default-folder:foodbyte}")
    private String defaultFolder;

    public MediaStatusResponse getStatus() {
        Path base = getBaseUploadPath();
        boolean exists = Files.exists(base);
        return MediaStatusResponse.builder()
                .configured(true)
                .pingOk(true)
                .folder(defaultFolder)
                .message("Local media storage" + (exists ? "" : " (directory will be created on first upload)") + ": " + base)
                .build();
    }

    public MediaUploadResponse uploadImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new ConflictException("File is required");
        }

        String useFolder = normalizeFolder((folder == null || folder.isBlank()) ? defaultFolder : folder);
        Path base = getBaseUploadPath();
        Path targetDir = resolveSafeSubdir(base, useFolder);

        String ext = getImageExtension(file.getOriginalFilename(), file.getContentType());
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path dest = targetDir.resolve(filename);

        try {
            Files.createDirectories(targetDir);
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new ConflictException("Upload failed: " + e.getMessage());
        }

        String relativePath = useFolder + "/" + filename;
        String normalizedPublicPath = normalizePublicPath(publicPath);

        String url = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path(normalizedPublicPath + "/" + relativePath)
                .toUriString();

        return MediaUploadResponse.builder()
                .url(url)
                .publicId(relativePath)
                .resourceType("image")
                .build();
    }

    private Path getBaseUploadPath() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    private static String normalizePublicPath(String path) {
        if (path == null || path.isBlank()) {
            return "/uploads";
        }
        String p = path.trim();
        if (!p.startsWith("/")) p = "/" + p;
        while (p.endsWith("/")) p = p.substring(0, p.length() - 1);
        return p;
    }

    private static String normalizeFolder(String folder) {
        String f = folder == null ? "" : folder.trim();
        f = f.replace('\\', '/');
        while (f.startsWith("/")) f = f.substring(1);
        while (f.endsWith("/")) f = f.substring(0, f.length() - 1);
        if (f.isBlank()) {
            throw new ConflictException("Folder is required");
        }
        if (f.contains("..") || f.contains(":") || f.startsWith("~")) {
            throw new ConflictException("Invalid folder");
        }
        if (!f.matches("[a-zA-Z0-9/_-]+")) {
            throw new ConflictException("Invalid folder");
        }
        return f;
    }

    private static Path resolveSafeSubdir(Path base, String subdir) {
        Path dir = base.resolve(subdir).normalize();
        if (!dir.startsWith(base)) {
            throw new ConflictException("Invalid folder");
        }
        return dir;
    }

    private static String getImageExtension(String originalFilename, String contentType) {
        String ext = null;
        if (originalFilename != null) {
            String name = originalFilename.trim();
            int dot = name.lastIndexOf('.');
            if (dot >= 0 && dot < name.length() - 1) {
                ext = name.substring(dot + 1).toLowerCase(Locale.ROOT);
            }
        }

        if (ext == null || ext.isBlank()) {
            ext = extFromContentType(contentType);
        }

        if (ext == null) {
            throw new ConflictException("Unsupported image type");
        }

        return switch (ext) {
            case "jpg", "jpeg" -> ".jpg";
            case "png" -> ".png";
            case "webp" -> ".webp";
            case "gif" -> ".gif";
            default -> throw new ConflictException("Unsupported image type: " + ext);
        };
    }

    private static String extFromContentType(String contentType) {
        if (contentType == null) return null;
        String ct = contentType.toLowerCase(Locale.ROOT);
        if (ct.contains("image/jpeg")) return "jpg";
        if (ct.contains("image/png")) return "png";
        if (ct.contains("image/webp")) return "webp";
        if (ct.contains("image/gif")) return "gif";
        return null;
    }
}
