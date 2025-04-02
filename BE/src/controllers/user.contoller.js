function register(req, res) {
  const { username, password } = req.body;
  if ([username, password].some((field) => field === "")) {
    return res.status(301).json({ message: "Username/password compulsory" });
  }
}
