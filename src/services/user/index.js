const { User } = require("../../lib/sequelize");
const Service = require("../service");

class UserService extends Service {
  static getUserById = async (userId) => {
    try {
      const findUser = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!findUser) {
        return this.handleError({
          message: "Wrong User ID!",
          statusCode: 400,
        });
      }

      delete findUser.dataValues.password;

      return this.handleSuccess({
        message: `You Found User ID: ${userId}`,
        data: findUser,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Can't reach user server",
      });
    }
  };

  static editAvatarUser = async (id, file) => {
    try {
      const findUser = await User.findOne({
        where: {
          id,
        },
      });
      if (!findUser) {
        return this.handleError({
          statusCode: 400,
          message: "No user found!",
        });
      }
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "avatar";
      const { filename } = file;

      const newAvatar = `${uploadFileDomain}/${filePath}/${filename}`;

      const updatedAvatar = await User.update(
        {
          photo_profile: newAvatar,
        },
        {
          where: {
            id,
          },
        }
      );

      const userInfo = await User.findByPk(id);

      return this.handleSuccess({
        statusCode: 200,
        message: "Avatar edited successfully!",
        data: userInfo,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Server error!",
      });
    }
  };
}

module.exports = UserService;
