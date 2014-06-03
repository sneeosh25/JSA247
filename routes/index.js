/* GET home page. */
exports.index = function(req, res){
  	res.render('index', { title: 'CS247 Chatroom' });
};

exports.loggedin = function(req, res){
  	res.render('index', { title: 'CS247 Chatroom', loggedin: 'yes' });
};
