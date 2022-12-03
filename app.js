const express = require('express');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
var path = require("path");


//express app
const app = express();

app.use(connectLiveReload());
app.use( express.static( "public" ) );

json_file = require('./data/family_feud_questions.json');
const length = Object.keys(json_file).length;


// Get IP address from file 
const fs = require('fs');
var ip_address = fs.readFileSync('data/ip_address.txt','utf8');
hostID = ip_address.split(".").pop();
console.log(hostID);







class Team {
  constructor(name) {
  	this.name = name;
    this.points = 0;
    this.last_points = 0;
    this.wrongs = 0;
    this.win = "false";
  }
}

class Game {
	constructor(team_one_name, team_two_name){
		this.team_one = new Team(team_one_name);
		this.team_two = new Team(team_two_name);
		this.game_question = "Welcome to Family Feud, the Game that Families Play! To Begin, Enter the Game Code on the Family Feud App: " + hostID;
		this.board_points = 0;
		this.board_numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
		this.answers = ["Alligator", "Orange", "Banana", "Apple", "Computer", "Plant", "Pear", "Platypus", "Burger"];
		this.answer_points = [0, 0, 0, 0, 0, 0, 0, 0];
		this.correct_points = [0, 0, 0, 0, 0, 0, 0, 0];
		this.active_team = this.team_one;
	}

	add_points_to_team_one(){
		this.team_one.last_points = this.team_one.points;
		this.team_one.points = this.team_one.points + this.board_points;
	}
	add_points_to_team_two(){
		this.team_two.last_points = this.team_two.points;
		this.team_two.points = this.team_two.points + this.board_points;
	}
	add_wrong_team_one(){
		this.team_one.wrongs = this.team_one.wrongs + 1;
		if (this.team_one.wrongs > 3){
			this.team_one.wrongs = 3;
		}
	}
	add_wrong_team_two(){
		this.team_two.wrongs = this.team_two.wrongs + 1;
		if (this.team_two.wrongs > 3){
			this.team_two.wrongs = 3;
		}
	}
	add_wrong(){
		this.active_team.wrongs = this.active_team.wrongs + 1;
		if (this.active_team.wrongs > 3){
			this.active_team.wrongs = 3;
		}
	}
	team_one_active(){
		this.active_team = this.team_one;
	}
	team_two_active(){
		this.active_team = this.team_two;
	}
}

game = new Game('Team One', 'Team Two');
let team_one_point_animation = false;
let team_two_point_animation = false;
let modal_on = 0;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomQuestion(){
	random_int = getRandomInt(length)
	ques = json_file[random_int].question
	ans = json_file[random_int].answers
	point = json_file[random_int].points
	return [ques, ans, point]

}

function board_reset(){
	console.log("board reset");
	game.board_numbers[0] = "1";
	game.board_numbers[1] = "2";
	game.board_numbers[2] = "3";
	game.board_numbers[3] = "4";
	game.board_numbers[4] = "5";
	game.board_numbers[5] = "6";
	game.board_numbers[6] = "7";
	game.board_numbers[7] = "8";
	game.correct_points[0] = 0;
	game.correct_points[1] = 0;
	game.correct_points[2] = 0;
	game.correct_points[3] = 0;
	game.correct_points[4] = 0;
	game.correct_points[5] = 0;
	game.correct_points[6] = 0;
	game.correct_points[7] = 0;
	game.board_points = 0;
	game.game_question = "";
	console.log("about to reset wrongs. Current state:");
	console.log(game.team_one.wrongs);
	console.log(game.team_two.wrongs);
	game.team_one.wrongs = 0;
	game.team_two.wrongs = 0;
	console.log("just reset them. After state:");
	console.log(game.team_one.wrongs);
	console.log(game.team_two.wrongs);
	game.team_one.last_points = game.team_one.points;
	game.team_two.last_points = game.team_two.points;
}

function next_question(){
	console.log("question received")
	current_question_answer = getRandomQuestion();
	console.log(current_question_answer[1]);
	game.game_question = current_question_answer[0];
	game.board_points = 0;
	// Format Answers (padding and capitalize)
	let total_length = 75;
	for (let i = 0; i < current_question_answer[1].length; i++){
		current_question_answer[1][i] = capitalizeFirstLetter(current_question_answer[1][i])
	}


	//Set answers list for the current question
	for (let i = 0; i < current_question_answer[1].length; i++){
		game.answers[i] = current_question_answer[1][i];
		game.board_numbers[i] = (i + 1).toString();
	}
	for (let i = current_question_answer[1].length; i < 9; i++){
		game.answers[i] = current_question_answer[1][i];
		game.board_numbers[i] = " ";
	}

	// Format string for app ui
	let string_version = ""
	let end = 0
	for (let i = 0; i < current_question_answer[1].length; i++){
		if (i != current_question_answer[1].length - 1){
			string_version = string_version + current_question_answer[1][i] + "|";
		}
		else{
			string_version = string_version + current_question_answer[1][i];
		}
		end = i
	}
	// Empty answers
	for (let i = end; i < 8; i++){
		string_version = string_version + " | "
	}

	// Question Points
	for (let i = 0; i < current_question_answer[2].length; i++){
		game.answer_points[i] = current_question_answer[2][i];
	}

	// Add question on to front
	string_version = game.game_question + "|" + string_version;
	return string_version;
}

function set_question_ui(){
	game.game_question = game.game_question;
}


// Create Server and Listen

// register view engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

module.exports = app;

//listen for requests
app.listen(8080, ip_address);


app.get('/', (req, res) => {
	//Only do animation when team_one_win is sent by server
	if (team_one_point_animation){
		team_one_point_animation = false;
	}
	else{
		game.team_one.last_points = game.team_one.points;
	}
	//Only do animation when team_one_win is sent by server
	if (team_two_point_animation){
		team_two_point_animation = false;
	}
	else{
		game.team_two.last_points = game.team_two.points;
	}

	//Checks to see if a team won
	// if (game.team_one.points >= 300){
	// 	game.team_one.win = "true";
	// }
	// else if (game.team_two.points >= 300){
	// 	game.team_two.win = "true";
	// }




	game.board_points = game.correct_points.reduce((partialSum, a) => partialSum + a, 0);
	
	// Points should not show when it's 0
	const adjusted_points = ["", "", "", "", "", "", "", ""];
	for (let i = 0; i < 9; i++){
		if (game.correct_points[i] != 0){
			adjusted_points[i] = game.correct_points[i];
		}
	}

	res.render('index', {one: game.board_numbers[0], two: game.board_numbers[1], 
		three: game.board_numbers[2], four: game.board_numbers[3], five: game.board_numbers[4], 
		six: game.board_numbers[5], seven: game.board_numbers[6], eight: game.board_numbers[7], 
		question: game.game_question, points: game.board_points, points_one: adjusted_points[0], 
		points_two: adjusted_points[1], points_three: adjusted_points[2], 
		points_four: adjusted_points[3], points_five: adjusted_points[4], 
		points_six: adjusted_points[5], points_seven: adjusted_points[6], 
		points_eight: adjusted_points[7], team_one: game.team_one.name, 
		team_two: game.team_two.name, points_team_one: game.team_one.points, 
		points_team_two: game.team_two.points, wrongs_team_one: game.team_one.wrongs, 
		wrongs_team_two: game.team_two.wrongs, team_one_last_points: game.team_one.last_points, 
		team_two_last_points: game.team_two.last_points});
		if (modal_on == 1){
			modal_on = 0;
		}
})

app.get('/reload', (req, res) => {
	res.redirect('back');
})

app.get('/reset', (req, res) => {
	console.log("going to reset")
	board_reset();
	console.log("just called board_reset()")

})

app.get('/1', (req, res) => {
	game.board_numbers[0] = game.answers[0];
	game.correct_points[0] = game.answer_points[0];
	game.board_points = game.board_points + game.answer_points[0];
})

app.get('/2', (req, res) => {
	game.board_numbers[1] = game.answers[1];
	game.correct_points[1] = game.answer_points[1];
	game.board_points = game.board_points + game.answer_points[1];

})

app.get('/3', (req, res) => {
	game.board_numbers[2] = game.answers[2];
	game.correct_points[2] = game.answer_points[2];
	game.board_points = game.board_points + game.answer_points[2];

})

app.get('/4', (req, res) => {
	game.board_numbers[3] = game.answers[3];
	game.correct_points[3] = game.answer_points[3];
	game.board_points = game.board_points + game.answer_points[3];

})

app.get('/5', (req, res) => {
	game.board_numbers[4] = game.answers[4];
	game.correct_points[4] = game.answer_points[4];
	game.board_points = game.board_points + game.answer_points[4];

})

app.get('/6', (req, res) => {
	game.board_numbers[5] = game.answers[5];
	game.correct_points[5] = game.answer_points[5];
	game.board_points = game.board_points + game.answer_points[5];

})

app.get('/7', (req, res) => {
	game.board_numbers[6] = game.answers[6];
	game.correct_points[6] = game.answer_points[6];
	game.board_points = game.board_points + game.answer_points[6];

})

app.get('/8', (req, res) => {
	game.board_numbers[7] = game.answers[7];
	game.correct_points[7] = game.answer_points[7];
	game.board_points = game.board_points + game.answer_points[7];

})

app.get('/wrong', (req, res) => {
	game.add_wrong();
	console.log(game.team_one.wrongs);
	console.log(game.team_two.wrongs);
})

app.get('/team_one_active', (req, res) => {
	game.team_one_active();
})

app.get('/team_two_active', (req, res) => {
	game.team_two_active();
})



app.get('/team_one_win_round', (req, res) => {
	// game.team_one.win = "true";
	team_one_point_animation = true;
	game.add_points_to_team_one();
})

app.get('/team_two_win_round', (req, res) => {
	game.team_two.win = "true";
	team_two_point_animation = true;
	game.add_points_to_team_two();
})


app.get('/nq', (req, res) => {
	// modal_on = 0;
	board_reset();
	string_version = next_question();
	res.send(string_version);
})

app.get('/set_question_ui', (req, res) => {
	set_question_ui();
})


app.get('/add_ten_points_to_one', (req, res) => {
	game.team_one.points = game.team_one.points + 10;
})

app.get('/add_one_point_to_one', (req, res) => {
	game.team_one.points = game.team_one.points + 1;
})

app.get('/subtract_ten_points_from_one', (req, res) => {
	game.team_one.points = game.team_one.points - 10;
	if (game.team_one.points < 0){
		game.team_one.points = 0;
	}
})

app.get('/subtract_one_point_from_one', (req, res) => {
	game.team_one.points = game.team_one.points - 1;
	if (game.team_one.points < 0){
		game.team_one.points = 0;
	}
})



app.get('/add_ten_points_to_two', (req, res) => {
	game.team_two.points = game.team_two.points + 10;
})

app.get('/add_one_point_to_two', (req, res) => {
	game.team_two.points = game.team_two.points + 1;
})

app.get('/subtract_ten_points_from_two', (req, res) => {
	game.team_two.points = game.team_two.points - 10;
	if (game.team_two.points < 0){
		game.team_two.points = 0;
	}
})

app.get('/subtract_one_point_from_two', (req, res) => {
	game.team_two.points = game.team_two.points - 1;
	if (game.team_two.points < 0){
		game.team_two.points = 0;
	}
})

app.get(/team_one_name:.*/, (req, res) => {
	game.team_one.name = req.path.slice(15);
})

app.get(/team_two_name:.*/, (req, res) => {
	game.team_two.name = req.path.slice(15);
})


