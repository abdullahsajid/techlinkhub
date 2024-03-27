const candidateRepository = require("../database/repository/candidate-repo");
const jwt = require("jsonwebtoken");

//business logic
class CandidateService {
  constructor() {
    this.repository = new candidateRepository();
    this.token = null;
  }

  async signUp(userData) {
    const { email, password, name } = userData;
    const userAdded = await this.repository.createUser({
      email,
      password,
      name,
    });

    if (userAdded?.success === false) {
      return userAdded;
    } else if (
      userAdded &&
      userAdded[0] &&
      userAdded[0][0] &&
      userAdded[0][0].id
    ) {
      let tokenId = userAdded[0][0].id;
      this.token = await jwt.sign(
        { email: email, id: tokenId },
        process.env.JWT_AUTH,
        { expiresIn: "24h" }
      );
      return userAdded[0][0];
    }
  }

  async login(userData) {
    const { email, password } = userData;
    const loginData = await this.repository.findUser({ email, password });
    // console.log(loginData)
    if (loginData.success === false) {
      return loginData;
    } else if (
      loginData &&
      loginData[0] &&
      loginData[0][0] &&
      loginData[0][0].id
    ) {
      let tokenId = loginData[0][0].id;
      this.token = await jwt.sign(
        { id: tokenId, email: email },
        process.env.JWT_AUTH,
        { expiresIn: "24h" }
      );
      return loginData[0][0];
    }
  }

  async profile(profileData) {
    const { name, bio, about, education, banner, avatar, experience, userId } =
      profileData;
    const profileDetail = await this.repository.createProfile({
      name,
      bio,
      about,
      education,
      banner,
      avatar,
      experience,
      userId,
    });
    return profileDetail;
  }

  async skills({ skill_name, userId }) {
    const userSkills = await this.repository.addSkills({ skill_name, userId });
    return userSkills;
  }

  async socialLinks({ name, link, userId }) {
    const userLinks = await this.repository.addSocialLinks({
      name,
      link,
      userId,
    });
    return userLinks;
  }

  async profileDetails({ id }) {
    const profile = await this.repository.getProfile({ id });
    return profile;
  }

  async userPost({ content, url, userId }) {
    const post = await this.repository.post({ content, url, userId });
    return post;
  }

  async userProfiles() {
    const profile = await this.repository.getProfiles();
    return profile;
  }

  async userComment({ comment, postId, userId }) {
    const comments = await this.repository.postComment({
      comment,
      postId,
      userId,
    });
    return comments;
  }

  async getUserComments({ id }) {
    const comments = await this.repository.getComments({ id });
    return comments;
  }

  async getUserLikes({ id }) {
    const comments = await this.repository.getLikes({ id });
    return comments;
  }

  async userLike({ postId, userId }) {
    const id = postId;
    const likes = await this.repository.getLikes({ id });
    const data = likes[0];
    const userLike = await this.repository.postLike({ postId, userId, data });
    return userLike;
  }

  async getLoginUserPost({ id }) {
    const data = await this.repository.getUserPost({ id });
    return data;
  }

  // async userPostImg({img,postId,userId}){
  //     const postImg = await this.repository.postImg({img,postId,userId})
  //     return postImg
  // }

  async updateProfileDetails(id, updateData) {
    const profile = await this.repository.getProfile({ id });
    const data = profile[0];
    const updateProfile = await this.repository.updateProfile(data, updateData);
    return updateProfile;
  }


  async getToken() {
    return this.token;
  }
}

module.exports = CandidateService;
