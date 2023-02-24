import db from "../models/index";
import bcrypt from "bcryptjs";
// import bcrypt, { hash } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "roleID", "password"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's Email isn't exist in your system. PLZ try other email`;
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = '';
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes:{
            exclude:['password']
          }
        })
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: { id: userId },
          attributes:{
            exclude:['password']
          }
        })
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  })
};
let createNewUser =(data)=>{
  return new Promise(async(resolve,reject)=>{
    try {
      // check email\
      let check = await checkUserEmail(data.email);
      if(check===true){
        resolve({
          errCode:1,
          errMessage:'Your email is already in used, plz try another email'
        });
      }
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve({
        errCode:1,
        message:'OK'
      });
    } catch (error) {
      reject(error)
    }
  })
}
let deleteUser=(userId)=>{
  return new Promise(async(resolve,reject)=>{
    try {
      let foundUser = await db.User.findOne({
        where:{id:userId}
      })
      if(!foundUser){
        resolve({
          errCode:2,
          message:`The user isn't exit`
        })
      }
      await db.User.destroy({
        where:{id:userId}
      })
      resolve({
        errCode:0,
        message:`The user is deleted`
      })
    } catch (error) {
      reject(error)
    }
  })
}
let editUser=(data)=>{
  return new Promise(async(resolve,reject)=>{
    try {
      if(!data.id){
        resolve({
          errCode:2,
          message:'Missing required parameters'
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw:false
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonenumber = data.phonenumber;
        await user.save();
        // await db.User.save({
        //   firstName : data.firstName,
        //   lastName : data.lastName,
        //   address : data.address,
        //   phonenumber : data.phonenumber,
        // })
       resolve({
        errCode:0,
        message:'Update the user successds'
       })
      } else {
        resolve({
          errCode:1,
          message:'User not founds'
        });
      }
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser:createNewUser,
  deleteUser:deleteUser,
  editUser:editUser,
};
