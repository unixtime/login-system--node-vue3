import { Document, Model, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces';

export interface IUserModel extends IUser, Document {
     comparePassword(userPassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
     {
          firstname: {
               type: String,
               required: true,
          },
          lastname: {
               type: String,
               required: true,
          },
          password: {
               type: String,
               required: true,
          },
          email: {
               type: String,
               required: true,
               unique: true,
          },
          verified: {
               type: Boolean,
               default: false,
          },
          code: {
               type: String,
          },
     },
     {
          timestamps: true,
     }
);

UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
     const user: IUser = this as IUserModel;

     return await bcrypt.compare(userPassword, <string>user.password).catch(() => false);
};

const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

export default User;
