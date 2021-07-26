using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using System.IO;

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

        [FunctionName("negotiate")]
        public static IActionResult GetSignalRInfo(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "negotiate")] HttpRequest req,
        [SignalRConnectionInfo(HubName = "broadcast")] SignalRConnectionInfo info)
        {
            //get something from the request like chat name and add to group somehow??
            return new OkObjectResult(info);
        }

        [FunctionName("message")]
        public static async Task<IActionResult> SendMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "message")] HttpRequest req,
            [SignalR(HubName = "broadcast")] IAsyncCollector<SignalRMessage> signalRMessages)
        {

            // will be reading this in as an object just // use 
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            // var content = await new StreamReader(req.Body).ReadToEndAsync();

            //MyClass myClass = JsonConvert.DeserializeObject<MyClass>(content);

            //or await JsonSerializer.DeserializeAsync<MyClass>(req.Body); for system above is newton soft

            var messageObject = new DataModels.Message();
            messageObject.Body = requestBody;
            messageObject.Name = "Ruairi";

            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    //GroupName =  "The group name"
                    Target = "notify",
                    Arguments = new object[] { messageObject }
                });
            return new OkResult();
        }
    }
}
