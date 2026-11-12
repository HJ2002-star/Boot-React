package org.zerock.mallapi.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import net.coobird.thumbnailator.Thumbnails;

@Component
public class CustomFileUtil {

    @Value("${org.zerock.upload.path}")
    private String uploadPath;

    private Path uploadRoot;

    // PDF 6쪽: 업로드 폴더 생성
    @PostConstruct
    public void init() {
        uploadRoot = Paths.get(uploadPath).toAbsolutePath().normalize();

        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new IllegalStateException("업로드 폴더 생성 실패", e);
        }
    }

    // 업로드 폴더 내부의 파일만 접근
    private Path resolveFile(String fileName) {
        Path path = uploadRoot.resolve(fileName).normalize();

        if (!path.startsWith(uploadRoot)) {
            throw new IllegalArgumentException("잘못된 파일 경로입니다.");
        }

        return path;
    }

    // PDF 7·10~11쪽: 파일 저장과 썸네일 생성
    public List<String> saveFiles(List<MultipartFile> files) {
        List<String> uploadNames = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return uploadNames;
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            String originalName = file.getOriginalFilename();

            if (originalName == null || originalName.isBlank()) {
                originalName = "file";
            }

            originalName = originalName.replace('\\', '/');
            originalName = originalName.substring(
                originalName.lastIndexOf('/') + 1
            );

            String savedName = UUID.randomUUID() + "_" + originalName;
            Path savePath = resolveFile(savedName);

            try {
                try (InputStream input = file.getInputStream()) {
                    Files.copy(input, savePath);
                }

                String contentType = file.getContentType();

                if (contentType != null
                        && contentType.startsWith("image/")) {

                    Path thumbnailPath = resolveFile("s_" + savedName);

                    Thumbnails.of(savePath.toFile())
                        .size(200, 200)
                        .toFile(thumbnailPath.toFile());
                }

                uploadNames.add(savedName);
            } catch (IOException e) {
                throw new IllegalStateException("파일 저장 실패", e);
            }
        }

        return uploadNames;
    }

    // PDF 12쪽: 파일 응답
    public ResponseEntity<Resource> getFile(String fileName) {
        Path path = resolveFile(fileName);

        if (!Files.isRegularFile(path)) {
            path = resolveFile("default.jpeg");
        }

        if (!Files.isRegularFile(path)) {
            return ResponseEntity.notFound().build();
        }

        try {
            String contentType = Files.probeContentType(path);

            MediaType mediaType = contentType == null
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(contentType);

            Resource resource = new FileSystemResource(path);

            return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // PDF 15쪽: 원본과 썸네일 삭제
    public void deleteFiles(List<String> fileNames) {
        if (fileNames == null || fileNames.isEmpty()) {
            return;
        }

        for (String fileName : fileNames) {
            try {
                Files.deleteIfExists(resolveFile(fileName));
                Files.deleteIfExists(resolveFile("s_" + fileName));
            } catch (IOException e) {
                throw new IllegalStateException("파일 삭제 실패", e);
            }
        }
    }
}