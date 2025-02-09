from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
from urllib.parse import urlparse, parse_qs

host = "localhost"
port = 8000

country = "_"

def get_country_from_barcode(code):
    print("Connection Established with Barcode: " + str(code))
    initials = int(code[:3])
    if initials <= 39 and initials >= 30:
        return "USA"
    else:
        return "OTH"

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        barcode = query_params.get("barcode", ["0"])[0]
        response_data = {"country": get_country_from_barcode(barcode), "status": "success"}
        response_json = json.dumps(response_data)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(response_json.encode("utf-8"))

server = HTTPServer((host, port), MyHandler)
print(f"Server running on http://{host}:{port}")
server.serve_forever()