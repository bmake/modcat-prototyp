module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/modcat/" : "/",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  },
};
