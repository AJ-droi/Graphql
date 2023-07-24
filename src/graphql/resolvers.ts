import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import speakeasy from 'speakeasy';
import User from '../models/user'; // Assuming you have a User model

const SECRET_KEY = 'your-secret-key'; // Replace with your secret key for JWT

const generateJWTToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};


const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await User.find()
      console.log(users)
      return users
    }
  },
  Mutation: {
    registerUser: async (_:any, { email, password, name}: {email:string, password:string, name:string}) => {
      try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('Email already exists');
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const newUser = new User({
          email,
          password: hashedPassword,
          name
        });
        await newUser.save();

        // Generate and return JWT token
        const token = generateJWTToken(newUser._id);
        return { token };
      } catch (error) {
        console.error('Error during registration:', error);
        throw new Error('Internal server error');
      }
    },

    loginUser: async (_:any, { email, password } : {email:string, password:string}) => {
      try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error('Invalid credentials');
        }

        // Generate and return JWT token
        const token = generateJWTToken(user._id);
        return {user, token };
      } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Internal server error');
      }
    },

    // verifyOTP: async (_, { userId, otp } : {userId:string, otp:string}) => {
    //   try {
    //     // Fetch the user from the database
    //     const user = await User.findById(userId);
    //     if (!user) {
    //       throw new Error('User not found');
    //     }

    //     // Verify the OTP
    //     const verified = speakeasy.totp.verify({
    //       secret: user.otpSecret,
    //       encoding: 'base32',
    //       token: otp,
    //     });

    //     if (verified) {
    //       return { message: 'OTP verified successfully' };
    //     } else {
    //       throw new Error('Invalid OTP');
    //     }
    //   } catch (error) {
    //     console.error('Error during OTP verification:', error);
    //     throw new Error('Internal server error');
    //   }
    // },

    updateUser: async (_:any, { token, name}:{token:string, name:string}) => {
      try {
        // Fetch the user from the database

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const {userId} = decodedToken as {[key:string]:string}
       
        console.log("hello")
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        // Update user data
        if (name) {
          user.name = name;
        }


        await user.save();

        const updatedUser = await User.findById(userId);

        return { message: 'User updated successfully', user:updatedUser };
      } catch (error) {
        console.error('Error during user update:', error);
        throw new Error('Internal server error');
      }
    },

    deleteUser: async (_:any, { userId } : {userId:string}) => {
      try {
        // Delete the user from the database
        await User.findByIdAndDelete(userId);

        return { message: 'User deleted successfully' };
      } catch (error) {
        console.error('Error during user deletion:', error);
        throw new Error('Internal server error');
      }
    },
  },
};

export default resolvers;




