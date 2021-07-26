using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Api.Controllers    
{
    public static class HelloWorldController
    {
        [FunctionName("HelloWorldFunction")]
        public static async Task<IActionResult> HelloWorldFunction(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "HelloWorld")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("I'm in the the function!");
            return new OkObjectResult(true);
        }
    }
}
