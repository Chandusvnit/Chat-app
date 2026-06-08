import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        ProfilePic: { type: String, default: "" },
        isOnline: { type: Boolean, default: false },
        lastOnline: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);


userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    // If the password hasn't been modified, just return early to stop execution
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // NO next() call needed here! Mongoose automatically proceeds when this async function resolves.
});

const User = mongoose.model('User', userSchema);
export default User;