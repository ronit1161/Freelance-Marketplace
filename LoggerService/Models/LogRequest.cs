namespace LoggerService.Models
{
    public class LogRequest
    {
        public string Message { get; set; }
        public string Service { get; set; }
        public string Level { get; set; }
    }
}
