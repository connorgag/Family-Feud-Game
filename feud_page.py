from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from webdriver_manager.chrome import ChromeDriverManager
from http.server import BaseHTTPRequestHandler, HTTPServer
from datasets import load_dataset
import random
from pydub import AudioSegment
from pydub.playback import play

import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip_address = (s.getsockname()[0])
print("ip_address: " + ip_address)
hostid = ip_address[ip_address.rfind(".") + 1:]
print("-------HOST ID --------")
print(hostid)

# Start UI and server


options = webdriver.ChromeOptions()
options.add_experimental_option("useAutomationExtension", False)
options.add_experimental_option("excludeSwitches",["enable-automation"])


driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)

driver.get("http://" + ip_address + ":8080")


MyRequest = None
points_to_win = 50
class RequestHandler_httpd(BaseHTTPRequestHandler):
	def do_GET(self):
		global MyRequest
		MyRequest = self.requestline
		MyRequest = MyRequest[5 : int(len(MyRequest) - 9)]
		self.send_response(200)
		self.end_headers()
		if (MyRequest):
			driver.refresh()
			print(MyRequest)
			if (MyRequest == 'bong'):
				print("BOOOOONG")
				correct_sound = AudioSegment.from_mp3("sounds/correct_sound.mp3")
				play(correct_sound)
			elif (MyRequest == 'wrong'):
				wrong_sound = AudioSegment.from_mp3("sounds/wrong_sound.mp3")
				play(wrong_sound)
				print("WROOOOONG")
			elif (MyRequest == 'game_over'):
				game_over_sound = AudioSegment.from_mp3("sounds/main_sound.mp3")
				play(game_over_sound)
				print("GAME OOOVVVVEEEERRRR")

			elif ((MyRequest == 'team_one_win_round') and (int(driver.find_element(By.ID, "team_one_points").text) < points_to_win)):
				print("TEAM ONE WON THE ROUND!!!!")
				round_win_sound = AudioSegment.from_mp3("sounds/round_win.mp3")
				play(round_win_sound)
			elif ((MyRequest == 'team_one_win_round') and (int(driver.find_element(By.ID, "team_one_points").text) >= points_to_win)):
				print("TEAM ONE WON THE GAME!!!!")
				driver.find_element(By.CLASS_NAME, "open_button_left").click()
				main_sound = AudioSegment.from_mp3("sounds/main_sound.mp3")
				play(main_sound)

			elif ((MyRequest == 'team_two_win_round') and (int(driver.find_element(By.ID, "team_two_points").text) < points_to_win)):
				print("TEAM TWO WON THE ROUND!!!!")
				round_win_sound = AudioSegment.from_mp3("sounds/round_win.mp3")
				play(round_win_sound)
			elif ((MyRequest == 'team_two_win_round') and (int(driver.find_element(By.ID, "team_two_points").text) >= points_to_win)):
				print("TEAM TWO WON THE GAME!!!!")
				driver.find_element(By.CLASS_NAME, "open_button_right").click()
				main_sound = AudioSegment.from_mp3("sounds/main_sound.mp3")
				play(main_sound)
		return


# This is the local ip address
server_address_httpd = (ip_address, 8088)
httpd = HTTPServer(server_address_httpd, RequestHandler_httpd)
print('Starting server:')
httpd.serve_forever()


