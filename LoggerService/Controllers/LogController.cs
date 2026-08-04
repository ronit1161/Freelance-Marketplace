using Microsoft.AspNetCore.Mvc;
using LoggerService.Loggers;
using LoggerService.Models;

namespace LoggerService.Controllers
{
    [ApiController]
    [Route("api/log")]
    public class LogController : ControllerBase
    {
        [HttpPost]
        public IActionResult Log([FromBody] LogRequest request)
        {
            string finalMessage =
                $"[{request.Level}] {request.Service} - {request.Message}";

            Logger.CurrentLogger.Log(finalMessage);

            return Ok("Logged successfully");
        }
    }
}
