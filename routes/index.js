/* GET home page. */
exports.index = function(req, res){
  if(req.params.status) {
  	res.render('index', { title: 'CS247 Chatroom', loggedin: 'yes' });
  } else {
  	res.render('index', { title: 'CS247 Chatroom' });
  }
};
