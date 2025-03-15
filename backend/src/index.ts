import express from 'express';
import { placeInfo } from './controllers/places';

const app = express();
const PORT = 3000;
app.use(express.json());

app.post('/api/places',async (req,res)=>{
    const {placename} = req.body;
   const data= await  placeInfo(placename)
    res.send(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});