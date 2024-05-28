import { asynchandler } from "../utils/asynchandler.js";
import apierror from "../utils/apierror.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
const registerUser = asynchandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apierror(400, "All fields are required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apierror(409, "User with email or username already exists");
  }
  const avatorLocalpath = req.files?.avator[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatorLocalpath) {
    throw new apierror(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatorLocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new apierror(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const usercreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!usercreated) {
    throw new apierror(500, "Something went wroung while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, usercreated, "User registerd successfully"));
});

export { registerUser };
