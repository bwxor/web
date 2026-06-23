package com.bwxor.backend.service;

import com.bwxor.backend.entity.Plugin;
import com.bwxor.backend.repository.PluginRepository;
import com.bwxor.backend.reqres.ServiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PluginService {
    @Autowired
    private PluginRepository pluginRepository;

    @Cacheable(value = "plugins", unless = "#result == null || #result.item() == null || #result.item().isEmpty()")
    public ServiceResponse<List<Plugin>> findAll() {
        List<Plugin> plugins = pluginRepository.findAll();
        return ServiceResponse.ofItem(plugins);
    }
}


