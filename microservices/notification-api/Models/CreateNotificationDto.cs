using System.ComponentModel.DataAnnotations;

namespace NotificationApi.Models
{
    public class CreateNotificationDto
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Message { get; set; } = string.Empty;

        public string Type { get; set; } = "SYSTEM";
    }
}
