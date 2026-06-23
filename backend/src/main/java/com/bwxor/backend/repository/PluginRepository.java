package com.bwxor.backend.repository;

import com.bwxor.backend.entity.Plugin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PluginRepository extends MongoRepository<Plugin, String> {
}
