package com.foodbyte.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class UploadsWebConfig implements WebMvcConfigurer {

    @Value("${app.media.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${app.media.public-path:/uploads}")
    private String publicPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path = normalizePublicPath(publicPath);
        Path base = Paths.get(uploadDir).toAbsolutePath().normalize();
        String location = base.toUri().toString();
        registry.addResourceHandler(path + "/**")
                .addResourceLocations(location);
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
}