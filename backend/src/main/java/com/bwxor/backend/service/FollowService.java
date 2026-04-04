package com.bwxor.backend.service;

import com.bwxor.backend.dto.follow.CreateFollowDto;
import com.bwxor.backend.dto.follow.DeleteFollowDto;
import com.bwxor.backend.dto.follow.ListFollowDto;
import com.bwxor.backend.entity.Follow;
import com.bwxor.backend.entity.User;
import com.bwxor.backend.repository.FollowRepository;
import com.bwxor.backend.repository.ProfileRepository;
import com.bwxor.backend.repository.UserRepository;
import com.bwxor.backend.reqres.ServiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FollowService {
    @Autowired
    private FollowRepository followRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProfileRepository profileRepository;

    public ServiceResponse<Follow> createFollow(CreateFollowDto createFollowDto) {
        String toId = createFollowDto.toId();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();
                Optional<User> userOptional = userRepository.findByEmail(email);

                if (userOptional.isEmpty()) {
                    return ServiceResponse.ofError(Follow.class, "Error fetching info for authenticated user.");
                }

                String id = userOptional.get().getId();

                Optional<User> toUser = userRepository.findById(toId);

                if (toUser.isEmpty()) {
                    toUser = userRepository.findByEmail(toId);

                    if (toUser.isEmpty()) {
                        return ServiceResponse.ofError(Follow.class, "Error fetching info for specified user id or email address.");
                    }
                }

                var follow = followRepository.findFirstByFromIdAndToId(id, toUser.get().getId());

                if (follow.isPresent()) {
                    return ServiceResponse.ofError(Follow.class, "Follow from specified id to specified id already exists.");
                }

                var profile = profileRepository.findByEmail(userOptional.get().getUsername());

                if (profile.isEmpty()) {
                    return ServiceResponse.ofError(Follow.class, "Could not fetch profile data for the authenticated user.");
                }

                Follow followToCreate = new Follow(id, toUser.get().getId(), profile.get().getDisplayName());
                followRepository.insert(followToCreate);

                return ServiceResponse.ofItem(followToCreate);
            } else {
                return ServiceResponse.ofError(Follow.class, "Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError(Follow.class, "You are not authenticated.");
        }
    }

    public ServiceResponse<Follow> deleteFollow(DeleteFollowDto deleteFollowDto) {
        String toId = deleteFollowDto.toId();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();
                Optional<User> userOptional = userRepository.findByEmail(email);

                if (userOptional.isEmpty()) {
                    return ServiceResponse.ofError(Follow.class, "Error fetching info for authenticated user.");
                }

                String id = userOptional.get().getId();

                var toUser = userRepository.findById(toId);

                if (toUser.isEmpty()) {
                    toUser = userRepository.findByEmail(toId);

                    if (toUser.isEmpty()) {
                        return ServiceResponse.ofError(Follow.class, "Error fetching info for specified user id or email address.");
                    }
                }

                var follow = followRepository.findFirstByFromIdAndToId(id, toUser.get().getId());

                if (follow.isEmpty()) {
                    return ServiceResponse.ofError(Follow.class, "Follow from specified id to specified id does not exist.");
                }

                followRepository.delete(follow.get());
                return ServiceResponse.ofItem(follow.get());
            } else {
                return ServiceResponse.ofError(Follow.class, "Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError(Follow.class, "You are not authenticated.");
        }
    }

    public ServiceResponse<Long> findCountByKey(String toKey) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();
                Optional<User> userOptional = userRepository.findByEmail(email);

                if (userOptional.isEmpty()) {
                    return ServiceResponse.ofError(Long.class, "Error fetching info for authenticated user.");
                }

                Optional<User> toUser = userRepository.findById(toKey);

                if (toUser.isEmpty()) {
                    toUser = userRepository.findByEmail(toKey);

                    if (toUser.isEmpty()) {
                        return ServiceResponse.ofError(Long.class, "Error fetching info for specified user id or email address.");
                    }
                }

                var count = followRepository.countByToId(toUser.get().getId());
                return ServiceResponse.ofItem(count);
            } else {
                return ServiceResponse.ofError(Long.class, "Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError(Long.class, "You are not authenticated.");
        }
    }

    public ServiceResponse<Boolean> findFollowStatus(String toKey) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();
                Optional<User> userOptional = userRepository.findByEmail(email);

                if (userOptional.isEmpty()) {
                    return ServiceResponse.ofError(Boolean.class, "Error fetching info for authenticated user.");
                }

                Optional<User> toUser = userRepository.findById(toKey);

                if (toUser.isEmpty()) {
                    toUser = userRepository.findByEmail(toKey);

                    if (toUser.isEmpty()) {
                        return ServiceResponse.ofError(Boolean.class, "Error fetching info for specified user id or email address.");
                    }
                }

                var followResponse = followRepository.findFirstByFromIdAndToId(userOptional.get().getId(), toUser.get().getId());
                return ServiceResponse.ofItem(followResponse.isPresent());
            } else {
                return ServiceResponse.ofError(Boolean.class, "Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError(Boolean.class, "You are not authenticated.");
        }
    }

    public ServiceResponse<List<ListFollowDto>> findFollowers(String key) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails) {
                Optional<User> toUser = userRepository.findById(key);

                if (toUser.isEmpty()) {
                    toUser = userRepository.findByEmail(key);

                    if (toUser.isEmpty()) {
                        return ServiceResponse.ofError("Error fetching info for specified user id or email address.");
                    }
                }

                var followers = followRepository.findByToId(toUser.get().getId());
                return ServiceResponse.ofItem(followers.stream().map(f -> new ListFollowDto(f.getFromId(), f.getFromName())).toList());
            } else {
                return ServiceResponse.ofError("Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError("You are not authenticated.");
        }
    }
}
