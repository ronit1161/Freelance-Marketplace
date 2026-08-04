using System;
using System.IO;

namespace LoggerService.Loggers
{
    public class Logger
    {
        private static readonly Logger _instance = new Logger();  // singleton 
        private readonly string logFilePath = "C:\\Users\\ASUS\\Desktop\\logger demo\\logs.txt";

        private Logger()
        {
        }

        public static Logger CurrentLogger => _instance; 

        public void Log(string message)
        {
            using (StreamWriter writer = new StreamWriter(logFilePath, true))
            {
                writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
            }
        }
    }
}
