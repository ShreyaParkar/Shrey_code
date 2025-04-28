import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Pass from "@/lib/models/pass/pass.model";
import { Resend } from "resend";
import { users } from "@clerk/clerk-sdk-node"; // ✅ Fetch user details

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await connect();

    const today = new Date();
    const threeDaysBeforeExpiry = new Date();
    threeDaysBeforeExpiry.setDate(today.getDate() + 3);

    // ✅ Find passes expiring in 3 days
    const expiringPasses = await Pass.find({
      expiryDate: { $lte: threeDaysBeforeExpiry, $gte: today },
    });

    if (!expiringPasses.length) {
      return NextResponse.json({ message: "No expiring passes today" }, { status: 200 });
    }

    for (const pass of expiringPasses) {
      const user = await users.getUser(pass.userId);
      if (!user || !user.emailAddresses.length) continue;

      const userEmail = user.emailAddresses[0].emailAddress;
      const expiryDate = new Date(pass.expiryDate).toDateString();

      console.log(`📩 Sending email to ${userEmail} for expiring pass.`);

      await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: userEmail,
        subject: "🚨 Your Travel Pass is Expiring Soon!",
        text: `Hello ${user.firstName || "User"},\n\nYour travel pass will expire on ${expiryDate}. Renew now!\n\nThanks, Your Transport Service.`,
      });
    }

    return NextResponse.json({ message: "Pass expiry emails sent" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
