import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      resolve("create succeed");
    } catch (error) {
      reject(error);
    }
  });
};
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
// lấy thông tin
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        // raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = await db.User.findOne({
        where: { id: data.id },
      });
      if (userData) {
        userData.firstName = data.firstName;
        userData.lastName = data.lastName;
        userData.address = data.address;
        userData.phonenumber = data.phonenumber;
        await userData.save();
        let allUser = await db.User.findAll();
        resolve(allUser);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteUserCRUD = (userId) => {
  return new Promise(async (resolve, rejec) => {
    try {
      let userData = await db.User.findOne({
        where: { id: userId },
      });
      if (userData) {
        await userData.destroy();
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserCRUD: deleteUserCRUD,
};
