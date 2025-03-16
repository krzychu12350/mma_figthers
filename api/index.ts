import express from "express";
const app = express();

app.get("/", (req: any, res: { json: (arg0: { message: string }) => any; }) => {
  res.json({ message: "Express on Vercel" });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
