using Grpc.Core;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gRPCHelloWorld_5_0
{
    public class GreeterService : Greeter.GreeterBase
    {
        private readonly ILogger<GreeterService> _logger;
        public GreeterService(ILogger<GreeterService> logger)
        {
            _logger = logger;
        }

        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {

            HelloReply r = new HelloReply();

            if (request.Name != null)
            {
                r.Message = "Hello " + request.Name;
            }

            if (request.Sobrenome != null)
            {
                r.Message += "\nSobrenome: " + request.Sobrenome;
            }

            return Task.FromResult(r);

            //return Task.FromResult(new HelloReply
            //{
            //    Message = "Hello " + request.Name
            //});
        }
    }
}
