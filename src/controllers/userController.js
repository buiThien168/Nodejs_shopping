import userService from "../services/userService";
let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  // b1 check email user tồn tại không
  // b2 so sánh pass
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};
// get api on view
let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; //all,sigle
  if(!id){
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users:[]
    });
  }
  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};
let handleCreateNewUser = async(req,res)=>{
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
}
let handleEditUser = async(req,res)=>{
  let data = req.body;
  let message = await userService.editUser(data);
  return res.status(200).json(message)
}
let handleDeleteUser = async(req,res)=>{
  if(!req.body.id){
    return res.status(200).json({
      errCode:1,
      errMessage:"Missing required parameter"
    })
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
}
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser:handleCreateNewUser,
  handleEditUser:handleEditUser,
  handleDeleteUser:handleDeleteUser,
};
