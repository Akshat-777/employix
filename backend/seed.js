import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME.trim(),
    api_key: process.env.API_KEY.trim(),
    api_secret: process.env.API_SECRET.trim()
});

const uploadToCloudinary = async (url) => {
    try {
        const result = await cloudinary.uploader.upload(url, {
            folder: "employix_logos"
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed for:", url, error.message);
        return null;
    }
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await User.deleteMany({});
        await Company.deleteMany({});
        await Job.deleteMany({});
        console.log("Cleared existing data.");

        // Create a Recruiter User
        const hashedPassword = await bcrypt.hash("password123", 10);
        const recruiter = await User.create({
            fullname: "Test Recruiter",
            email: "recruiter@example.com",
            phoneNumber: 1234567890,
            password: hashedPassword,
            role: "recruiter"
        });
        console.log("Created recruiter user.");

        // Logos to upload
        console.log("Uploading logos to Cloudinary...");
        const googleLogo = await uploadToCloudinary("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
        const microsoftLogo = await uploadToCloudinary("https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31");
        const amazonLogo = await uploadToCloudinary("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png");

        // Create Companies
        const google = await Company.create({
            name: "Google Inc.",
            description: "A global leader in technology and search engines.",
            website: "https://www.google.com",
            location: "Mountain View, CA",
            logo: googleLogo || "https://www.google.com/s2/favicons?domain=google.com&sz=128",
            userId: recruiter._id
        });

        const microsoft = await Company.create({
            name: "Microsoft",
            description: "Empowering every person and every organization on the planet to achieve more.",
            website: "https://www.microsoft.com",
            location: "Redmond, WA",
            logo: microsoftLogo || "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
            userId: recruiter._id
        });

        const amazon = await Company.create({
            name: "Amazon",
            description: "Earth's most customer-centric company.",
            website: "https://www.amazon.com",
            location: "Seattle, WA",
            logo: amazonLogo || "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
            userId: recruiter._id
        });
        console.log("Created companies with Cloudinary logos.");

        // Create Sample Jobs
        const jobs = [
            {
                title: "Frontend Developer",
                description: "Develop modern web applications using React and Next.js.",
                requirements: ["React", "TypeScript", "Tailwind CSS"],
                salary: 120,
                experienceLevel: 2,
                location: "Remote",
                jobType: "Full-Time",
                position: 1,
                company: google._id,
                created_by: recruiter._id
            },
            {
                title: "Backend Engineer",
                description: "Build scalable APIs using Node.js and MongoDB.",
                requirements: ["Node.js", "Express", "MongoDB"],
                salary: 130,
                experienceLevel: 3,
                location: "New York, NY",
                jobType: "Full-Time",
                position: 2,
                company: google._id,
                created_by: recruiter._id
            },
            {
                title: "Cloud Architect",
                description: "Design and implement cloud infrastructure solutions.",
                requirements: ["Azure", "Terraform", "Kubernetes"],
                salary: 150,
                experienceLevel: 5,
                location: "Remote",
                jobType: "Full-Time",
                position: 1,
                company: microsoft._id,
                created_by: recruiter._id
            },
            {
                title: "SDE-II",
                description: "Work on large-scale distributed systems.",
                requirements: ["Java", "AWS", "DynamoDB"],
                salary: 140,
                experienceLevel: 4,
                location: "Seattle, WA",
                jobType: "Full-Time",
                position: 3,
                company: amazon._id,
                created_by: recruiter._id
            }
        ];

        await Job.insertMany(jobs);
        console.log("Created sample jobs.");

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
};

seedData();
