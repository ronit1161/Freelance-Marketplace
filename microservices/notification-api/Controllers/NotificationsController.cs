using Microsoft.AspNetCore.Mvc;
using NotificationApi.Models;
using System.Collections.Concurrent;

namespace NotificationApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        // Thread-safe in-memory store for the notification service
        private static readonly ConcurrentDictionary<long, Notification> _notifications = new();
        private static long _nextId = 1;
        private static readonly object _lock = new();

        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(ILogger<NotificationsController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get all notifications for a specific user.
        /// </summary>
        [HttpGet("{userId:long}")]
        public IActionResult GetByUserId(long userId)
        {
            _logger.LogInformation("Fetching notifications for user {UserId}", userId);
            var userNotifications = _notifications.Values
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();

            return Ok(userNotifications);
        }

        /// <summary>
        /// Create a new notification.
        /// </summary>
        [HttpPost]
        public IActionResult Create([FromBody] CreateNotificationDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            long id;
            lock (_lock)
            {
                id = _nextId++;
            }

            var notification = new Notification
            {
                Id = id,
                UserId = dto.UserId,
                Title = dto.Title,
                Message = dto.Message,
                Type = string.IsNullOrWhiteSpace(dto.Type) ? "SYSTEM" : dto.Type.ToUpper(),
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _notifications[id] = notification;
            _logger.LogInformation("Notification {NotificationId} created for user {UserId}", id, dto.UserId);

            return CreatedAtAction(nameof(GetByUserId), new { userId = notification.UserId }, notification);
        }

        /// <summary>
        /// Mark a notification as read.
        /// </summary>
        [HttpPut("{id:long}/read")]
        public IActionResult MarkAsRead(long id)
        {
            if (!_notifications.TryGetValue(id, out var notification))
            {
                _logger.LogWarning("Notification {NotificationId} not found for marking as read", id);
                return NotFound(new { message = $"Notification with ID {id} not found" });
            }

            notification.IsRead = true;
            _notifications[id] = notification;
            _logger.LogInformation("Notification {NotificationId} marked as read", id);

            return Ok(notification);
        }

        /// <summary>
        /// Get all notifications across the platform (Admin / debug).
        /// </summary>
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _notifications.Values.OrderByDescending(n => n.CreatedAt).ToList();
            return Ok(list);
        }

        /// <summary>
        /// Delete a notification by ID.
        /// </summary>
        [HttpDelete("{id:long}")]
        public IActionResult Delete(long id)
        {
            if (_notifications.TryRemove(id, out _))
            {
                _logger.LogInformation("Notification {NotificationId} deleted", id);
                return NoContent();
            }

            return NotFound(new { message = $"Notification with ID {id} not found" });
        }
    }
}
