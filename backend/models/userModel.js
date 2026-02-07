import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"this is required"],
    },
    email: {
        type: String,
        required: [true,"email is required"],
        unique:true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true,"password is required"],
        minLength: 6,
    },
    avatar: {
        type: String,
        default:"",
    },
   passwordResetToken :String,
   passwordResetExpires :Date,
    favourites: [
  {
    id: { type: String, required: true },
    name: String,
    artist_name: String,
    image: String,
    duration: Number,
    audio: String,
  }
]

  
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))return ;
      

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

userSchema.methods.comparePassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
};
const  User =mongoose.model("User",userSchema);
export default User;


