package com.bwxor.backend.service;

import com.bwxor.backend.dto.comment.CommentResponseDto;
import com.bwxor.backend.dto.comment.CreateCommentRequestDto;
import com.bwxor.backend.dto.comment.DeleteCommentRequestDto;
import com.bwxor.backend.entity.Comment;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.entity.User;
import com.bwxor.backend.repository.CommentRepository;
import com.bwxor.backend.repository.PageRepository;
import com.bwxor.backend.repository.ProfileRepository;
import com.bwxor.backend.repository.UserRepository;
import com.bwxor.backend.reqres.ServiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PageRepository pageRepository;
    @Autowired
    private CommentRepository commentRepository;

    private boolean diffLessThan2MinutesFromNow(LocalDateTime from) {
        return Duration.between(from, LocalDateTime.now())
                .compareTo(Duration.of(2, ChronoUnit.MINUTES)) < 0;
    }

    public ServiceResponse<Comment> createComment(CreateCommentRequestDto createCommentDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();

                Optional<Profile> profile = profileRepository.findByEmail(email);

                if (profile.isEmpty() || !profile.get().isAdmin()) {
                    return ServiceResponse.ofError(Comment.class, "Cannot create page with current identity.");
                }

                if (pageRepository.findById(createCommentDto.postId()).isEmpty()) {
                    return ServiceResponse.ofError(Comment.class, "Could not find post with given id.");
                }

                if (createCommentDto.content().length() < 12) {
                    return ServiceResponse.ofError(Comment.class, "Comment should be at least 12 character long.");
                }

                Optional<User> user = userRepository.findByEmail(email);
                if (user.isEmpty()) {
                    return ServiceResponse.ofError(Comment.class, "Could not find a user with the given e-mail address.");
                }

                Optional<Comment> lastComment = commentRepository.findFirstByUserIdOrderByDateTimeDesc(user.get().getId());
                if (lastComment.isPresent() && diffLessThan2MinutesFromNow(lastComment.get().getDateTime())) {
                    return ServiceResponse.ofError(Comment.class, "You can only post one comment every second minute.");
                }

                Comment commentToCreate = new Comment(
                        user.get().getId(),
                        profile.get().getDisplayName(),
                        createCommentDto.postId(),
                        createCommentDto.content(),
                        LocalDateTime.now()
                );

                var createdComment = commentRepository.save(commentToCreate);
                return ServiceResponse.ofItem(createdComment);
            } else {
                return ServiceResponse.ofError(Comment.class, "Could not fetch authentication details.");
            }
        } else {
            return ServiceResponse.ofError(Comment.class, "You are not authenticated.");
        }
    }

    public ServiceResponse<List<CommentResponseDto>> findByPostId(String postId) {
        if (pageRepository.findById(postId).isEmpty()) {
            return ServiceResponse.ofError("Could not find post with given id.");
        }

        List<Comment> comments = commentRepository.findByPostIdOrderByDateTimeAsc(postId);

        List<CommentResponseDto> commentResponses = new ArrayList<>();

        comments.forEach(e -> mapCommentToCommentResponse(e, commentResponses));

        return ServiceResponse.ofItem(commentResponses);
    }

    private void mapCommentToCommentResponse(Comment e, List<CommentResponseDto> commentResponses) {
        Optional<User> user = userRepository.findById(e.getUserId());
        if (user.isPresent()) {
            commentResponses.add(new CommentResponseDto(e.getId(), e.getUserId(), e.getDisplayName(), e.getPostId(), e.getContent(), e.getDateTime()));
        }
    }

    public ServiceResponse<List<Comment>> findNewest5ByKey(String key) {
        String userId;

        if (userRepository.findById(key).isPresent()) {
            userId = key;
        }
        else {
            var user = userRepository.findByEmail(key);
            if (!user.isPresent()) {
                return ServiceResponse.ofError("Could not find user with given id or email.");
            }

            userId = user.get().getId();
        }

        return ServiceResponse.ofItem(commentRepository.findFirst5ByUserIdOrderByDateTimeDesc(userId));
    }

    public ServiceResponse<Comment> deleteComment(DeleteCommentRequestDto deleteCommentRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();
                Optional<User> userOptional = userRepository.findByEmail(email);

                if (userOptional.isEmpty()) {
                    return ServiceResponse.ofError(Comment.class, "Error fetching info for authenticated user.");
                }

                Optional<Profile> profile = profileRepository.findByEmail(email);

                Optional<Comment> commentOptional = commentRepository.findById(deleteCommentRequestDto.commentId());

                if (commentOptional.isEmpty()) {
                    return ServiceResponse.ofError(Comment.class, "Could not find comment with given id.");
                }

                if (profile.isEmpty() || (!commentOptional.get().getUserId().equals(userOptional.get().getId()) && !profile.get().isAdmin())) {
                    return ServiceResponse.ofError(Comment.class, "Cannot delete comment with current identity.");
                }

                commentRepository.deleteById(deleteCommentRequestDto.commentId());
                return ServiceResponse.ofItem(commentOptional.get());
            } else {
                return ServiceResponse.ofError(Comment.class, "Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError(Comment.class, "You are not authenticated.");
        }
    }
}
