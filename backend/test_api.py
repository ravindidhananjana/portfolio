import urllib.request
import json
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/chat', 
    data=json.dumps({'query':'What are Ravindi skills?'}).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
print(urllib.request.urlopen(req).read().decode('utf-8'))
