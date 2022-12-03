from datasets import load_dataset
import random 

# Collect Data
dataset = load_dataset("proto_qa")

# all_data = {}
# for i in dataset['validation']:
# 	answers = [item for sublist in i['answer-clusters']['answers'] for item in sublist]
# 	count = i['answer-clusters']['count']
# 	answer_dict = dict(zip(answers, count))

# 	all_data[i['question']] = answer_dict

# for j in dataset['train']:
# 	answers = [item for sublist in j['answer-clusters']['answers'] for item in sublist]
# 	count = j['answer-clusters']['count']
# 	answer_dict = dict(zip(answers, count))
# 	all_data[j['question']] = answer_dict

# for k in all_data:
# 	print(k)
# 	print(all_data[k])

# def random_question():
# 	return random.sample(all_data.items(), 1)[0]

# for i in range(10):
# 	question = random_question()
# 	print(question[0])
# 	print(question[1])


def format_list(alist):
	result = "["
	for i in range(len(alist)):
		result = result + '"' + backslash_quotes(alist[i]) + '"'
		if (i != len(alist) - 1):
			result = result + ", "
	result = result + "]"
	return result

def backslash_quotes(str1):
	substr = '"'
	res = [i for i in range(len(str1)) if str1.startswith(substr, i)]
	for i in range(len(res)):
		str1 = str1[:res[i]] + "\\" + str1[res[i]:]
		res = [i + 1 for i in res]
	return str1

def download_to_json():
	json_file = "["
	for i in dataset['validation']:
		question = i['question']
		answers = [item for sublist in i['answer-clusters']['answers'] for item in sublist]
		count = i['answer-clusters']['count']
		if ((len(answers) >= 4) and (len(answers) <= 8)):
			json_file = json_file + "{\n"
			json_file = json_file + '"question":'
			json_file = json_file + '"' + backslash_quotes(question) + '",\n'

			json_file = json_file + '"answers":'
			json_file = json_file + format_list(answers) + ",\n"

			json_file = json_file + '"points":'
			json_file = json_file + str(count)  + "\n"
			json_file = json_file + "}\n,"


	for i in dataset['train']:
		question = i['question']
		answers = [item for sublist in i['answer-clusters']['answers'] for item in sublist]
		count = i['answer-clusters']['count']
		if ((len(answers) >= 4) and (len(answers) <= 8)):
			json_file = json_file + "{\n"
			json_file = json_file + '"question":'
			json_file = json_file + '"' + backslash_quotes(question) + '",\n'

			json_file = json_file + '"answers":'
			json_file = json_file + format_list(answers) + ",\n"

			json_file = json_file + '"points":'
			json_file = json_file + str(count)  + "\n"
			json_file = json_file + "}\n,"
			# print(question)
			# print(answers)
			# print(count)


	json_file = json_file[:-1] + "]"

	print(json_file)

	text_file = open("family_feud_questions.json", "w")
	text_file.write(json_file)
	text_file.close()

	# Manual change with "Tell me an occupation that a guy nicknamed \"Butterfingers\""


def main():
	download_to_json()

main()


