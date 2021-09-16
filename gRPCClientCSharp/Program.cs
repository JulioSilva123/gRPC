using System;
using System.Net.Http;
using System.Threading.Tasks;
using Grpc.Net.Client;
using gRPCClientCSharp;

namespace GrpcGreeterClient
{
    class Program
    {
        //static void Main(string[] args)
        //{
        //    Console.WriteLine("Hello World!");
        //}


        static async Task Main(string[] args)
        {
            // The port number(5001) must match the port of the gRPC server.
            using var channel = GrpcChannel.ForAddress("https://localhost:5001");
            //var client = new Greeter.GreeterClient(channel);
            var client = new Greeter.GreeterClient(channel);

            var reply = await client.SayHelloAsync(
                              new HelloRequest { Name = "GreeterClient" });
            Console.WriteLine("1) Greeting: " + reply.Message);


            reply = await client.SayHelloAsync(
                              new HelloRequest { });

            Console.WriteLine("2) Greeting: " + reply.Message);


            reply = await client.SayHelloAsync(
                             new HelloRequest { Name = "Julio", Sobrenome = "Luana" });

            Console.WriteLine("3) Greeting: " + reply.Message);


            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }

    }
}
