import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip_address = (s.getsockname()[0])
print("ip_address: " + ip_address)

f = open("data/ip_address.txt", "w")
f.write(ip_address)
f.close()