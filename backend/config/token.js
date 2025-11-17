import jwt from "jsonwebtoken";

const gentoken = async (_id) => {
  try {
    // make sure JWT contains _id, so isauth can read it
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "10d" });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export default gentoken;
