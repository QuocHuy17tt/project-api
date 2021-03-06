const models= require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const messageConstants = require('../constant/messageConstants');
// const Paginator = require('../commons/paginator');
const Paginator = require('../commons/paginator');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql::memory');
const Op = models.Sequelize.Op;

/**
* Returns a list of vehicleMake
* @param   {SearchViewModel}   searchViewModel - The model search to find
* @returns {Promise} resolved user if found, otherwise resolves undefined
*/

exports.get = () => {
   return models.users.findAndCountAll({where:{deleted: false}});
};

// Get all paging information about users

exports.getallpaging = function (searchViewModel) {
    limit= searchViewModel.limit;
    offset= searchViewModel.offset;
    return models.users.findAndCountAll({
        limit: limit,
        offset: offset,
   });
 };
                                                         
                                                         
                                                         
//  Sign-in/Create
 exports.register=async(user)=>{
  const Email = await models.users.findOne({where:{email:user.email}});
  if(!Email){
    const UserName= await models.users.findOne({where:{username:user.username}});
    if(!UserName){
      const salt= await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password,salt);
      user.password= hashPassword;
      return models.users.create(user);
  }else{
    return Promise.resolve({
      message:  messageConstants.USER_EXIST_NAME,
    });
  }
}else{
    return Promise.resolve({
       message:  messageConstants.USER_MAIL_EXIST,
       });
    };
};
   
   
//  Login
exports.login = (account)=>{
  return  models.users.findOne({where:{username:account.username}}).then( async(user)=>{
      if(user){
         const isMatch = await bcrypt.compare(account.password, user.password)
         if(isMatch){
            const payload={
               username: user.username,
               password: user.password
            }
            const accessToken = jwt.sign(
                payload,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '7m' });
            const refreshToken = jwt.sign( 
                payload,process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '7d' });
            return {accessToken,refreshToken};
         }
         else{
            return Promise.resolve({
               status: 404,
               message: messageConstants.USER_PASS_INVALID,
         });
      }
   }
      else{
         return Promise.resolve({
            status: 404,
            message: messageConstants.USER_USERNAME_NOT_EXIST,
         });
       } 
   });
};

// Find by Id
exports.getbyID = async(id)=>{
    return models.users.findOne({where:{id:id}})
};


 // Update 
 exports.update=async(id,userUpdate)=>{
  const Id= await models.users.findOne({where:{id:id}});
  if(!Id){
      return Promise.resolve({
         message: messageConstants.USER_ID_NOT_FOUND ,
      });
   }else{
  const salt= await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(userUpdate.password,salt);
  userUpdate.password= hashPassword;
  return models.users.update(userUpdate,{where:{id:id}});
     };
};

//  Deleted fake
exports. delete=async (id,options)=>{
    return models.users.update(options,{where:{id:id,deleted:0}});
};
// Restore
exports.restore=async (id,options)=>{
   return models.users.update(options,{where:{id:id, deleted:1}});
};

//    //  Delete
//  exports.destroy= async(Id)=>{  
// const id= await models.users.findOne({where:{Id:Id}});
//  if(!id){
//      return Promise.resolve({
//         message: messageConstants.USER_ID_NOT_FOUND ,
//      });
//   }else{
//    return models.users.destroy({where:{Id:Id}});
//   };
// };

// Reset password
exports.resetpassword = async(id,account)=>{
   await models.users.findOne({where:{email:account.email}}).then( async(user)=>{
      if(user){
         const isMatch = await bcrypt.compare(account.email, user.email)
         if(isMatch){
          const salt= await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(account.password,salt);
          account.password= hashPassword;
          return models.users.update(account,{where:{id:id}});
         }
   }
   });
};
