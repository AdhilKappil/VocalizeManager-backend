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



// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt',"",{
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'Logged out successfully'});
})



/// @desc    Get user profile
/// @route   GET /api/users/profile
/// @access  Private
const getUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      url : user.profileImg
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
})



// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.mobile = req.body.mobile || user.mobile
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        profileImg:updatedUser.profileImg
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
})


// @desc    Register a new user
// @route   POST /api/addProfile
// @access  Public
const setUserProfile = asyncHandler(async(req, res) => {
  try {
    const { url, id } = req.body;

    const user = await User.findById(id);

    if (user) {
      user.profileImg = url;
      
      await user.save();

      res.status(201).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            mobile:user.mobile,  
            profileImg: user.profileImg
      })
      
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error setting profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    setUserProfile
}