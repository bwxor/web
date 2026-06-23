package com.bwxor.backend.controller;

import com.bwxor.backend.service.PluginService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name="Plugins")
@RequestMapping("/api/plugins")
@CrossOrigin(origins="*")
public class PluginController {
    @Autowired
    private PluginService pluginService;

    @GetMapping
    public ResponseEntity<?> getAllPlugins() {
        var findPluginsResponse = pluginService.findAll();

        if (findPluginsResponse.ok()) {
            return ResponseEntity.ok(findPluginsResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", findPluginsResponse.serviceError().message()));
    }
}


