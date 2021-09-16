import BaseHTTPServer, SimpleHTTPServer
import ssl

httpd = BaseHTTPServer.HTTPServer(("localhost", 443),
								  SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket,
								keyfile="ws_rsa2k.pem",
								certfile="ws_rsa2kcert.pem", server_side=True)
httpd.serve_forever()
