import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name:{type :string, required: true},
        email:{type :string, required: true, unique: true},
        password:{type :string, required: true},
        ProfilePic:{type :string, required: true},
        isOnline:{type :boolean, default: false},
        lastOnline:{type :Date, default: Date.now},
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save' ,async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;