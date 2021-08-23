using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Api.Repositories;

[assembly: FunctionsStartup(typeof(Api.Startup))]

namespace Api
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddLogging();

            builder.Services.AddSingleton(s => new CosmosClient(Environment.GetEnvironmentVariable("CosmoDB_ConnectionString")));
            builder.Services.AddTransient<IMessageRepository, MessagesRepository>();
        }
    }
}
