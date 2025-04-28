import cron from "node-cron";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

async function checkExpiringPasses() {
  console.log("🔄 Checking for expiring passes...");

  const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error("❌ Missing RESEND_API_KEY. Please check your .env.local file.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/check-expiry`);
    const data = await res.json();
    console.log("✅ API Response:", data);

    const { users } = data;

    if (!users || users.length === 0) {
      console.log("✅ No expiring passes today.");
      return;
    }

    const resend = new Resend(RESEND_API_KEY);

    for (const user of users) {
      console.log(`📨 Sending email to ${user.email} for route ${user.route}`);

      try {
        const emailResponse = await resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: user.email,
          subject: "⏳ Your Travel Pass is Expiring Soon",
          text: `Dear ${user.name},\n\nYour travel pass for route ${user.route} will expire on ${user.expiryDate}. Please renew it to continue enjoying the service.\n\nBest regards,\nYour Transport Service`,
        });

        console.log(`📩 Email sent response:`, emailResponse);
      } catch (emailError) {
        console.error("❌ Email sending error:", emailError);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching expiring passes:", error);
  }
}

// ✅ Run every day at 9:00 AM
cron.schedule("0 9 * * *", () => {
  console.log("🕘 Running scheduled job...");
  checkExpiringPasses();
});

// Run immediately for testing
checkExpiringPasses();

console.log("✅ Cron job is running...");
