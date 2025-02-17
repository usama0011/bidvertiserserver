import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { token } = req.body;
  const secretKey = "6LetftkqAAAAAOQc7xWzicIFK-y5ScSaYF8KLPrO"; // Replace with your v3 secret key

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      {},
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    if (response.data.success && response.data.score > 0.5) {
      res.json({ success: true, message: "reCAPTCHA v3 verified" });
    } else {
      res.status(400).json({ success: false, message: "Verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
