const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/generate-project-idea", async (req, res) => {
    const frontend = req.query.frontend || 'HTML, CSS, JavaScript';
    const backend = req.query.backend || 'Node.js';
    const domain = req.query.domain || 'General';
    const additionalInput = req.query.additionalInput || '';

    const prompt = `
Provide a project idea in the following JSON format:
{
    "title": "Project Title",
    "description": "Short description of the project",
    "technologies": ["List", "of", "technologies"],
    "hours": Estimated time to build the project in hours 
}

Example:
{
    "title": "Simple Weather App",
    "description": "This project involves building a simple web-based weather application using an open weather API. The application will take a user's location as input and display the current weather conditions for that location.",
    "technologies": ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
    "hours": 12
}

Now, provide a fun and risque project idea in the same format, using ${frontend} for frontend and ${backend} for backend in the domain of ${domain}. Include any additional preferences: ${additionalInput}.
Also make sure that the project duration is under 24 hours.Return the description of the project of format: "UwU user chan" only, like sassy 4chan weeb. It needs to be hilarious and NSFW.
Make sure the response is crisp and fun and challenging.
Use only the appropriate JSON syntax. Make sure you don't include anything other than the things mentioned.
`;
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content: prompt
                    
                    },
                ],
                max_tokens: 200,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            },
        );

        const projectIdea = response.data.choices[0].message.content.trim();
        res.json({ projectIdea });
    } catch (error) {
        console.error("Error generating project idea:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        } else if (error.request) {
            console.error("Request data:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        res.status(500).json({ error: "Failed to generate project idea" });
    }
});

module.exports = app;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});