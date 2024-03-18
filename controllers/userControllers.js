import asyncHandler from 'express-async-handler'
import User from '../models/user.js'
import genarateToken from '../utils/genarateToken.js'




// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async(req,res)=>{

    const {email, password} = req.body
    
    const user = await User.findOne({email})
  

    if(user && (await user.matchPassword(password))){

      if(!user.isStatus){
        res.status(401);
        throw new Error('User is Blocked')
      }else{
        genarateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            mobile:user.mobile,
            profileImg : user.profileImg
          })
      }
    }else{
        res.status(401);
        throw new Error('Invalid email or password')
    }

    
})



// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req,res)=>{

    const {name, email, mobile, password} = req.body

    const profileImg = "181-1814767_person-svg-png-icon-free-download-profile-icon.png"

    const userExists = await User.findOne({email})

    if(userExists){
      res.status(400)
      throw new Error('User alredy exists')
    }

    const user = await User.create(({
         name,
         email,
         password,
         mobile,
         profileImg

    }))

    if(user){
        genarateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            mobile:user.mobile,  
            profileImg: user.profileImg
        })
    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }

})





export {
    authUser,
    registerUser,
    // logoutUser,
    // getUserProfile,
    // updateUserProfile,
    // setUserProfile
}