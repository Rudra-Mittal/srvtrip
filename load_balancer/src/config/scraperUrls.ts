import dotenv from 'dotenv';
dotenv.config();

export const scraperServers=[
    {id:1,url:process.env.SCRAPER1_URL || "http://localhost:3000/"},
    {id:2,url:process.env.SCRAPER2_URL || "http://localhost:3001/"},
];